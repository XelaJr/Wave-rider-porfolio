import { useRef, useReducer, useMemo } from 'react'
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
  visited?: boolean
  isNextTarget?: boolean
}

const PROXIMITY_RADIUS = 12
const MID_RANGE_MIN = 12
const MID_RANGE_MAX = 50

export default function Island({
  id,
  name,
  position,
  boatPositionRef,
  onIslandClick,
  visited = false,
  isNextTarget = false,
}: IslandProps) {
  const showRef = useRef(false)
  const midRangeRef = useRef(false)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const islandPos = useRef(new THREE.Vector3(...position))

  // Beacon color based on visited state
  const beaconColor = visited ? '#2a5a3a' : '#60c0ff'
  const beaconIntensity = visited ? 0.5 : 2.0

  useFrame(() => {
    const dist = boatPositionRef.current.distanceTo(islandPos.current)
    const shouldShow = dist < PROXIMITY_RADIUS
    const shouldMidRange = dist >= MID_RANGE_MIN && dist < MID_RANGE_MAX

    if (shouldShow !== showRef.current || shouldMidRange !== midRangeRef.current) {
      showRef.current = shouldShow
      midRangeRef.current = shouldMidRange
      forceUpdate()
    }
  })

  return (
    <group position={position}>
      {/* Island base */}
      <RigidBody type="fixed" colliders="hull">
        <mesh receiveShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[5, 6, 1.5, 8]} />
          <meshStandardMaterial color="#c2a96e" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[3, 4.5, 1.8, 8]} />
          <meshStandardMaterial color="#4a7c3f" roughness={0.8} />
        </mesh>
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

      {/* Beacon (lighthouse) */}
      <pointLight
        position={[0, 15, 0]}
        color={beaconColor}
        intensity={beaconIntensity}
        distance={80}
        decay={2}
      />
      <mesh position={[0, 15, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color={beaconColor} />
      </mesh>
      {/* Beacon pole */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 10, 6]} />
        <meshStandardMaterial color="#556" roughness={0.8} />
      </mesh>

      {/* Next target pulsing ring */}
      {isNextTarget && (
        <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.15, 8, 32]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Mid-range label (visible 12-50m) */}
      {midRangeRef.current && (
        <Html position={[0, 10, 0]} center>
          <div className="island-label-distant">{name}</div>
        </Html>
      )}

      {/* Proximity marker (< 12m) */}
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
