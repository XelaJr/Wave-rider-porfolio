import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Physics } from '@react-three/rapier'
import { useBoatControls } from '../hooks/useBoatControls'
import { useNav, useNavDispatch } from '../store/navigationStore'
import { useTranslation } from '../i18n/translations'
import Ocean from './Ocean'
import Boat from './Boat'
import Island from './Island'
import CameraRig from './CameraRig'
import Lights from './Lights'
import AutopilotController from './AutopilotController'
import { ISLANDS } from '../data/islandPositions'

interface SceneProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
}

export default function Scene({ boatPositionRef }: SceneProps) {
  const keysRef = useBoatControls()
  const headingRef = useRef(0)
  const autopilotTargetRef = useRef<THREE.Vector3 | null>(null)

  const nav = useNav()
  const dispatch = useNavDispatch()
  const t = useTranslation()

  const onIslandClick = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_ISLAND', island: id })
    dispatch({ type: 'MARK_VISITED', island: id })
  }, [dispatch])

  const onAutopilotArrive = useCallback(() => {
    // Handled by AutopilotController
  }, [])

  const onAutopilotInterrupt = useCallback(() => {
    dispatch({ type: 'CANCEL_AUTOPILOT' })
  }, [dispatch])

  return (
    <>
      <Physics gravity={[0, -9.81, 0]}>
        <Ocean />
        <Boat
          boatPositionRef={boatPositionRef}
          keysRef={keysRef}
          headingRef={headingRef}
          autopilotTargetRef={autopilotTargetRef}
          onAutopilotArrive={onAutopilotArrive}
          onAutopilotInterrupt={onAutopilotInterrupt}
        />
        {ISLANDS.map((island) => (
          <Island
            key={island.id}
            id={island.id}
            name={t.islands[island.id as keyof typeof t.islands]?.name ?? island.id}
            position={island.position}
            boatPositionRef={boatPositionRef}
            onIslandClick={onIslandClick}
            visited={nav.visitedIslands.has(island.id)}
            isNextTarget={nav.autopilotTarget === island.id}
          />
        ))}
      </Physics>

      <AutopilotController
        boatPositionRef={boatPositionRef}
        autopilotTargetRef={autopilotTargetRef}
      />

      <CameraRig
        boatPositionRef={boatPositionRef}
        isAutopilot={nav.autopilotTarget !== null}
      />
      <Lights />
    </>
  )
}
