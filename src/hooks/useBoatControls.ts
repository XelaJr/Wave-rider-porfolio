import { useEffect, useRef } from 'react'

export interface KeysRef {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}

/**
 * Tracks WASD / arrow key state. Returns a stable ref whose .current
 * is mutated in place — safe to read inside useFrame without stale closures.
 */
export function useBoatControls(): React.RefObject<KeysRef> {
  const keysRef = useRef<KeysRef>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.forward  = true; break
        case 'KeyS': case 'ArrowDown':  keysRef.current.backward = true; break
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left     = true; break
        case 'KeyD': case 'ArrowRight': keysRef.current.right    = true; break
      }
    }
    const onUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.forward  = false; break
        case 'KeyS': case 'ArrowDown':  keysRef.current.backward = false; break
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left     = false; break
        case 'KeyD': case 'ArrowRight': keysRef.current.right    = false; break
      }
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return keysRef
}
