import { useRef } from 'react'
import * as THREE from 'three'
import { Physics } from '@react-three/rapier'
import { useBoatControls } from '../hooks/useBoatControls'
import Ocean from './Ocean'
import Boat from './Boat'
import Island from './Island'
import CameraRig from './CameraRig'
import Lights from './Lights'

const ISLANDS = [
  {
    name: 'Proyectos',
    description: 'Acércate para explorar mi trabajo',
    position: [40, 0, 0] as [number, number, number],
  },
  {
    name: 'Sobre Mí',
    description: 'Acércate para conocer mi historia',
    position: [-35, 0, 45] as [number, number, number],
  },
  {
    name: 'Contacto',
    description: 'Acércate para ponerte en contacto',
    position: [15, 0, -50] as [number, number, number],
  },
]

export default function Scene() {
  // Shared mutable position ref — passed to Boat (writer) and Island/Camera (readers)
  const boatPositionRef = useRef(new THREE.Vector3(0, 1, 0))
  const keysRef = useBoatControls()

  return (
    <>
      <Physics gravity={[0, -9.81, 0]}>
        <Ocean />
        <Boat boatPositionRef={boatPositionRef} keysRef={keysRef} />
        {ISLANDS.map((island) => (
          <Island
            key={island.name}
            name={island.name}
            description={island.description}
            position={island.position}
            boatPositionRef={boatPositionRef}
          />
        ))}
      </Physics>

      {/* Camera and lights live outside Physics — they don't need it */}
      <CameraRig boatPositionRef={boatPositionRef} />
      <Lights />
    </>
  )
}
