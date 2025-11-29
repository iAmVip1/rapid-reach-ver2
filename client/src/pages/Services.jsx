import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { useSelector } from "react-redux";
import Hospital from "../../../for uploading/hospital.jpg";
import FireDep from "../../../for uploading/firedep.jpg";
import PoliceDep from "../../../for uploading/policedep.jpg";
import Firevec from "../../../for uploading/firevech.jpg";
import PoliceVec from "../../../for uploading/policevec.jpg";
import Ambulance from "../../../for uploading/ambulance.jpg";
import Bloodbank from "../../../for uploading/bloodbank.jpg";

export default function Services() {
  const { currentUser } = useSelector((state) => state.user);

  // Hide specific cards depending on user type
  const hide = {
    hospital: currentUser?.isHospital,
    fireDep: currentUser?.isFireDep,
    policeDep: currentUser?.isPoliceDep,
    blood: currentUser?.isBlood,
    policeVan: currentUser?.isPoliceVan,
    ambulance: currentUser?.isAmbulance,
    fireTruck: currentUser?.isFireTruck,
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="md:text-5xl sm:text-4xl text-xl font-bold">Find Here</p>
        <ReactTyped
          className="md:text-5xl sm:text-4xl text-xl font-bold"
          strings={[
            "Fire Department",
            "Fire Truck",
            "Police Department",
            "Hospital",
            "Police Vehicle",
            "Ambulance",
            "Blood Bank",
          ]}
          typeSpeed={120}
          backSpeed={140}
          loop
        />
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="flex flex-wrap justify-center gap-6">

          {/* Fire Department */}
          {!hide.fireDep && (
            <Link to={"/gridview?category=fire+department"}>
              <ServiceCard img={FireDep} title="Fire Department" />
            </Link>
          )}

          {/* Police Department */}
          {!hide.policeDep && (
            <Link to={"/gridview?category=Police+Department"}>
              <ServiceCard img={PoliceDep} title="Police Department" />
            </Link>
          )}

          {/* Hospital */}
          {!hide.hospital && (
            <Link to={"/gridview?category=hospital"}>
              <ServiceCard img={Hospital} title="Hospital" />
            </Link>
          )}

          {/* Fire Truck */}
          {!hide.fireTruck && (
            <Link to={"/vehiclegrid?category=fire-truck"}>
              <ServiceCard img={Firevec} title="Fire Truck" />
            </Link>
          )}

          {/* Police Vehicle */}
          {!hide.policeVan && (
            <Link to={"/vehiclegrid?category=police-vehicle"}>
              <ServiceCard img={PoliceVec} title="Police Vehicle" />
            </Link>
          )}

          {/* Ambulance */}
          {!hide.ambulance && (
            <Link to={"/vehiclegrid?category=Ambulance"}>
              <ServiceCard img={Ambulance} title="Ambulance" />
            </Link>
          )}

          {/* Blood Bank */}
          {!hide.blood && (
            <Link to={"/gridview?category=Blood+Bank"}>
              <ServiceCard img={Bloodbank} title="Blood Bank" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔧 Reusable card component
function ServiceCard({ img, title }) {
  return (
    <div
      className="bg-white shadow-md hover:shadow-lg cursor-pointer
        transition-all transform overflow-hidden rounded-lg w-full sm:w-[330px]"
    >
      <img
        src={img}
        alt={title}
        className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full text-center">
        <p className="text-sm font-semibold dark:text-gray-900">{title}</p>
      </div>
    </div>
  );
}
