import MobileSidebar from '../components/MobileSidebar'
import ShowMap from '../components/ShowMap'

export default function MapView() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="">
        <MobileSidebar />
      </div>

      {/* Map */}
      <div className="flex-1">
        <ShowMap />
      </div>
    </div>
  )
}
