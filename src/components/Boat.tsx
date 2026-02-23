import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import { getWaveHeight, getWaveNormal } from '../utils/gerstnerWaves'
import type { KeysRef } from '../hooks/useBoatControls'

const THRUST_ACCEL = 10.0   // m/s² — acceleration when pressing W/S
const TURN_RATE    = 1.8
const MAX_SPEED    = 15.0   // m/s — hard speed cap
const LINEAR_DAMP  = 1.5   // higher = frena antes al soltar teclas
const WATER_LINE   = 0.3   // how high above wave surface boat sits

interface BoatProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
  keysRef: React.RefObject<KeysRef>
}

export default function Boat({ boatPositionRef, keysRef }: BoatProps) {
  const rbRef     = useRef<RapierRigidBody>(null)
  const visualRef = useRef<THREE.Group>(null)
  const headingRef = useRef(0)

  // Hoisted scratch objects — zero GC in useFrame
  const _up    = useRef(new THREE.Vector3(0, 1, 0))
  const _waveN = useRef(new THREE.Vector3())
  const _qWave = useRef(new THREE.Quaternion())
  const _qHead = useRef(new THREE.Quaternion())
  const _euler = useRef(new THREE.Euler())

  useFrame(({ clock }, delta) => {
    const rb   = rbRef.current
    const vis  = visualRef.current
    const keys = keysRef.current
    if (!rb || !vis || !keys) return

    const t = clock.getElapsedTime()

    // 1. Read physics XZ (Y will be overridden)
    const p = rb.translation()
    const v = rb.linvel()

    // 2. Snap Y to wave surface every frame — no physics in vertical axis
    const waveY = getWaveHeight(p.x, p.z, t)
    const targetY = waveY + WATER_LINE
    rb.setTranslation({ x: p.x, y: targetY, z: p.z }, true)

    // 3. Publish position for camera + island proximity
    boatPositionRef.current.set(p.x, targetY, p.z)

    // 4. Steering
    if (keys.left)  headingRef.current += TURN_RATE * delta
    if (keys.right) headingRef.current -= TURN_RATE * delta

    // 5. Velocity control — damping + thrust in a single setLinvel (no addForce)
    const h  = headingRef.current
    const fx = Math.cos(h)
    const fz = -Math.sin(h)

    const damp = Math.exp(-LINEAR_DAMP * delta)
    let vx = v.x * damp
    let vz = v.z * damp
    if (keys.forward)  { vx += fx * THRUST_ACCEL * delta; vz += fz * THRUST_ACCEL * delta }
    if (keys.backward) { vx -= fx * THRUST_ACCEL * 0.5 * delta; vz -= fz * THRUST_ACCEL * 0.5 * delta }

    const hSpeed = Math.sqrt(vx * vx + vz * vz)
    if (hSpeed > MAX_SPEED) { const s = MAX_SPEED / hSpeed; vx *= s; vz *= s }

    rb.setLinvel({ x: vx, y: 0, z: vz }, true)

    // 6. Sync visual position
    vis.position.set(p.x, targetY, p.z)

    // 8. Visual tilt: wave normal × heading quaternion
    const [nx, ny, nz] = getWaveNormal(p.x, p.z, t)
    _waveN.current.set(nx, ny, nz)
    _qWave.current.setFromUnitVectors(_up.current, _waveN.current)

    _euler.current.set(0, h, 0)
    _qHead.current.setFromEuler(_euler.current)

    vis.quaternion.copy(_qHead.current).premultiply(_qWave.current)
  })

  return (
    <>
      {/* Physics body — invisible, handles XZ movement only */}
      <RigidBody
        ref={rbRef}
        position={[0, 0.5, 0]}
        lockRotations
        linearDamping={0}
        colliders={false}
      >
        <CuboidCollider args={[1.5, 0.25, 0.6]} />
      </RigidBody>

      {/* Visual group — driven manually from physics state */}
      <group ref={visualRef}>
        {/* Hull */}
        <mesh castShadow>
          <boxGeometry args={[3, 0.5, 1.2]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Red hull stripe */}
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[2.9, 0.07, 1.1]} />
          <meshStandardMaterial color="#cc3333" roughness={0.5} />
        </mesh>
        {/* Cabin */}
        <mesh castShadow position={[-0.3, 0.55, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.8]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.5} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0.16, 0.62, 0]}>
          <boxGeometry args={[0.05, 0.35, 0.75]} />
          <meshStandardMaterial color="#88bbdd" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
        </mesh>
        {/* Mast */}
        <mesh position={[-0.3, 1.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </group>
    </>
  )
}
