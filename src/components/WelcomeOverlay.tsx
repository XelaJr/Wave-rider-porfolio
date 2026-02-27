import { useNav, useNavDispatch } from '../store/navigationStore'
import { useTranslation } from '../i18n/translations'

export default function WelcomeOverlay() {
  const nav = useNav()
  const dispatch = useNavDispatch()
  const t = useTranslation()

  if (!nav.showWelcome) return null

  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <h1 className="welcome-name">{t.welcome.name}</h1>
        <p className="welcome-title">{t.welcome.title}</p>
        <div className="welcome-buttons">
          <button
            className="welcome-btn welcome-btn--primary"
            onClick={() => dispatch({ type: 'START_GUIDED_TOUR' })}
          >
            {t.welcome.guidedTour}
          </button>
          <button
            className="welcome-btn welcome-btn--secondary"
            onClick={() => dispatch({ type: 'START_FREE_EXPLORATION' })}
          >
            {t.welcome.explore}
          </button>
        </div>
        <p className="welcome-controls">{t.welcome.controls}</p>
      </div>
    </div>
  )
}
