import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Contact from "./pages/Contact";
import GridView from "./pages/GridView";
import MapView from "./pages/MapView";
import Services from "./pages/Services";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import DepartmentRoute from "./components/DepartmentRoute";
import CreatePost from "./pages/CreatePost";
import Failed from "./pages/Failed";
import Testing from "./pages/Testing";
import Post from "./pages/Post";
import Sample from "./pages/Sample";
import ScrollToTop from "./components/ScrollToTop";
import { CallProvider } from "./socket/CallContext";
import CallOverlay from "./components/CallOverlay";
import UpdatePost from "./pages/UpdatePost";
import { useTheme } from "./components/ThemeContext";
import Drivepost from "./pages/Drivepost";
import UpdateDrivePost from "./pages/UpdateDrivePost";
import DriveRoute from "./components/DriveRoute";
import Vechicle from "./pages/Vechicle";
import VehicleGrid from "./pages/VehicleGrid";
import DriveMap from "./pages/DriveMap";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <BrowserRouter>
    <CallProvider>
    <div className="bg-white dark:bg-zinc-800 dark:text-gray-200 dark:min-h-screen">
    <Header />
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route element={<PrivateRoute />} >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/not-allowed" element={<Failed />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/drive/:driveId" element={<Vechicle />} />
        </Route>

        <Route element={<DepartmentRoute />} >
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        <Route element={<DriveRoute />} >
        <Route path="/create-drive" element={<Drivepost />} />
        <Route path="/update-drive/:driveId" element={<UpdateDrivePost />} />
        
        </Route>
        
        
        <Route path="/gridview" element={<GridView />} />
        <Route path="/vehiclegrid" element={<VehicleGrid />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/test/:postId" element={<Testing />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/drivemap" element={<DriveMap />} />
      </Routes>
      <CallOverlay />
      <Footer />
      </div>
    </CallProvider>
    </BrowserRouter>
  )
}
