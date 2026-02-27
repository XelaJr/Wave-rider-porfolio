import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useNav, useNavDispatch } from '../store/navigationStore'
import { useTranslation } from '../i18n/translations'
import { ISLANDS } from '../data/islandPositions'

const MAP_SIZE = 160
// World bounds for mapping
const WORLD_X_MIN = -10
const WORLD_X_MAX = 70
const WORLD_Z_MIN = -30
const WORLD_Z_MAX = 40

function worldToMap(wx: number, wz: number): [number, number] {
  const mx = ((wx - WORLD_X_MIN) / (WORLD_X_MAX - WORLD_X_MIN)) * MAP_SIZE
  const my = ((wz - WORLD_Z_MIN) / (WORLD_Z_MAX - WORLD_Z_MIN)) * MAP_SIZE
  return [mx, my]
}

interface MinimapProps {
  boatPositionRef: React.RefObject<THREE.Vector3>
}

export default function Minimap({ boatPositionRef }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nav = useNav()
  const dispatch = useNavDispatch()
  const t = useTranslation()
  const animRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE)

    // Background
    ctx.fillStyle = 'rgba(2, 8, 20, 0.75)'
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)
    ctx.strokeStyle = 'rgba(30, 100, 200, 0.3)'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, MAP_SIZE, MAP_SIZE)

    // Islands
    for (const island of ISLANDS) {
      const [mx, my] = worldToMap(island.position[0], island.position[2])
      const isVisited = nav.visitedIslands.has(island.id)
      const isTarget = nav.autopilotTarget === island.id
      const name = t.islands[island.id as keyof typeof t.islands]?.name ?? island.id

      // Island circle
      ctx.beginPath()
      ctx.arc(mx, my, 6, 0, Math.PI * 2)
      if (isTarget) {
        ctx.fillStyle = '#ffcc00'
      } else if (isVisited) {
        ctx.fillStyle = '#2a5a3a'
      } else {
        ctx.fillStyle = '#60c0ff'
      }
      ctx.fill()

      // Checkmark on visited
      if (isVisited) {
        ctx.fillStyle = '#fff'
        ctx.font = '8px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('✓', mx, my + 3)
      }

      // Label
      ctx.fillStyle = 'rgba(200, 230, 255, 0.7)'
      ctx.font = '7px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(name, mx, my + 15)
    }

    // Boat
    const boat = boatPositionRef.current
    const [bx, by] = worldToMap(boat.x, boat.z)
    ctx.beginPath()
    ctx.arc(bx, by, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#ffdd44'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.stroke()

    animRef.current = requestAnimationFrame(draw)
  }, [boatPositionRef, nav.visitedIslands, nav.autopilotTarget, t])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    // Find closest island
    let closest: string | null = null
    let closestDist = Infinity
    for (const island of ISLANDS) {
      const [mx, my] = worldToMap(island.position[0], island.position[2])
      const d = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2)
      if (d < 15 && d < closestDist) {
        closest = island.id
        closestDist = d
      }
    }
    if (closest) {
      dispatch({ type: 'NAVIGATE_TO', island: closest })
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="minimap"
      width={MAP_SIZE}
      height={MAP_SIZE}
      onClick={handleClick}
    />
  )
}
