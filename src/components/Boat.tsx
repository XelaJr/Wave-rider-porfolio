import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import { getWaveHeight, getWaveNormal } from '../utils/gerstnerWaves'
import type { KeysRef } from '../hooks/useBoatControls'

const THRUST_ACCEL = 10.0
const TURN_RATE    = 1.8
const MAX_SPEED    = 15.0
const LINEAR_DAMP  = 1.5
const WATER_LINE   = 0.3
const MODEL_SCALE    = 3.0
const MODEL_ROTATION = 0
const MODEL_PATH = '/models/LowPolySpeedBoatV1.glb'

const AUTOPILOT_ARRIVE_DIST = 8
const AUTOPILOT_SLOW_DIST = 15

interface BoatProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
  keysRef: React.RefObject<KeysRef>
  headingRef: React.MutableRefObject<number>
  autopilotTargetRef: React.MutableRefObject<THREE.Vector3 | null>
  onAutopilotArrive: () => void
  onAutopilotInterrupt: () => void
}

export default function Boat({
  boatPositionRef,
  keysRef,
  headingRef,
  autopilotTargetRef,
  onAutopilotArrive,
  onAutopilotInterrupt,
}: BoatProps) {
  const rbRef     = useRef<RapierRigidBody>(null)
  const visualRef = useRef<THREE.Group>(null)

  const { scene } = useGLTF(MODEL_PATH)

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
    const p = rb.translation()
    const v = rb.linvel()

    // Snap Y to wave surface
    const waveY = getWaveHeight(p.x, p.z, t)
    const targetY = waveY + WATER_LINE
    rb.setTranslation({ x: p.x, y: targetY, z: p.z }, true)
    boatPositionRef.current.set(p.x, targetY, p.z)

    const apTarget = autopilotTargetRef.current

    if (apTarget && !keys.anyPressed) {
      // --- AUTOPILOT MODE ---
      const dx = apTarget.x - p.x
      const dz = apTarget.z - p.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < AUTOPILOT_ARRIVE_DIST) {
        // Arrived
        autopilotTargetRef.current = null
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
        onAutopilotArrive()
      } else {
        // Steer toward target
        const desiredHeading = Math.atan2(-dz, dx)
        let diff = desiredHeading - headingRef.current
        // Normalize to [-PI, PI]
        diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI
        if (diff < -Math.PI) diff += 2 * Math.PI

        const maxTurn = TURN_RATE * delta
        headingRef.current += Math.max(-maxTurn, Math.min(maxTurn, diff))

        // Throttle with ramp-down near target
        const throttle = dist < AUTOPILOT_SLOW_DIST
          ? Math.max(0.3, dist / AUTOPILOT_SLOW_DIST)
          : 1.0

        const h = headingRef.current
        const fx = Math.cos(h)
        const fz = -Math.sin(h)

        const damp = Math.exp(-LINEAR_DAMP * delta)
        let vx = v.x * damp + fx * THRUST_ACCEL * throttle * delta
        let vz = v.z * damp + fz * THRUST_ACCEL * throttle * delta

        const hSpeed = Math.sqrt(vx * vx + vz * vz)
        if (hSpeed > MAX_SPEED * throttle) {
          const s = (MAX_SPEED * throttle) / hSpeed
          vx *= s
          vz *= s
        }

        rb.setLinvel({ x: vx, y: 0, z: vz }, true)
      }
    } else if (apTarget && keys.anyPressed) {
      // --- MANUAL INTERRUPT ---
      autopilotTargetRef.current = null
      onAutopilotInterrupt()

      // Fall through to manual controls
      if (keys.left)  headingRef.current += TURN_RATE * delta
      if (keys.right) headingRef.current -= TURN_RATE * delta

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
    } else {
      // --- MANUAL MODE ---
      if (keys.left)  headingRef.current += TURN_RATE * delta
      if (keys.right) headingRef.current -= TURN_RATE * delta

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
    }

    // Sync visual position
    vis.position.set(p.x, targetY, p.z)

    // Visual tilt: wave normal × heading quaternion
    const [nx, ny, nz] = getWaveNormal(p.x, p.z, t)
    _waveN.current.set(nx, ny, nz)
    _qWave.current.setFromUnitVectors(_up.current, _waveN.current)

    _euler.current.set(0, headingRef.current, 0)
    _qHead.current.setFromEuler(_euler.current)

    vis.quaternion.copy(_qHead.current).premultiply(_qWave.current)
  })

  return (
    <>
      <RigidBody
        ref={rbRef}
        position={[0, 0.5, 0]}
        lockRotations
        linearDamping={0}
        colliders={false}
      >
        <CuboidCollider args={[1.5, 0.25, 0.6]} />
      </RigidBody>

      <group ref={visualRef}>
        <primitive
          object={scene}
          scale={MODEL_SCALE}
          rotation={[0, MODEL_ROTATION, 0]}
          castShadow
        />
      </group>
    </>
  )
}

useGLTF.preload(MODEL_PATH)
