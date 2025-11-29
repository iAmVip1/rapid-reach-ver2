import Instant from "../../../for uploading/instant.jpg";
import Emergencycontact from "../../../for uploading/emergency_contact.jpg";
import Medical from "../../../for uploading/medical_services.jpg";
import Real from "../../../for uploading/real_time.jpg";


const AnimatedCounter = () => {
  return (
    <div id="counter" className="px-6 md:px-16 py-10 xl:mt-0 mt-32">
      <section className="w-full flex flex-col gap-20 px-6 md:px-16 py-10">
 {/* SECTION 2 — Desktop reversed (Image | Text) but mobile stays Text → Image */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">

        {/* TEXT — always first in mobile (because flex-col) */}
        <div className="md:w-[70%] w-full space-y-5">
          <h2 className="text-3xl font-bold">24/7 Emergency Support</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Get instant access to nearby emergency services including fire 
            stations, police departments, and rescue vehicles.
          </p>
        </div>

        {/* IMAGE */}
        <div className="md:w-[30%] w-full">
          <img 
            src={Emergencycontact} 
            alt="Emergency" 
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </div>

      </div>

      {/* SECTION 1 — Text 70% | Image 30% */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        
        {/* TEXT — always first on mobile */}
        <div className="md:w-[70%] w-full space-y-5">
          <h2 className="text-3xl font-bold">Our Medical Services</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            We provide real-time emergency location services including ambulance, 
            hospital coordination, blood banks, and more.
          </p>
        </div>

        {/* IMAGE */}
        <div className="md:w-[30%] w-full">
          <img 
            src={Medical}
            alt="Service" 
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
    {/* TEXT */}
    <div className="md:w-[70%] w-full space-y-5">
      <h2 className="text-3xl font-bold">Instant Assistance with One Tap</h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        In case of emergency, you can immediately call the nearest emergency services, such as ambulances, fire trucks, or police vehicles. 
        The "Call Now" feature connects you directly to the service, reducing response times.
      </p>
    </div>

    {/* IMAGE */}
    <div className="md:w-[30%] w-full">
      <img 
        src={Instant} 
        alt="Call Now" 
        className="w-full h-auto rounded-2xl shadow-lg object-cover"
      />
    </div>
  </div>

    <div className="flex flex-col md:flex-row items-center gap-10">
    {/* TEXT */}
    <div className="md:w-[70%] w-full space-y-5">
      <h2 className="text-3xl font-bold">Real-Time Emergency Vehicle Tracking</h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Our platform provides live tracking of emergency vehicles, including ambulances, fire trucks, and police vehicles. 
        With real-time updates, you can track their location and arrival time, ensuring faster and more efficient responses.
      </p>
    </div>

    {/* IMAGE */}
    <div className="md:w-[30%] w-full">
      <img 
        src={Real} 
        alt="Live Tracking" 
        className="w-full h-auto rounded-2xl shadow-lg object-cover"
      />
    </div>
  </div>
     
     
    </section>
    </div>
  );
};

export default AnimatedCounter;
