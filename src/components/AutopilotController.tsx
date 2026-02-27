import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useNav, useNavDispatch } from '../store/navigationStore'
import { ISLANDS } from '../data/islandPositions'

const ARRIVE_DIST = 10
const TOUR_PAUSE_MS = 6000

interface AutopilotControllerProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
  autopilotTargetRef: React.MutableRefObject<THREE.Vector3 | null>
}

export default function AutopilotController({
  boatPositionRef,
  autopilotTargetRef,
}: AutopilotControllerProps) {
  const nav = useNav()
  const dispatch = useNavDispatch()
  const timerRef = useRef<number | null>(null)
  const arrivedRef = useRef(false)
  const _islandPos = useRef(new THREE.Vector3())

  // Sync nav.autopilotTarget (island id) -> autopilotTargetRef (Vector3)
  useEffect(() => {
    if (nav.autopilotTarget) {
      const island = ISLANDS.find((i) => i.id === nav.autopilotTarget)
      if (island) {
        autopilotTargetRef.current = new THREE.Vector3(...island.position)
        arrivedRef.current = false
      }
    } else {
      autopilotTargetRef.current = null
      arrivedRef.current = false
    }
  }, [nav.autopilotTarget, autopilotTargetRef])

  // Detect arrival via proximity check
  useFrame(() => {
    if (!nav.autopilotTarget || arrivedRef.current) return

    const island = ISLANDS.find((i) => i.id === nav.autopilotTarget)
    if (!island) return

    _islandPos.current.set(...island.position)
    const dist = boatPositionRef.current.distanceTo(_islandPos.current)

    if (dist < ARRIVE_DIST) {
      arrivedRef.current = true

      dispatch({ type: 'MARK_VISITED', island: nav.autopilotTarget })
      dispatch({ type: 'SET_ACTIVE_ISLAND', island: nav.autopilotTarget })

      if (nav.mode === 'guided') {
        dispatch({ type: 'SET_TOUR_PAUSED', paused: true })

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
          dispatch({ type: 'SET_ACTIVE_ISLAND', island: null })
          dispatch({ type: 'ADVANCE_TOUR' })
        }, TOUR_PAUSE_MS)
      }
    }
  })

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return null
}
