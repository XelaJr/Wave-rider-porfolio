export interface IslandDef {
  id: string
  position: [number, number, number]
}

export const ISLANDS: IslandDef[] = [
  { id: 'about',      position: [20, 0, 0] },
  { id: 'skills',     position: [40, 0, -18] },
  { id: 'projects',   position: [55, 0, 8] },
  { id: 'experience', position: [40, 0, 30] },
  { id: 'contact',    position: [18, 0, 25] },
]
