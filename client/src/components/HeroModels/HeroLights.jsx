import * as THREE from 'three';
import { useTheme } from '../ThemeContext';

const HeroLights = () => {
  const { theme } = useTheme();
  return (
    <>
   <spotLight position={[2, 5, 6]}
   angle={0.15}
   intensity={100}
   penumbra={0.2}
   color="white"
   />
   
   <spotLight position={[4, 5, 4]}
   angle={0.3}
   intensity={40}
   penumbra={0.5}
   color="#E6ED00"
   />

   <spotLight position={[-3, 5, 5]}
   angle={0.4}
   intensity={60}
   penumbra={1}
   color="#FCC703"
   />

   <primitive
   object={new THREE.RectAreaLight('#E39800', 8, 3, 2)}
   position={[1, 3, 4]}
   intensity={15}
   rotation={[-Math.PI / 4, Math.PI / 4, 0]}
   />

   <pointLight
   position={[0, 1, 0]}
   intensity={10}
   color='#E37D00'
   />

   <pointLight
   position={[1, 2, -2]}
   intensity={10}
   color='#E3D000'
   />

   {theme === 'light' && (
     <>
       <directionalLight position={[1, 1, 1]} intensity={2} />
       <ambientLight intensity={0.5} />
     </>
   )}
   <hemisphereLight skyColor="#D9EEFA" groundColor="#000000" />
    </>
  )
}

export default HeroLights
