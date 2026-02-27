import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
  isAutopilot?: boolean
}

const LERP_SPEED = 0.05
const OFFSET_NORMAL   = new THREE.Vector3(15, 12, 15)
const OFFSET_AUTOPILOT = new THREE.Vector3(12, 16, 12)

export default function CameraRig({ boatPositionRef, isAutopilot = false }: CameraRigProps) {
  const targetPos  = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const currentOffset = useRef(new THREE.Vector3().copy(OFFSET_NORMAL))

  useFrame(({ camera }) => {
    const boat = boatPositionRef.current
    const desiredOffset = isAutopilot ? OFFSET_AUTOPILOT : OFFSET_NORMAL

    // Smoothly interpolate between offsets
    currentOffset.current.lerp(desiredOffset, 0.02)

    targetPos.current.copy(boat).add(currentOffset.current)
    camera.position.lerp(targetPos.current, LERP_SPEED)

    lookTarget.current.lerp(boat, LERP_SPEED)
    camera.lookAt(lookTarget.current)
  })

  return null
}
