import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SocketContext from "./SocketContext";
import Peer from "simple-peer/simplepeer.min.js";
import { Howl, Howler } from "howler";

const CallContext = createContext(null);

export function CallProvider({ children }) {
const currentUser = useSelector((state) => state.user.currentUser);
  const socket = SocketContext.getSocket();
  const location = useLocation();

  const hasJoined = useRef(false);
  const myVideoRef = useRef(null);
  const receiverVideoRef = useRef(null);
  const connectionRef = useRef(null);
  const streamRef = useRef(null);

  const [me, setMe] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [callRejectedPopUp, setCallRejectedPopUp] = useState(false);
  const [callRejectedUser, setCallRejectedUser] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  // ---- ringtone setup ----
  const ringtone = useRef(null);
  const attemptPlay = (videoEl) => {
    if (!videoEl) return;
    let tries = 0;
    const maxTries = 5;
    const tryPlay = () => {
      Promise.resolve(videoEl.play?.())
        .then(() => {})
        .catch(() => {
          if (tries < maxTries) {
            tries += 1;
            setTimeout(tryPlay, 250);
          }
        });
    };
    tryPlay();
  };

  const createRingtone = () => {
    if (ringtone.current) return ringtone.current; // ✅ already created
    ringtone.current = new Howl({
      src: ["/audio-call.mp3"],
      loop: true,
      volume: 1.0,
      preload: true,
    });
    return ringtone.current;
  };

  const playRingtone = () => {
    const sound = createRingtone();
    if (sound && !sound.playing()) {
      sound.play();
    }
  };

  const stopRingtone = () => {
    if (ringtone.current && ringtone.current.playing()) {
      ringtone.current.stop();
    }
  };

  // Join once and wire socket listeners
  useEffect(() => {
    if (!socket) return;
    if (currentUser && !hasJoined.current) {
      socket.emit("join", { id: currentUser._id, name: currentUser.username });
      hasJoined.current = true;
    }

    const onMe = (id) => setMe(id);
    const onOnlineUsers = (users) => setOnlineUsers(users || []);
    const onCallToUser = (data) => {
      console.log("Received call from:", data);
      setReceivingCall(true);
      setCaller(data);
      setCallerSignal(data.signal);
      playRingtone(); // 🔔 start ringtone
    };
    const onCallEnded = () => {
      endCallCleanup();
    };
    const onCallRejected = (data) => {
      setCallRejectedPopUp(true);
      setCallRejectedUser(data);
      stopRingtone();
    };

    socket.on("me", onMe);
    socket.on("online-users", onOnlineUsers);
    socket.on("callToUser", onCallToUser);
    socket.on("callEnded", onCallEnded);
    socket.on("callRejected", onCallRejected);

    return () => {
      socket.off("me", onMe);
      socket.off("online-users", onOnlineUsers);
      socket.off("callToUser", onCallToUser);
      socket.off("callEnded", onCallEnded);
      socket.off("callRejected", onCallRejected);
    };
  }, [socket, currentUser]);

  // Attempt to unlock audio on first user gesture
  useEffect(() => {
    if (isAudioUnlocked) return;

    const handler = async () => {
      try {
        createRingtone();
        if (Howler.ctx && Howler.ctx.state !== "running") {
          await Howler.ctx.resume();
        }
        setIsAudioUnlocked(true);

        // Play a silent unlock
        if (ringtone.current) {
          ringtone.current.volume(0);
          ringtone.current.play();
          ringtone.current.volume(1.0);
          ringtone.current.stop();
        }
      } catch (e) {
        console.log("Audio unlock failed:", e);
      } finally {
        window.removeEventListener("pointerdown", handler);
        window.removeEventListener("keydown", handler);
        window.removeEventListener("touchstart", handler);
      }
    };

    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [isAudioUnlocked]);

  // Ensure local video stream is attached when call is accepted or calling
  useEffect(() => {
    if ((callAccepted || isCalling) && streamRef.current && myVideoRef.current) {
      // Re-attach stream to ensure it's properly connected after component re-render
      if (myVideoRef.current.srcObject !== streamRef.current) {
        myVideoRef.current.srcObject = streamRef.current;
        myVideoRef.current.muted = true;
        myVideoRef.current.volume = 0;
        attemptPlay(myVideoRef.current);
      }
    }
  }, [callAccepted, isCalling]);

  const startCall = async (callToUserId) => {
    if (!socket || !currentUser) return;
    try {
      setIsCalling(true);
      setSelectedUserId(callToUserId);

      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      streamRef.current = currentStream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = currentStream;
        myVideoRef.current.muted = true;
        myVideoRef.current.volume = 0;
      }
      const initAudioTrack = currentStream.getAudioTracks?.()[0];
      const initVideoTrack = currentStream.getVideoTracks?.()[0];
      if (initAudioTrack) setIsMicOn(!!initAudioTrack.enabled);
      if (initVideoTrack) setIsCamOn(!!initVideoTrack.enabled);

      const peer = new Peer({ initiator: true, trickle: false, stream: currentStream });

      peer.on("signal", (data) => {
        const fromId = socket?.id || me;
        socket.emit("callToUser", {
          callToUserId,
          signalData: data,
          from: fromId,
          name: currentUser.username,
          email: currentUser.email,
          profilepic: currentUser?.profilePicture,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (receiverVideoRef.current) {
          receiverVideoRef.current.srcObject = remoteStream;
          receiverVideoRef.current.muted = false;
          receiverVideoRef.current.volume = 1.0;
          attemptPlay(receiverVideoRef.current);
        }
      });

      socket.once("callAccepted", (data) => {
        setCallAccepted(true);
        setCaller(data.from);
        peer.signal(data.signal);
      });

      connectionRef.current = peer;
    } catch (err) {
      console.error("Error accessing media device:", err);
      setIsCalling(false);
    }
  };

  const acceptCall = async () => {
    if (!socket) return;
    stopRingtone(); // 🔇 stop when accepted
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = currentStream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = currentStream;
        myVideoRef.current.muted = true;
        myVideoRef.current.volume = 0;
      }
      currentStream.getAudioTracks().forEach((t) => (t.enabled = true));
      const initAudioTrackR = currentStream.getAudioTracks?.()[0];
      const initVideoTrackR = currentStream.getVideoTracks?.()[0];
      if (initAudioTrackR) setIsMicOn(!!initAudioTrackR.enabled);
      if (initVideoTrackR) setIsCamOn(!!initVideoTrackR.enabled);

      setCallAccepted(true);
      setReceivingCall(true);

      const peer = new Peer({ initiator: false, trickle: false, stream: currentStream });
      peer.on("signal", (data) => {
        const fromId = socket?.id || me;
        socket.emit("answeredCall", { signal: data, from: fromId, to: caller.from });
      });
      peer.on("stream", (remoteStream) => {
        if (receiverVideoRef.current) {
          receiverVideoRef.current.srcObject = remoteStream;
          receiverVideoRef.current.muted = false;
          receiverVideoRef.current.volume = 1.0;
          attemptPlay(receiverVideoRef.current);
        }
      });

      if (callerSignal) peer.signal(callerSignal);
      connectionRef.current = peer;
    } catch (err) {
      console.error("Error in sending media device:", err);
    }
  };

  const rejectCall = () => {
    if (!socket || !caller) return;
    stopRingtone(); // 🔇 stop when rejected
    setReceivingCall(false);
    setCallAccepted(false);
    socket.emit("reject-call", {
      to: caller.from,
      name: currentUser?.username,
      profilepic: currentUser?.profilePicture,
    });
  };

  const endCall = () => {
    stopRingtone(); // 🔇 always stop
    let toUserId = null;
    if (caller && caller.from) toUserId = caller.from;
    else if (selectedUserId) toUserId = selectedUserId;
    if (toUserId) socket?.emit("call-ended", { to: toUserId, name: currentUser?.username });
    endCallCleanup();
  };

  const endCallCleanup = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (receiverVideoRef.current) receiverVideoRef.current.srcObject = null;
      if (myVideoRef.current) myVideoRef.current.srcObject = null;
      connectionRef.current?.destroy();
    } finally {
      stopRingtone(); // 🔇 ensure stopped
      streamRef.current = null;
      setReceivingCall(false);
      setCallAccepted(false);
      setIsCalling(false);
      setSelectedUserId(null);
      setCallRejectedPopUp(false);
      setCallRejectedUser(null);
      setIsMicOn(true);
      setIsCamOn(true);
    }
  };

  const toggleMic = () => {
    const currentStream = streamRef.current;
    if (!currentStream) return;
    const track = currentStream.getAudioTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMicOn(track.enabled);
  };

  const toggleCam = () => {
    const currentStream = streamRef.current;
    if (!currentStream) return;
    const track = currentStream.getVideoTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsCamOn(track.enabled);
  };

  const unlockAudio = async () => {
    try {
      createRingtone();
      if (Howler.ctx && Howler.ctx.state !== "running") {
        await Howler.ctx.resume();
      }
      setIsAudioUnlocked(true);

      if (ringtone.current) {
        ringtone.current.volume(0);
        ringtone.current.play();
        ringtone.current.stop();
        ringtone.current.volume(1.0);
      }
    } catch (e) {
      console.log("Audio unlock failed:", e);
    }
  };

  const value = useMemo(
    () => ({
      me,
      onlineUsers,
      receivingCall,
      caller,
      callerSignal,
      callAccepted,
      isCalling,
      callRejectedPopUp,
      callRejectedUser,
      myVideoRef,
      receiverVideoRef,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      isMicOn,
      isCamOn,
      toggleMic,
      toggleCam,
      isAudioUnlocked,
      unlockAudio,
    }),
    [
      me,
      onlineUsers,
      receivingCall,
      caller,
      callerSignal,
      callAccepted,
      isCalling,
      callRejectedPopUp,
      callRejectedUser,
      isMicOn,
      isCamOn,
      isAudioUnlocked,
    ]
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
export function useCall() {
  return useContext(CallContext);
}