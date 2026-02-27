import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import Scene from './components/Scene'
import IslandPanel from './components/IslandPanel'
import WelcomeOverlay from './components/WelcomeOverlay'
import QuickNav from './components/QuickNav'
import Minimap from './components/Minimap'
import LanguageToggle from './components/LanguageToggle'
import {
  NavContext,
  NavDispatchContext,
  useNavReducer,
} from './store/navigationStore'

export default function App() {
  const [navState, navDispatch] = useNavReducer()
  const boatPositionRef = useRef(new THREE.Vector3(0, 1, 0))

  return (
    <NavContext.Provider value={navState}>
      <NavDispatchContext.Provider value={navDispatch}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 35, near: 0.1, far: 1000, position: [15, 12, 15] }}
        >
          <Suspense fallback={null}>
            <Scene boatPositionRef={boatPositionRef} />
          </Suspense>
        </Canvas>

        <WelcomeOverlay />
        <IslandPanel />

        {!navState.showWelcome && (
          <>
            <QuickNav />
            <Minimap boatPositionRef={boatPositionRef} />
            {navState.mode === 'guided' && (
              <div className="tour-indicator">
                {navState.locale === 'es'
                  ? 'Tour Guiado — Presiona cualquier tecla para tomar control'
                  : 'Guided Tour — Press any key to take control'}
              </div>
            )}
          </>
        )}

        <LanguageToggle />
      </NavDispatchContext.Provider>
    </NavContext.Provider>
  )
}
