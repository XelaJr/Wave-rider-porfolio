import { useRef, useReducer } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface IslandProps {
  id: string
  name: string
  position: [number, number, number]
  boatPositionRef: React.RefObject<THREE.Vector3>
  onIslandClick: (id: string) => void
}

const PROXIMITY_RADIUS = 12

export default function Island({ id, name, position, boatPositionRef, onIslandClick }: IslandProps) {
  const showRef = useRef(false)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const islandPos = useRef(new THREE.Vector3(...position))

  useFrame(() => {
    const should = boatPositionRef.current.distanceTo(islandPos.current) < PROXIMITY_RADIUS
    if (should !== showRef.current) {
      showRef.current = should
      forceUpdate()
    }
  })

  return (
    <group position={position}>
      {/* Island base */}
      <RigidBody type="fixed" colliders="hull">
        {/* Sandy base */}
        <mesh receiveShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[5, 6, 1.5, 8]} />
          <meshStandardMaterial color="#c2a96e" roughness={0.9} />
        </mesh>
        {/* Green hill */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[3, 4.5, 1.8, 8]} />
          <meshStandardMaterial color="#4a7c3f" roughness={0.8} />
        </mesh>
        {/* Rock peak */}
        <mesh castShadow position={[0, 2.2, 0]}>
          <coneGeometry args={[2.2, 2.5, 8]} />
          <meshStandardMaterial color="#5d8a4e" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Palm tree trunk */}
      <mesh castShadow position={[2, 2.5, 1]}>
        <cylinderGeometry args={[0.08, 0.12, 3.5, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {/* Palm leaves */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <mesh
          key={i}
          castShadow
          position={[
            2 + Math.sin((deg * Math.PI) / 180) * 1.2,
            4.2,
            1 + Math.cos((deg * Math.PI) / 180) * 1.2,
          ]}
          rotation={[0.4, (deg * Math.PI) / 180, 0.3]}
        >
          <coneGeometry args={[0.15, 1.8, 4]} />
          <meshStandardMaterial color="#2d7a2d" roughness={0.7} />
        </mesh>
      ))}

      {/* Proximity marker */}
      {showRef.current && (
        <Html position={[0, 7, 0]} center>
          <button
            className="island-marker"
            onClick={() => onIslandClick(id)}
            aria-label={`Explorar ${name}`}
          >
            <span className="island-marker-diamond" />
            <span className="island-marker-label">{name}</span>
          </button>
        </Html>
      )}
    </group>
  )
}
