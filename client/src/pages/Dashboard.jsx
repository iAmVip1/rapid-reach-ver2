import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // 👈 if you're storing user in Redux
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashSideMobile from "../components/DashSideMobile";
import { FaBars } from "react-icons/fa";
import DashDocuments from "../components/DashDocuments";
import DashHome from "../components/DashHome";
import DashBlood from "../components/DashBlood";
import DashFire from "../components/DashFire";
import DashPoliceDep from "../components/DashPoliceDep";
import DashHospital from "../components/DashHospital";
import DashUsers from "../components/DashUsers";
import DashDriveDocs from "../components/DashDriveDocs";
import DashAmbulance from "../components/DashAmbulance";
import DashPoliceVec from "../components/DashPoliceVec";
import DashFireTruck from "../components/DashFireTruck";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState(" ");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ✅ Get current user (assuming Redux)
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // ✅ Define role-based access
  const hasSidebarAccess =
    currentUser?.isAdmin || currentUser?.isHospital || currentUser?.isFireDep || currentUser?.isPoliceDep || currentUser?.isBlood
    || currentUser?.isPoliceVAn || currentUser?.isAmbulance || currentUser?.isFireTruck;

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar (only for roles) */}
      {hasSidebarAccess && (
        <div className="hidden md:block h-screen">
          <DashSidebar />
        </div>
      )}

      {/* Mobile Sidebar (only for roles) */}
      {hasSidebarAccess && (
        <DashSideMobile
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 relative">
        {/* Mobile Hamburger Button (only for roles) */}
        {hasSidebarAccess && (
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-2xl text-black"
            >
              <FaBars />
            </button>
          </div>
        )}

       
        {tab === "home" && <DashHome />}
        {tab === "profile" && <DashProfile />}
        {tab === "documents" && <DashDocuments />}
        {tab === "drive" && <DashDriveDocs />}
        {tab === "users" && <DashUsers />}
        {tab === "blood" && <DashBlood />}
        {tab === "fire" && <DashFire />}
        {tab === "policeDep" && <DashPoliceDep />}
        {tab === "hospital" && <DashHospital />}
        {tab === "ambulance" && <DashAmbulance />}
        {tab === "poilcevec" && <DashPoliceVec />}
        {tab === "firetruck" && <DashFireTruck />}
        
      </div>
    </div>
  );
}
