import { useGLTF } from '@react-three/drei'

export function City(props) {
  const { nodes, materials } = useGLTF('/models/service/low_poly_city.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[2500, 0, -3500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes['(base)_casa_1_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Casa_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Tenda_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Supporto_tenda_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Porta_e_finestre_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube005_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Tetto_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Fondamenta_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Tubi_Cassetta_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Vetri_Vetro_0.geometry} material={materials.Vetro} />
          <mesh geometry={nodes.rocce_Colore_0.geometry} material={materials.Colore} />
        </group>
        <group position={[2500, 0, -4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes['(base)001_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Plane003_Colore_0.geometry} material={materials.Colore} position={[-2.793, 0, 2.326]} />
          <mesh geometry={nodes.Plane009_Colore_0.geometry} material={materials.Colore} position={[-1.78, -1.476, 2.326]} />
          <mesh geometry={nodes.Cube003_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube004_Colore_0.geometry} material={materials.Colore} position={[-1.789, 0.583, 2.974]} />
          <mesh geometry={nodes.Circle001_Colore_0.geometry} material={materials.Colore} position={[-2.221, 0.687, 2.874]} />
          <mesh geometry={nodes.Door_and_windows_2_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.verti_2_Vetro_0.geometry} material={materials.Vetro} />
          <mesh geometry={nodes.Plane_Colore_0.geometry} material={materials.Colore} position={[-0.966, -1.789, 0]} />
          <mesh geometry={nodes.Cube007_Colore_0.geometry} material={materials.Colore} position={[-0.966, -1.789, 0.35]} />
          <mesh geometry={nodes.Plane010_Colore_0.geometry} material={materials.Colore} position={[1.002, -1.789, 0]} />
          <mesh geometry={nodes.Cube008_Colore_0.geometry} material={materials.Colore} position={[1.002, -1.789, 0.35]} />
          <mesh geometry={nodes.Tree_A001_Colore_0.geometry} material={materials.Colore} position={[3.781, 3.31, 0]} rotation={[0, 0, -0.514]} />
          <mesh geometry={nodes.Tree_A002_Colore_0.geometry} material={materials.Colore} position={[-3.641, 3.239, 0]} rotation={[0, 0, 0.529]} />
        </group>
        <group position={[-1500, 0, -4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes['(base)Casa_3_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Casa_3_Colore_0.geometry} material={materials.Colore} position={[0, 2.186, 0]} />
          <mesh geometry={nodes.Vasi_grandi001_Colore_0.geometry} material={materials.Colore} position={[1.472, 1.319, 0]} />
          <mesh geometry={nodes.Bordo_tetto_Colore_0.geometry} material={materials.Colore} position={[0, 2.186, 0]} />
          <mesh geometry={nodes.Fondamenta_3_Colore_0.geometry} material={materials.Colore} position={[0, 2.186, 0]} />
          <mesh geometry={nodes.Porta_e_finestre_3_Colore_0.geometry} material={materials.Colore} position={[0, 2.186, 0]} />
          <mesh geometry={nodes.Cube002_Colore_0.geometry} material={materials.Colore} position={[-1.789, 2.77, 2.974]} />
          <mesh geometry={nodes.Circle_Colore_0.geometry} material={materials.Colore} position={[-2.221, 2.873, 2.874]} />
          <mesh geometry={nodes.Vetri_3_Vetro_0.geometry} material={materials.Vetro} position={[0, 2.186, 0]} />
          <mesh geometry={nodes.Vasi_grandi002_Colore_0.geometry} material={materials.Colore} position={[1.472, 1.319, 0]} />
          <mesh geometry={nodes.Vasi_grandi003_Colore_0.geometry} material={materials.Colore} position={[2.6, 1.319, 0]} />
          <mesh geometry={nodes.Plane002_Colore_0.geometry} material={materials.Colore} position={[-3.144, 2.117, 2.326]} />
          <mesh geometry={nodes.Plane005_Colore_0.geometry} material={materials.Colore} position={[-1.846, 0.559, 2.326]} />
          <mesh geometry={nodes.Plane006_Colore_0.geometry} material={materials.Colore} position={[2.076, 1.561, 2.326]} />
          <mesh geometry={nodes.Plane007_Colore_0.geometry} material={materials.Colore} position={[3.144, 2.618, 2.326]} />
          <mesh geometry={nodes.rocce002_Colore_0.geometry} material={materials.Colore} position={[2.056, 0.054, 0.014]} rotation={[0, 0, 2.607]} />
          <mesh geometry={nodes.Cylinder_Colore_0.geometry} material={materials.Colore} position={[1.23, -1.254, 0]} rotation={[0, 0, -0.264]} />
          <mesh geometry={nodes.Cylinder031_Colore_0.geometry} material={materials.Colore} position={[-2.94, -2.702, 1.845]} rotation={[0, 0, -0.264]} />
          <mesh geometry={nodes.Cylinder032_Colore_0.geometry} material={materials.Colore} position={[-2.94, -2.702, 1.845]} rotation={[0, 0, -0.264]} />
          <mesh geometry={nodes.Cube108_Colore_0.geometry} material={materials.Colore} position={[-2.94, -2.702, 1.845]} rotation={[0, 0, -0.264]} />
        </group>
        <group position={[-1766.301, 136.991, -756.912]} rotation={[-Math.PI / 2, 0, -1.599]} scale={100}>
          <mesh geometry={nodes.Cube039_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Plane001_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.104]} />
          <mesh geometry={nodes.Plane004_Colore_0.geometry} material={materials.Colore} position={[0, -2.895, -1.036]} />
          <mesh geometry={nodes.Cube040_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.342]} />
          <mesh geometry={nodes.Cube041_Colore_0.geometry} material={materials.Colore} position={[0, -1.378, -1.944]} />
          <mesh geometry={nodes.Cube042_Colore_0.geometry} material={materials.Colore} position={[-0.001, -3.573, -0.527]} />
          <mesh geometry={nodes.Cube043_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.342]} />
          <mesh geometry={nodes.Cube045_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.342]} />
          <mesh geometry={nodes.Cube046_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube047_Colore_0.geometry} material={materials.Colore} position={[-1.463, 0.38, 1.491]} />
          <mesh geometry={nodes.Cube048_Colore_0.geometry} material={materials.Colore} position={[-1.463, 0.38, 1.491]} />
          <mesh geometry={nodes.Plane019_Vetro_0.geometry} material={materials.Vetro} position={[0, -2.895, -1.036]} />
          <mesh geometry={nodes.Plane008_Colore_0.geometry} material={materials.Colore} position={[0, -2.426, -0.167]} />
          <mesh geometry={nodes.Cube044_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.342]} />
          <mesh geometry={nodes.Cylinder010_Colore_0.geometry} material={materials.Colore} position={[0.55, 0.203, 0.258]} />
          <mesh geometry={nodes.Cylinder011_Colore_0.geometry} material={materials.Colore} position={[0.651, -0.148, 0.845]} />
          <mesh geometry={nodes.Cylinder012_Colore_0.geometry} material={materials.Colore} position={[0.714, -0.237, 0.845]} />
          <mesh geometry={nodes.Cylinder013_Colore_0.geometry} material={materials.Colore} position={[0.659, -0.456, 0.845]} />
          <mesh geometry={nodes.Cylinder014_Colore_0.geometry} material={materials.Colore} position={[0.678, -0.594, 0.845]} />
          <mesh geometry={nodes.Cylinder015_Colore_0.geometry} material={materials.Colore} position={[0.692, -0.117, 1.12]} />
          <mesh geometry={nodes.Cylinder016_Colore_0.geometry} material={materials.Colore} position={[0.723, -0.288, 1.12]} />
          <mesh geometry={nodes.Cylinder017_Colore_0.geometry} material={materials.Colore} position={[0.688, -0.544, 1.12]} />
          <mesh geometry={nodes.Cylinder025_Colore_0.geometry} material={materials.Colore} position={[0.551, -0.267, 0.277]} />
          <mesh geometry={nodes.Cylinder026_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.392]} />
          <mesh geometry={nodes.Cylinder027_Colore_0.geometry} material={materials.Colore} position={[0, 0.799, 2.518]} />
          <mesh geometry={nodes.Plane017_Colore_0.geometry} material={materials.Colore} position={[-0.001, -3.627, -1.094]} />
          <mesh geometry={nodes.Plane018_Colore_0.geometry} material={materials.Colore} position={[-0.001, 2.857, -1.094]} />
          <mesh geometry={nodes.Cube049_Colore_0.geometry} material={materials.Colore} position={[0, 0, -1.458]} />
          <mesh geometry={nodes.Cube050_Colore_0.geometry} material={materials.Colore} position={[0, -2.829, -0.083]} />
          <mesh geometry={nodes.Cylinder018_Colore_0.geometry} material={materials.Colore} position={[0, -2.617, 0.041]} />
          <mesh geometry={nodes.Cube051_Colore_0.geometry} material={materials.Colore} position={[0, -0.037, -1.5]} />
        </group>
        <group position={[-4500, 0, 4500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Curva001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Curva001_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -5500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Curva002_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Curva002_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -5500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Curva003_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Curva003_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[500, 0, -500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_stop001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop001_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop001_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-500, 0, -1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_stop002_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop002_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop002_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-1500, 0, -500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_stop003_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop003_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop003_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[500, 0, -5500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_marciapiede004_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_marciapiede004_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_marciapiede004_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-3500, 0, -5500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_bus_stop_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_bus_stop_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Immissione001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione001_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Immissione003_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione003_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -4500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base011_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base011_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -2500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base012_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base012_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base015_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base015_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, 500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Strada_base016_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base016_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, 1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base017_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base017_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, 3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base021_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base021_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Strada_base032_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base032_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[2500, 0, -5500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base033_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base033_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-3500, 0, -500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_stop004_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop004_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop004_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[2500, 0, -500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_stop005_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop005_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop005_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base029_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base029_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[1500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base041_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base041_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-1499.999, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base043_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base043_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-3500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base045_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base045_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[2500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base049_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base049_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, 3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base051_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base051_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, 2500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base052_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base052_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, 500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base053_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base053_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -2500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base055_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base055_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base056_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base056_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base057_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base057_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, -4500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base059_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base059_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, -500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Incrocio001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Incrocio001_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, 500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Strada_stop009_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop009_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop009_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[3500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Curva006_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Curva006_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Immissione012_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione012_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, 3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_stop010_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_stop010_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_stop010_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-500, 0, -5500]} rotation={[-Math.PI / 2, 0, -1.571]} scale={100}>
          <mesh geometry={nodes.Immissione014_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione014_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-4500, 0, -3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base003_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base003_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, -4500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base001_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, -2500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base007_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base007_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-1500, 0, -5500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base009_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base009_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[3500, 0, 1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Immissione002_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione002_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-2500, 0, -500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base013_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base013_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, -3500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Strada_marciapiede001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_marciapiede001_texture_mat_0.geometry} material={materials.texture_mat} />
          <mesh geometry={nodes.Strada_marciapiede001_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-4500, 0, 2500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Immissione004_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione004_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, 2500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Immissione005_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione005_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-500, 0, 1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Strada_base002_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base002_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-2500, 0, 2500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base005_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base005_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-3500, 0, 2500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base010_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base010_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-1500, 0, 2500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Strada_base014_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Strada_base014_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-2500.001, 0, 4500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Immissione006_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione006_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-2185.298, 0, -5929.02]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Cylinder022_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cylinder022_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[3927.951, 0, 2809.899]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Cylinder023_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cylinder023_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[-4081.328, 0, 3033.771]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Cylinder024_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cylinder024_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
        </group>
        <group position={[1500, 0, -500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Immissione007_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione007_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-2500, 0, -5500]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Immissione008_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Immissione008_texture_mat_0.geometry} material={materials.texture_mat} />
        </group>
        <group position={[-1500, 0, -1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes.Cylinder005_Colore_0.geometry} material={materials.Colore} position={[10, -5, 0.897]} />
          <mesh geometry={nodes.Tree_Colore_0.geometry} material={materials.Colore} position={[-2.313, 2.488, 0]} />
          <mesh geometry={nodes.Trre_2_Colore_0.geometry} material={materials.Colore} position={[3.951, 1.863, 0]} />
          <mesh geometry={nodes.Trre_2001_Colore_0.geometry} material={materials.Colore} position={[18.811, -11.07, 0]} rotation={[0, 0, -2.031]} />
          <mesh geometry={nodes.Tree001_Colore_0.geometry} material={materials.Colore} position={[4.761, -12.301, 0]} rotation={[0, 0, 2.693]} />
          <mesh geometry={nodes.Trre_2002_Colore_0.geometry} material={materials.Colore} position={[17.036, 3.531, 0]} rotation={[0, 0, 0.157]} />
          <mesh geometry={nodes.Tree002_Colore_0.geometry} material={materials.Colore} position={[23.777, 1.044, 0]} rotation={[0, 0, -0.501]} />
          <mesh geometry={nodes.Tree003_Colore_0.geometry} material={materials.Colore} position={[13.428, 3.83, 0]} rotation={[0, 0, 0.989]} />
          <mesh geometry={nodes.Trre_2003_Colore_0.geometry} material={materials.Colore} position={[14.08, -10.09, 0]} rotation={[0, 0, 1.31]} />
          <mesh geometry={nodes.Tree004_Colore_0.geometry} material={materials.Colore} position={[0.82, -10.824, 0]} rotation={[0, 0, 0.74]} />
          <mesh geometry={nodes.Icosphere_Colore_0.geometry} material={materials.Colore} position={[0.105, 1.173, 0]} rotation={[0, 0, 0.415]} />
          <mesh geometry={nodes.Trre_2004_Colore_0.geometry} material={materials.Colore} position={[10.319, -12.647, 0]} rotation={[0, 0, -3.01]} />
          <mesh geometry={nodes.Trre_2005_Colore_0.geometry} material={materials.Colore} position={[9.417, 1.609, 0]} rotation={[0, 0, 0.071]} />
          <mesh geometry={nodes.Tree005_Colore_0.geometry} material={materials.Colore} position={[23.416, -11.053, 0]} rotation={[0, 0, -1.826]} />
          <mesh geometry={nodes.Icosphere001_Colore_0.geometry} material={materials.Colore} position={[21.426, -13.602, 0]} rotation={[0, 0, 0.259]} />
          <mesh geometry={nodes.Icosphere002_Colore_0.geometry} material={materials.Colore} position={[-1.978, -12.81, 0]} rotation={[0, 0, -0.792]} />
          <mesh geometry={nodes.Icosphere003_Colore_0.geometry} material={materials.Colore} position={[19.728, 1.846, 0]} rotation={[0, 0, -2.761]} />
          <mesh geometry={nodes.rocce001_Colore_0.geometry} material={materials.Colore} position={[-2.624, -6.354, 0]} rotation={[0, 0, Math.PI / 2]} />
          <mesh geometry={nodes.Tree006_Colore_0.geometry} material={materials.Colore} position={[15.417, -12.464, 0]} rotation={[0, 0, -0.535]} />
          <mesh geometry={nodes.Vasi_grandi005_Colore_0.geometry} material={materials.Colore} position={[7.15, -11.167, 0]} />
          <mesh geometry={nodes.Vasi_grandi006_Colore_0.geometry} material={materials.Colore} position={[5.575, 0.746, 0]} rotation={[0, 0, -1.948]} />
          <mesh geometry={nodes.Vasi_grandi007_Colore_0.geometry} material={materials.Colore} position={[13.704, -1.305, 0]} rotation={[0, 0, 0.066]} />
          <mesh geometry={nodes.Cube068_Colore_0.geometry} material={materials.Colore} position={[0, -5, 0]} />
          <mesh geometry={nodes.Cube069_Colore_0.geometry} material={materials.Colore} position={[1.988, -0.803, 0]} rotation={[0, 0, 0.222]} />
          <mesh geometry={nodes.Cube070_Colore_0.geometry} material={materials.Colore} position={[4.957, -9.739, 0]} rotation={[0, 0, 3.134]} />
          <mesh geometry={nodes.Cube071_Colore_0.geometry} material={materials.Colore} position={[17.808, -9.134, 0]} rotation={[0, 0, 2.937]} />
          <mesh geometry={nodes.Cube121_Colore_0.geometry} material={materials.Colore} position={[17.255, -1.206, 0]} rotation={[0, 0, -0.34]} />
          <mesh geometry={nodes.Cube123_Colore_0.geometry} material={materials.Colore} position={[15.388, -24.678, 0]} rotation={[0, 0, -0.008]} />
        </group>
        <group position={[-1500, 0, -3500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes['(Base)_Cinema_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube010_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube001_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube001_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cube015_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cube017_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube011_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube012_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube013_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cube014_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cylinder007_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} position={[0, 0, -0.032]} />
          <mesh geometry={nodes.Cylinder008_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cube016_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube019_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube020_Vetro_0.geometry} material={materials.Vetro} />
          <mesh geometry={nodes.Cube018_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Plane012_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube021_Colore_0.geometry} material={materials.Colore} position={[3.171, 2.803, 7.898]} />
          <mesh geometry={nodes.Plane013_Colore_0.geometry} material={materials.Colore} position={[3.171, 2.803, 7.898]} rotation={[0, 0, Math.PI / 2]} />
          <mesh geometry={nodes.Circle002_Colore_0.geometry} material={materials.Colore} position={[1.845, 2.792, 8.202]} />
          <mesh geometry={nodes.Cube022_Colore_0.geometry} material={materials.Colore} position={[-3.248, 2.677, 8.379]} />
          <mesh geometry={nodes.Circle003_Colore_0.geometry} material={materials.Colore} position={[-3.604, 1.971, 7.9]} />
          <mesh geometry={nodes.Vasi_grandi004_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Vasi_piccoli001_Colore_0.geometry} material={materials.Colore} position={[0, -2.664, 0.088]} />
          <mesh geometry={nodes.Plane011_Colore_0.geometry} material={materials.Colore} />
        </group>
        <group position={[1500, 0, 2500]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <group position={[-12.256, -7.893, 12.123]}>
            <mesh geometry={nodes.Cube037_Colore_0.geometry} material={materials.Colore} />
            <mesh geometry={nodes.Cube037_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          </group>
          <group position={[0, 0, 0.2]}>
            <mesh geometry={nodes.vetri_Vetro_alternate_less_transparent_0.geometry} material={materials.Vetro_alternate_less_transparent} />
            <mesh geometry={nodes.vetri_Vetro_0.geometry} material={materials.Vetro} />
          </group>
          <mesh geometry={nodes['(base)_hospital_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube025_Colore_0.geometry} material={materials.Colore} position={[0, 0, 2.123]} />
          <mesh geometry={nodes.Cube035_Colore_0.geometry} material={materials.Colore} position={[0, 0, 0.2]} />
          <mesh geometry={nodes.Cube036_Colore_0.geometry} material={materials.Colore} position={[0, 0, 17.882]} />
          <mesh geometry={nodes.Plane014_Colore_0.geometry} material={materials.Colore} position={[-0.138, 0, 7.4]} />
          <mesh geometry={nodes.Plane015_Colore_0.geometry} material={materials.Colore} position={[4, -5, 3.696]} />
          <mesh geometry={nodes.Plane016_Colore_0.geometry} material={materials.Colore} position={[4, -5, 3.696]} />
          <mesh geometry={nodes.Cylinder009_Colore_0.geometry} material={materials.Colore} position={[11.576, -5, 4.376]} />
          <mesh geometry={nodes.Plane020_Colore_0.geometry} material={materials.Colore} position={[-10.71, 5.329, 14.677]} />
          <mesh geometry={nodes.Cube056_Colore_0.geometry} material={materials.Colore} position={[-10.049, 3.231, 14.677]} />
          <mesh geometry={nodes.Cube057_Colore_0.geometry} material={materials.Colore} position={[-10.049, 3.231, 14.677]} rotation={[0, 0, 1.257]} />
          <mesh geometry={nodes.Text_Colore_0.geometry} material={materials.Colore} position={[4, -4.836, 7.62]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
          <mesh geometry={nodes.Plane023_Colore_0.geometry} material={materials.Colore} position={[-0.138, 14.39, 11.476]} />
          <mesh geometry={nodes.Cube060_Colore_0.geometry} material={materials.Colore} position={[4.448, -8.082, 0.2]} />
          <mesh geometry={nodes.Cube061_Colore_0.geometry} material={materials.Colore} position={[-5.921, -14.116, 1.662]} />
          <mesh geometry={nodes.Text001_Colore_0.geometry} material={materials.Colore} position={[-5.921, -14.239, 2.021]} />
          <mesh geometry={nodes.Cube062_Colore_0.geometry} material={materials.Colore} position={[-5.921, -14.116, 1.662]} />
          <mesh geometry={nodes.Cube055_Colore_0.geometry} material={materials.Colore} position={[0, 0, 0.2]} />
          <mesh geometry={nodes.frames_Colore_0.geometry} material={materials.Colore} position={[0, 0, 0.2]} />
          <mesh geometry={nodes.Cube058_Colore_0.geometry} material={materials.Colore} position={[0, 0, 0.2]} />
          <mesh geometry={nodes.Cube059_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.frames_back_Colore_0.geometry} material={materials.Colore} position={[0, 0, 0.2]} />
          <mesh geometry={nodes.Cylinder019_Colore_0.geometry} material={materials.Colore} position={[7.618, 5, 11.123]} />
          <mesh geometry={nodes.Plane028_Colore_0.geometry} material={materials.Colore} position={[10, -20, 0]} />
        </group>
        <group position={[-3500, 0, 3500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes['(base)_police_station_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube038_Colore_0.geometry} material={materials.Colore} position={[0, 0, 1.081]} />
          <mesh geometry={nodes.Cube072_Colore_0.geometry} material={materials.Colore} position={[9.391, 0, 0]} />
          <mesh geometry={nodes.Cube073_Colore_0.geometry} material={materials.Colore} position={[0, 0, 1.081]} />
          <mesh geometry={nodes.Cube074_Colore_0.geometry} material={materials.Colore} position={[0, 0, 1.081]} />
          <mesh geometry={nodes.Cube075_Vetro_alternate_less_transparent_0.geometry} material={materials.Vetro_alternate_less_transparent} position={[0, 0, 1.081]} />
          <mesh geometry={nodes.Cylinder020_Colore_0.geometry} material={materials.Colore} position={[-1.539, 1.752, 7.445]} rotation={[0, 0, -Math.PI]} />
          <mesh geometry={nodes.Cube076_Vetro_0.geometry} material={materials.Vetro} position={[0, 0, 1.081]} />
          <mesh geometry={nodes.Plane024_Colore_0.geometry} material={materials.Colore} position={[7.793, -1.281, 2.079]} />
          <mesh geometry={nodes.Plane025_Colore_0.geometry} material={materials.Colore} position={[1.048, -2.476, 7.312]} />
          <mesh geometry={nodes.Plane026_Colore_0.geometry} material={materials.Colore} position={[9.672, -1.314, 4.158]} />
          <mesh geometry={nodes.Cube077_Colore_0.geometry} material={materials.Colore} position={[4.555, 2.514, 6.973]} />
          <mesh geometry={nodes.Icosphere004_Colore_0.geometry} material={materials.Colore} position={[14.389, -0.06, 0]} />
          <mesh geometry={nodes.Plane027_Colore_0.geometry} material={materials.Colore} position={[10, -10, 0]} />
        </group>
        <group position={[1000, 0, -4000]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes['(base)_Big_house_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube079_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube080_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube081_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube082_Colore_0.geometry} material={materials.Colore} position={[0, 0.08, 0]} />
          <mesh geometry={nodes.Cube083_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube084_Vetro_alternate_less_transparent_0.geometry} material={materials.Vetro_alternate_less_transparent} />
          <mesh geometry={nodes.Cube085_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Trre_B001_Colore_0.geometry} material={materials.Colore} position={[-8.16, 5.679, 0]} rotation={[0, 0, 0.696]} />
          <mesh geometry={nodes.Trre_B002_Colore_0.geometry} material={materials.Colore} position={[7.83, 5.76, 0]} rotation={[0, 0, 3.007]} />
        </group>
        <group position={[1000, 0, -2000]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes['(base)003_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube086_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube087_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube088_Segnali_e_scritte_0.geometry} material={materials.Segnali_e_scritte} />
          <mesh geometry={nodes.Cube089_Colore_0.geometry} material={materials.Colore} position={[1, 0.748, 5.812]} />
          <mesh geometry={nodes.Plane029_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube090_Vetro_0.geometry} material={materials.Vetro} />
          <mesh geometry={nodes.Plane030_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Plane030_Vetro_0.geometry} material={materials.Vetro} />
          <mesh geometry={nodes.Plane031_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube091_Colore_0.geometry} material={materials.Colore} position={[-0.035, 0, 0]} />
          <mesh geometry={nodes.Circle005_Colore_0.geometry} material={materials.Colore} position={[-14.276, -4.742, 5.927]} />
          <mesh geometry={nodes.Cube093_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube094_Vetro_0.geometry} material={materials.Vetro} position={[-0.035, 0, 0]} />
          <mesh geometry={nodes.Vasi_piccoli002_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Tubi_Cassetta001_Colore_0.geometry} material={materials.Colore} position={[-0.299, 0, 0]} />
          <mesh geometry={nodes.Cube092_Colore_0.geometry} material={materials.Colore} position={[-15.062, -3.22, 5.079]} rotation={[0, 0, -Math.PI / 2]} />
          <mesh geometry={nodes.Circle004_Colore_0.geometry} material={materials.Colore} position={[-15.062, -3.301, 5.079]} rotation={[0, 0, -Math.PI / 2]} />
        </group>
        <group position={[-3000, 0, 1000]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes['(base)004_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube078_Colore_0.geometry} material={materials.Colore} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube095_Colore_0.geometry} material={materials.Colore} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube096_Colore_0.geometry} material={materials.Colore} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube097_Vetro_0.geometry} material={materials.Vetro} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube098_Colore_0.geometry} material={materials.Colore} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube099_Vetro_alternate_less_transparent_0.geometry} material={materials.Vetro_alternate_less_transparent} position={[5, -0.951, 0]} />
          <mesh geometry={nodes['(base)005_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube101_Colore_0.geometry} material={materials.Colore} position={[5, -0.951, 0]} />
          <mesh geometry={nodes.Cube100_Colore_0.geometry} material={materials.Colore} position={[5, 1.773, 0.367]} />
          <mesh geometry={nodes.Cube102_Colore_0.geometry} material={materials.Colore} position={[2.39, 3.786, 0.553]} />
          <mesh geometry={nodes.Cube103_Colore_0.geometry} material={materials.Colore} position={[5, 2.706, 4.764]} />
          <mesh geometry={nodes.Tree_C001_Colore_0.geometry} material={materials.Colore} position={[-8.681, 7.939, 0]} />
          <mesh geometry={nodes.Tree_C002_Colore_0.geometry} material={materials.Colore} position={[-8.592, 5.2, 0]} rotation={[0, 0, -0.72]} />
          <mesh geometry={nodes.Tree_C003_Colore_0.geometry} material={materials.Colore} position={[-8.612, -0.329, 0]} rotation={[0, 0, 0.654]} />
          <mesh geometry={nodes.Tree_C004_Colore_0.geometry} material={materials.Colore} position={[-8.652, -7.74, 0]} rotation={[0, 0, 0.654]} />
          <mesh geometry={nodes.Tree_C005_Colore_0.geometry} material={materials.Colore} position={[-8.643, -3.256, 0]} rotation={[0, 0, 1.21]} />
          <mesh geometry={nodes.Tree_C006_Colore_0.geometry} material={materials.Colore} position={[-8.668, -5.424, 0]} rotation={[0, 0, 2.538]} />
          <mesh geometry={nodes.Tree_C007_Colore_0.geometry} material={materials.Colore} position={[-8.651, 2.481, 0]} rotation={[0, 0, 1.624]} />
          <mesh geometry={nodes.Tree_C008_Colore_0.geometry} material={materials.Colore} position={[18.56, 7.939, 0]} rotation={[0, 0, 1.915]} />
          <mesh geometry={nodes.Tree_C009_Colore_0.geometry} material={materials.Colore} position={[18.649, 5.2, 0]} rotation={[0, 0, 1.194]} />
          <mesh geometry={nodes.Tree_C010_Colore_0.geometry} material={materials.Colore} position={[18.586, -2.515, 0]} rotation={[0, 0, 2.569]} />
          <mesh geometry={nodes.Tree_C011_Colore_0.geometry} material={materials.Colore} position={[18.589, 2.871, 0]} rotation={[0, 0, 2.569]} />
          <mesh geometry={nodes.Tree_C012_Colore_0.geometry} material={materials.Colore} position={[18.67, 0.088, 0]} rotation={[0, 0, 3.125]} />
          <mesh geometry={nodes.Tree_C013_Colore_0.geometry} material={materials.Colore} position={[18.646, -5.047, 0]} rotation={[0, 0, -1.831]} />
          <mesh geometry={nodes.Tree_C014_Colore_0.geometry} material={materials.Colore} position={[18.604, -8.261, 0]} rotation={[0, 0, -2.744]} />
          <mesh geometry={nodes.Text002_Colore_0.geometry} material={materials.Colore} position={[4.687, 3.816, 5.249]} rotation={[-Math.PI / 2, 0, Math.PI]} />
        </group>
        <group position={[-3000, 0, -4000]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes['(base)_Big_house_2_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube064_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube065_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube104_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube105_Colore_0.geometry} material={materials.Colore} position={[-24.595, -9.985, 0]} rotation={[0, 0, -Math.PI]} />
          <mesh geometry={nodes.Trre_2006_Colore_0.geometry} material={materials.Colore} position={[-2.513, 4.204, 0]} rotation={[0, 0, -2.985]} />
          <mesh geometry={nodes.Trre_2007_Colore_0.geometry} material={materials.Colore} position={[-6.395, 4.036, 0]} rotation={[0, 0, 1.9]} />
          <mesh geometry={nodes.Trre_2008_Colore_0.geometry} material={materials.Colore} position={[-4.89, 6.986, 0]} rotation={[0, 0, -2.985]} />
          <mesh geometry={nodes.Circle006_Colore_0.geometry} material={materials.Colore} position={[6.01, -6.759, 19.175]} />
          <mesh geometry={nodes.Cube106_Colore_0.geometry} material={materials.Colore} position={[1.741, -4.138, 14.821]} rotation={[0, 0, -2.919]} />
          <mesh geometry={nodes.Cube107_Colore_0.geometry} material={materials.Colore} position={[-0.678, -3.738, 14.821]} rotation={[0, 0, 2.758]} />
          <mesh geometry={nodes.Cube066_Colore_0.geometry} material={materials.Colore} />
        </group>
        <group position={[500, 0, 500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes['(base)_corner_shop_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube110_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube111_Colore_0.geometry} material={materials.Colore} rotation={[0, 0, Math.PI / 4]} />
          <mesh geometry={nodes.Cube112_Colore_0.geometry} material={materials.Colore} position={[-2.262, 2.262, 4.718]} rotation={[0, 0, Math.PI / 4]} />
          <mesh geometry={nodes.Cube109_Colore_0.geometry} material={materials.Colore} position={[-2.262, 2.262, 4.718]} rotation={[0, 0, Math.PI / 4]} />
          <mesh geometry={nodes.Plane032_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube113_Colore_0.geometry} material={materials.Colore} position={[-2.259, 2.259, 0]} rotation={[0, 0, Math.PI / 4]} />
          <mesh geometry={nodes.Cube114_Colore_0.geometry} material={materials.Colore} position={[-2.259, 2.259, 0]} rotation={[0, 0, Math.PI / 4]} />
        </group>
        <group position={[-1500, 0, 3500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
          <mesh geometry={nodes['(base)_bank_Colore_0'].geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube115_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube116_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cylinder033_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube117_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Text003_Colore_0.geometry} material={materials.Colore} position={[0, 0.737, 7.315]} rotation={[-Math.PI / 2, 0, Math.PI]} />
          <mesh geometry={nodes.Cube118_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube119_Colore_0.geometry} material={materials.Colore} />
          <mesh geometry={nodes.Cube120_Colore_0.geometry} material={materials.Colore} position={[-2.559, -4.241, 3.566]} />
          <mesh geometry={nodes['(base)_bank001_Colore_0'].geometry} material={materials.Colore} />
        </group>
        <group position={[1500, 0, 500]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes['(base)_parking_spot_texture_mat_0'].geometry} material={materials.texture_mat} />
          <mesh geometry={nodes['(base)_parking_spot_Colore_0'].geometry} material={materials.Colore} />
        </group>
        <mesh geometry={nodes.Cube063_Colore_0.geometry} material={materials.Colore} position={[-3107.102, 149.827, -269.337]} rotation={[-Math.PI / 2, 0, 1.535]} scale={100} />
        <mesh geometry={nodes.Police_car_Colore_0.geometry} material={materials.Colore} position={[-1644.243, -11.122, 4258.002]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100} />
        <mesh geometry={nodes.Car_Colore_0.geometry} material={materials.Colore} position={[-4317.487, -12.977, 1537.589]} rotation={[-Math.PI / 2, 0, -3.135]} scale={100} />
        <mesh geometry={nodes.Pickup_Colore_0.geometry} material={materials.Colore} position={[-704.757, -10.827, 1700.414]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Car_2_Colore_0.geometry} material={materials.Colore} position={[-709.514, -12.977, -2144.966]} rotation={[-Math.PI / 2, 0, -0.015]} scale={100} />
        <mesh geometry={nodes.Police_car001_Colore_0.geometry} material={materials.Colore} position={[-253.588, -11.122, -4422.297]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={100} />
        <mesh geometry={nodes.Pickup001_Colore_0.geometry} material={materials.Colore} position={[3707.086, -10.827, -4185.926]} rotation={[-Math.PI / 2, 0, -3.106]} scale={100} />
        <mesh geometry={nodes.Pickup002_Colore_0.geometry} material={materials.Colore} position={[-4710.874, -10.827, -4033.023]} rotation={[-Math.PI / 2, 0, -0.03]} scale={100} />
        <mesh geometry={nodes.Car_2001_Colore_0.geometry} material={materials.Colore} position={[2350.81, -12.977, 4739.008]} rotation={[-Math.PI / 2, 0, 1.607]} scale={100} />
        <mesh geometry={nodes.Car_2002_Colore_0.geometry} material={materials.Colore} position={[3196.552, -12.977, -203.73]} rotation={[-Math.PI / 2, 0, 0.689]} scale={100} />
        <mesh geometry={nodes.Car001_Colore_0.geometry} material={materials.Colore} position={[-116.432, -12.977, -686.521]} rotation={[-Math.PI / 2, 0, -1.244]} scale={100} />
        <mesh geometry={nodes.Pickup003_Colore_0.geometry} material={materials.Colore} position={[2535.811, -10.827, 781.494]} rotation={[-Math.PI / 2, 0, -0.03]} scale={100} />
        <mesh geometry={nodes.Car002_Colore_0.geometry} material={materials.Colore} position={[1569.039, -12.977, 770.314]} rotation={[-Math.PI / 2, 0, 3.051]} scale={100} />
        <mesh geometry={nodes.Cylinder028_Colore_0.geometry} material={materials.Colore} position={[3080.854, 0, -1163.965]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100} />
        <mesh geometry={nodes.Cylinder029_Colore_0.geometry} material={materials.Colore} position={[-4922.818, 0, -1129.974]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100} />
        <mesh geometry={nodes.Cylinder030_Colore_0.geometry} material={materials.Colore} position={[-1079.061, 0, 4925.982]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100} />
        <mesh geometry={nodes['(base)_parco001_Colore_0'].geometry} material={materials.Colore} position={[-1500, 0, -1500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100} />
        <mesh geometry={nodes.Text004_Colore_0.geometry} material={materials.Colore} position={[-3388.193, 714.348, 3751.196]} scale={100} />
        <mesh geometry={nodes.Plane033_Colore_0.geometry} material={materials.Colore} position={[-2500, 0, -5500]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100} />
        <mesh geometry={nodes.Nuvola_Colore_0.geometry} material={materials.Colore} position={[2303.562, 3942.154, -3670.686]} rotation={[-1.532, -0.174, -0.605]} scale={100} />
        <mesh geometry={nodes.Nuvola_2_Colore_0.geometry} material={materials.Colore} position={[-2952.546, 3590.257, 3062.454]} rotation={[-1.602, 0, -0.344]} scale={100} />
        <mesh geometry={nodes.Nuvola_2001_Colore_0.geometry} material={materials.Colore} position={[-3705.163, 3590.257, 1534.311]} rotation={[-1.602, 0, 3]} scale={100} />
        <mesh geometry={nodes.Nuvola001_Colore_0.geometry} material={materials.Colore} position={[-1285.129, 3863.106, 3159.758]} rotation={[-1.602, 0, 2.45]} scale={100} />
        <mesh geometry={nodes.Nuvola_2002_Colore_0.geometry} material={materials.Colore} position={[745.131, 3590.257, -5280.047]} rotation={[-1.602, -0.001, 3.018]} scale={100} />
        <mesh geometry={nodes.Nuvola_2003_Colore_0.geometry} material={materials.Colore} position={[-4104.311, 3067.298, -2963.511]} rotation={[-1.602, 0, 3]} scale={100} />
        <mesh geometry={nodes.Nuvola002_Colore_0.geometry} material={materials.Colore} position={[2264.648, 3863.106, 1612.466]} rotation={[-1.752, -0.093, -0.644]} scale={100} />
        <mesh geometry={nodes.Plane034_Colore_0.geometry} material={materials.Colore} position={[296.417, 319.725, 246.312]} rotation={[-1.727, 0.125, 0.818]} scale={100} />
        <mesh geometry={nodes.Cube122_Colore_0.geometry} material={materials.Colore} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Icosphere014_Colore_0.geometry} material={materials.Colore} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes['(base)_parking_spot001_Colore_0'].geometry} material={materials.Colore} position={[1500, 0, 500]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Cone_Colore_0.geometry} material={materials.Colore} position={[-3020.686, 352.634, -3904.265]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/service/low_poly_city.glb')
