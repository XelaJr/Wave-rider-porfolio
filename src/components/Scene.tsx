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
    id: 'projects',
    name: 'Proyectos',
    position: [40, 0, 0] as [number, number, number],
  },
  {
    id: 'about',
    name: 'Sobre Mí',
    position: [-35, 0, 45] as [number, number, number],
  },
  {
    id: 'contact',
    name: 'Contacto',
    position: [15, 0, -50] as [number, number, number],
  },
]

interface SceneProps {
  onIslandClick: (id: string) => void
}

export default function Scene({ onIslandClick }: SceneProps) {
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
            key={island.id}
            id={island.id}
            name={island.name}
            position={island.position}
            boatPositionRef={boatPositionRef}
            onIslandClick={onIslandClick}
          />
        ))}
      </Physics>

      {/* Camera and lights live outside Physics — they don't need it */}
      <CameraRig boatPositionRef={boatPositionRef} />
      <Lights />
    </>
  )
}
