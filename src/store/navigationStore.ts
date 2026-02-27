import { createContext, useContext, useReducer, type Dispatch } from 'react'

export const TOUR_ORDER = ['about', 'skills', 'projects', 'experience', 'contact'] as const

export interface NavState {
  mode: 'idle' | 'free' | 'guided'
  showWelcome: boolean
  visitedIslands: Set<string>
  tourIndex: number
  tourPaused: boolean
  activeIsland: string | null
  autopilotTarget: string | null
  locale: 'es' | 'en'
}

export type NavAction =
  | { type: 'START_GUIDED_TOUR' }
  | { type: 'START_FREE_EXPLORATION' }
  | { type: 'MARK_VISITED'; island: string }
  | { type: 'SET_ACTIVE_ISLAND'; island: string | null }
  | { type: 'NAVIGATE_TO'; island: string }
  | { type: 'ADVANCE_TOUR' }
  | { type: 'CANCEL_AUTOPILOT' }
  | { type: 'SET_TOUR_PAUSED'; paused: boolean }
  | { type: 'TOGGLE_LOCALE' }

export const initialNavState: NavState = {
  mode: 'idle',
  showWelcome: true,
  visitedIslands: new Set(),
  tourIndex: 0,
  tourPaused: false,
  activeIsland: null,
  autopilotTarget: null,
  locale: 'es',
}

export function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'START_GUIDED_TOUR':
      return {
        ...state,
        mode: 'guided',
        showWelcome: false,
        tourIndex: 0,
        tourPaused: false,
        autopilotTarget: TOUR_ORDER[0],
        activeIsland: null,
      }
    case 'START_FREE_EXPLORATION':
      return {
        ...state,
        mode: 'free',
        showWelcome: false,
        autopilotTarget: null,
        activeIsland: null,
      }
    case 'MARK_VISITED': {
      const next = new Set(state.visitedIslands)
      next.add(action.island)
      return { ...state, visitedIslands: next }
    }
    case 'SET_ACTIVE_ISLAND':
      return { ...state, activeIsland: action.island }
    case 'NAVIGATE_TO':
      return {
        ...state,
        autopilotTarget: action.island,
        activeIsland: null,
      }
    case 'ADVANCE_TOUR': {
      const nextIdx = state.tourIndex + 1
      if (nextIdx >= TOUR_ORDER.length) {
        return {
          ...state,
          mode: 'free',
          tourPaused: false,
          autopilotTarget: null,
          activeIsland: null,
        }
      }
      return {
        ...state,
        tourIndex: nextIdx,
        tourPaused: false,
        autopilotTarget: TOUR_ORDER[nextIdx],
        activeIsland: null,
      }
    }
    case 'CANCEL_AUTOPILOT':
      return {
        ...state,
        mode: state.mode === 'guided' ? 'free' : state.mode,
        autopilotTarget: null,
        tourPaused: false,
      }
    case 'SET_TOUR_PAUSED':
      return { ...state, tourPaused: action.paused }
    case 'TOGGLE_LOCALE':
      return { ...state, locale: state.locale === 'es' ? 'en' : 'es' }
    default:
      return state
  }
}

export const NavContext = createContext<NavState>(initialNavState)
export const NavDispatchContext = createContext<Dispatch<NavAction>>(() => {})

export function useNav(): NavState {
  return useContext(NavContext)
}

export function useNavDispatch(): Dispatch<NavAction> {
  return useContext(NavDispatchContext)
}

export function useNavReducer() {
  return useReducer(navReducer, initialNavState)
}
