import React, { useState, useEffect, useRef } from "react";
import { useCall } from "../socket/CallContext";
import { FaBars, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaVideo, FaVideoSlash, FaPhoneAlt } from "react-icons/fa";
import { Howl } from "howler";
import { useLocation } from "react-router-dom";

export default function CallOverlay() {
  const {
    receivingCall,
    caller,
    callAccepted,
    isCalling,
    callRejectedPopUp,
    callRejectedUser,
    myVideoRef,
    receiverVideoRef,
    acceptCall,
    rejectCall,
    endCall,
    startCall,
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    isAudioUnlocked,
    unlockAudio,
  } = useCall() || {};

  const ringtoneRef = useRef(null);
  const location = useLocation();

  // Create ringtone only when needed (not on every render)
  const createRingtone = () => {
    if (!ringtoneRef.current) {
      console.log("Creating ringtone...");
      ringtoneRef.current = new Howl({ 
        src: ["/audio-call.mp3"], 
        loop: true, 
        volume: 1.0,
        preload: false, // Don't preload to avoid AudioContext issues
        html5: true // Use HTML5 audio instead of Web Audio API
      });
      console.log("Ringtone created:", ringtoneRef.current);
    }
  };

  // Check if ringtone should be enabled on current page
  const shouldPlayRington = () => {
    const allowedPages = ['/', '/post/', '/gridview', '/mapview'];
    return allowedPages.some(page => location.pathname.startsWith(page));
  };

  // Play ringtone ONLY when there's an actual incoming call
  useEffect(() => {
    // Only play ringtone if we're receiving a call, not accepted yet, and on allowed page
    if (receivingCall && !callAccepted && shouldPlayRington()) {
      // Create ringtone only when needed
      createRingtone();
      
      if (ringtoneRef.current) {
        console.log("Playing ringtone for incoming call popup on page:", location.pathname);
        ringtoneRef.current.play();
      }
    } else if (ringtoneRef.current && ringtoneRef.current.playing()) {
      console.log("Stopping ringtone on page:", location.pathname);
      ringtoneRef.current.stop();
    }
  }, [receivingCall, callAccepted, location.pathname]);

  // Cleanup ringtone when component unmounts
  useEffect(() => {
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
      }
    };
  }, []);

  // Ensure local video (myVideoRef) plays when call is accepted
  useEffect(() => {
    if ((callAccepted || isCalling) && myVideoRef?.current) {
      const video = myVideoRef.current;
      // Ensure the video element has the stream and plays
      if (video.srcObject) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Error playing local video:", err);
          });
        }
      }
    }
  }, [callAccepted, isCalling]);

  // Toggles now come from context to control real tracks

  // Show overlay when receiving call, call is accepted, or user is calling
  if (!receivingCall && !callAccepted && !isCalling && !callRejectedPopUp) return null;

  console.log("CallOverlay rendering:", { receivingCall, callAccepted, isCalling, callRejectedPopUp, caller, isAudioUnlocked });

  // Show call rejected popup
  if (callRejectedPopUp) {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex flex-col items-center">
            <p className="font-black text-xl mb-2">Call Rejected From...</p>
            <img
              src={callRejectedUser?.profilepic || "/default-avatar.png"}
              alt="Caller"
              className="w-20 h-20 rounded-full border-4 border-green-500"
            />
            <h3 className="text-lg font-bold mt-3">{callRejectedUser?.name}</h3>
            <div className="flex gap-4 mt-5">
              <button
                type="button"
                onClick={() => {
                  console.log("Call Again clicked for user:", callRejectedUser?._id);
                  if (callRejectedUser?._id) {
                    startCall(callRejectedUser._id);
                  }
                }}
                className="bg-green-500 text-white px-4 py-1 rounded-lg w-28 flex gap-2 justify-center items-center"
              >
                Call Again <FaPhoneAlt />
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Back button clicked");
                  endCall(); // This will clean up the call rejected state
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-28 flex gap-2 justify-center items-center"
              >
                Back <FaPhoneSlash />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show incoming call popup (only when receiving call and not accepted)
  if (receivingCall && !callAccepted) {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex flex-col items-center">
            <p className="font-black text-xl mb-2">Call From...</p>
            <img
              src={caller?.profilepic || "/default-avatar.png"}
              alt="Caller"
              className="w-20 h-20 rounded-full border-4 border-green-500"
            />
            <h3 className="text-lg font-bold mt-3">{caller?.name}</h3>
            <p className="text-sm text-gray-500">{caller?.email}</p>
            <div className="flex gap-4 mt-5">
              <button
                type="button"
                onClick={() => {
                  console.log("Accepting call");
                  if (ringtoneRef.current) {
                    ringtoneRef.current.stop();
                  }
                  acceptCall();
                }}
                className="bg-green-500 text-white px-4 py-1 rounded-lg w-28 flex gap-2 justify-center items-center"
              >
                Accept <FaPhoneAlt />
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Rejecting call");
                  if (ringtoneRef.current) {
                    ringtoneRef.current.stop();
                  }
                  rejectCall();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-28 flex gap-2 justify-center items-center"
              >
                Reject <FaPhoneSlash />
              </button>
            </div>
            {!isAudioUnlocked && (
              <button 
                onClick={() => {
                  console.log("Enabling audio");
                  unlockAudio();
                }} 
                className="mt-3 px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Enable sound
              </button>
            )}
            {/* Debug button to test ringtone */}
            <button 
              onClick={() => {
                console.log("Testing ringtone manually on page:", location.pathname);
                if (shouldPlayRington()) {
                  createRingtone();
                  if (ringtoneRef.current) {
                    ringtoneRef.current.play();
                  }
                } else {
                  console.log("Rington disabled on this page:", location.pathname);
                }
              }} 
              className="mt-2 px-3 py-1 rounded bg-yellow-600 text-white text-sm"
            >
              Test Ringtone
            </button>
            {/* Show current page info for debugging */}
            <div className="mt-2 text-xs text-gray-500">
              Page: {location.pathname} | Rington: {shouldPlayRington() ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show video call interface (when call is accepted or user is calling)
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <video ref={receiverVideoRef} autoPlay className="absolute top-0 left-0 w-full h-full object-contain" />
      <div className="absolute bottom-[75px] right-1 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <video ref={myVideoRef} autoPlay muted playsInline className="w-32 h-40 md:w-56 md:h-52 object-cover" />
      </div>

      {/* Call controls */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4 z-10">
        <button 
          onClick={() => {
            console.log("Ending call");
            endCall();
          }} 
          className="px-4 py-2 rounded-full bg-red-600 text-white flex items-center gap-2"
        >
          <FaPhoneSlash /> End Call
        </button>
        
        {/* Toggle Mic */}
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-full text-white flex items-center gap-2 transition-colors
             ${isMicOn ? "bg-green-600" : "bg-red-600"}`}
        >
          {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        {/* Toggle Video */}
        <button
          onClick={toggleCam}
          className={`px-4 py-2 rounded-full text-white flex items-center gap-2 transition-colors
             ${isCamOn ? "bg-green-600" : "bg-red-600"}`}
        >
          {isCamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
      </div>

      {/* Show calling status when user is calling but call hasn't been accepted yet */}
      {isCalling && !callAccepted && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg px-4 py-2 shadow-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">Calling...</div>
            <div className="text-sm text-gray-600">Waiting for answer</div>
          </div>
        </div>
      )}
    </div>
  );
}