import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useMediaQuery } from "react-responsive";
import { City } from "./City";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Canvas camera={{position: [0, 0, 15], fov: 45 }}>
       
        <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
         />

         <HeroLights />
         <Particles count={100} />
        <group
        scale={isMobile? 0.1 : 0.12}
        position={[1, -2.5, 1]}
        rotation={[0, -Math.PI /4, 0]}
        > 
        <City />
        </group>
    </Canvas>
  )
}

export default HeroExperience