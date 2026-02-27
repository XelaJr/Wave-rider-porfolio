import { useEffect } from 'react'
import { useNav, useNavDispatch, TOUR_ORDER } from '../store/navigationStore'
import { useTranslation } from '../i18n/translations'

export default function QuickNav() {
  const nav = useNav()
  const dispatch = useNavDispatch()
  const t = useTranslation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const num = parseInt(e.key)
      if (num >= 1 && num <= TOUR_ORDER.length) {
        const island = TOUR_ORDER[num - 1]
        dispatch({ type: 'NAVIGATE_TO', island })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  return (
    <div className="quick-nav">
      {TOUR_ORDER.map((id, idx) => {
        const isVisited = nav.visitedIslands.has(id)
        const isTarget = nav.autopilotTarget === id
        const isActive = nav.activeIsland === id
        const name = t.islands[id as keyof typeof t.islands]?.name ?? id

        let className = 'quick-nav-btn'
        if (isActive) className += ' quick-nav-btn--active'
        if (isTarget) className += ' quick-nav-btn--target'
        if (isVisited) className += ' quick-nav-btn--visited'

        return (
          <button
            key={id}
            className={className}
            onClick={() => dispatch({ type: 'NAVIGATE_TO', island: id })}
          >
            <span className="quick-nav-num">{idx + 1}</span>
            <span className="quick-nav-name">{name}</span>
            {isVisited && <span className="quick-nav-check">✓</span>}
          </button>
        )
      })}
    </div>
  )
}
