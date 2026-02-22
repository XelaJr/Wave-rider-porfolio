import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
}

const LERP_SPEED  = 0.05
const CAMERA_OFFSET = new THREE.Vector3(15, 12, 15)

export default function CameraRig({ boatPositionRef }: CameraRigProps) {
  // Hoisted scratch refs — no allocation in useFrame
  const targetPos  = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())

  useFrame(({ camera }) => {
    const boat = boatPositionRef.current

    // Desired camera position: boat + fixed world-space offset
    targetPos.current.copy(boat).add(CAMERA_OFFSET)
    camera.position.lerp(targetPos.current, LERP_SPEED)

    // Smooth look-at toward boat
    lookTarget.current.lerp(boat, LERP_SPEED)
    camera.lookAt(lookTarget.current)
  })

  return null
}
