import { useNav, useNavDispatch } from '../store/navigationStore'

export default function LanguageToggle() {
  const nav = useNav()
  const dispatch = useNavDispatch()

  return (
    <button
      className="lang-toggle"
      onClick={() => dispatch({ type: 'TOGGLE_LOCALE' })}
    >
      {nav.locale === 'es' ? 'ES' : 'EN'} | {nav.locale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
