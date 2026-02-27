# 🌊 Wave Rider Portfolio

> **Status: Work in Progress** — Core engine + navigation system complete. Content and polish ongoing.

A Bruno Simon-inspired **3D interactive portfolio** built entirely with React, Three.js, and WebGL. Navigate a procedural ocean on a boat, discover portfolio sections anchored as islands, and take a guided autopilot tour — all in your browser.

---

## Preview

![Wave Rider Portfolio](https://placehold.co/1200x600/0a1628/60c0ff?text=Wave+Rider+Portfolio+—+Coming+Soon)

> Replace with a GIF or screenshot of the actual experience

---

## ✨ Features

- **Welcome overlay** — choose between a guided autopilot tour or free exploration on arrival
- **Guided tour (autopilot)** — the boat steers itself to all 5 islands in sequence, pausing 6 seconds at each one to display its content, then advances automatically
- **Free exploration** — full manual sailing with WASD / Arrow keys at any time; pressing any key during autopilot immediately cancels it and returns control
- **Quick Nav bar** — bottom navigation with 5 buttons (keyboard shortcuts `1`–`5`) to jump to any island; visited islands show a checkmark
- **2D Minimap** — live canvas map showing boat position and all islands; click any island to autopilot there
- **Visual beacons** — each island has a lighthouse beacon: cyan = unvisited, dark green = visited, gold pulsing ring = current autopilot target
- **Island proximity system** — mid-range labels appear 12–50 m away; interactive markers appear under 12 m; a slide-in panel shows content on click or autopilot arrival
- **5 portfolio islands** — About Me, Skills, Projects, Experience, Contact; each with its own content renderer
- **Skills panel** — categorized by Frontend / Backend / Tools with tag chips
- **Experience panel** — job cards with role, company, period, description, and tech tags
- **Procedural Gerstner ocean** — multi-layered wave simulation on the GPU via custom GLSL shaders; foam, depth gradients, and specular shimmer included
- **Physics-driven boat** — realistic thrust, drag, and wave-surface tracking via Rapier WebAssembly physics
- **Wave-synced tilting** — boat tilt computed from the wave surface normal, keeping visual and physics always in sync
- **Smooth camera rig** — diagonal follow camera with lerp smoothing; shifts to a cinematic angle during autopilot
- **Bilingual (ES / EN)** — toggle between Spanish and English at any time; all UI text and island content switches instantly
- **Zero GC per frame** — all Three.js scratch objects (Vector3, Quaternion, Euler) hoisted as refs; no heap allocation inside the render loop

---

## 🎮 Controls

| Action | Input |
|--------|-------|
| Move forward | `W` / `↑` |
| Move backward | `S` / `↓` |
| Turn left | `A` / `←` |
| Turn right | `D` / `→` |
| Jump to island 1–5 | `1` `2` `3` `4` `5` |
| Navigate to island | Click minimap or Quick Nav button |
| Open island panel | Sail within 12 m and click marker |
| Cancel autopilot | Press any movement key |
| Toggle language | `ES \| EN` button (top right) |
| Close island panel | `✕` button |

---

## 🧭 Navigation Modes

### Tour Guiado / Guided Tour
The boat pilots itself through all 5 islands in order: **About → Skills → Projects → Experience → Contact**. At each stop it pauses 6 seconds, opens the island panel automatically, then moves on. Press any movement key at any time to take control and switch to free exploration.

### Exploración Libre / Free Exploration
Full manual control. Use the Quick Nav bar or minimap to autopilot to specific islands, or just sail around and discover them at your own pace.

---

## 🗺️ World Layout

| # | Island | Position | Content |
|---|--------|----------|---------|
| 1 | 🏝️ About Me | `[20, 0, 0]` | Bio and background |
| 2 | 🏝️ Skills | `[40, 0, -18]` | Frontend, Backend, Tools |
| 3 | 🏝️ Projects | `[55, 0, 8]` | Project showcase with links |
| 4 | 🏝️ Experience | `[40, 0, 30]` | Work history |
| 5 | 🏝️ Contact | `[18, 0, 25]` | Email and social links |

Islands are arranged in a front arc so the tour flows naturally from spawn point at `[0, 0, 0]`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.7 |
| 3D Renderer | Three.js 0.183 |
| React Bindings | @react-three/fiber 9.5 |
| Helpers | @react-three/drei 10.7 |
| Physics | @react-three/rapier 2.2 (Rapier WASM) |
| Bundler | Vite 7 |
| State Management | React Context + useReducer (no external store) |
| i18n | Custom hook + translation dictionary (ES / EN) |
| 3D Model | Custom GLB (`LowPolySpeedBoatV1.glb`) |
| Shaders | Inline GLSL via `String.raw` — no `.glsl` files |
| Font | IBM Plex Mono (Google Fonts) |

---

## 🚀 Running Locally

**Requirements:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/XelaJr/Wave-rider-porfolio.git
cd Wave-rider-porfolio

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and use **WASD** or **Arrow Keys** to sail.

```bash
# Production build
npm run build

# Preview the build
npm run preview
```

---

## 🏗️ Architecture

```
src/
├── store/
│   └── navigationStore.ts    ← useReducer + Context: nav mode, visited islands,
│                                autopilot target, active panel, locale
├── i18n/
│   └── translations.ts       ← ES/EN dictionary + useTranslation() hook
├── data/
│   ├── islandPositions.ts    ← World coordinates for all 5 islands
│   └── islandsData.ts        ← Locale-aware content (projects, bio, skills…)
├── utils/
│   └── gerstnerWaves.ts      ← Single source of truth for wave math:
│                                CPU buoyancy + GPU vertex shader stay in sync
├── hooks/
│   └── useBoatControls.ts    ← Keyboard input → stable ref (no stale closures)
│                                includes anyPressed flag for autopilot interrupt
└── components/
    ├── Scene.tsx              ← Composition root: lifts headingRef + autopilotTargetRef
    ├── Ocean.tsx              ← Custom ShaderMaterial, 500×500 plane, 1024×1024 subdivisions
    ├── Boat.tsx               ← RigidBody (physics) + Group (visual); autopilot steering logic
    ├── Island.tsx             ← Procedural geometry, beacon, proximity labels, markers
    ├── AutopilotController.tsx← Syncs nav state → Vector3 ref; detects arrival; advances tour
    ├── CameraRig.tsx          ← Lerp follow cam; cinematic offset during autopilot
    ├── IslandPanel.tsx        ← Slide-in panel with 5 content renderers
    ├── WelcomeOverlay.tsx     ← Initial splash: tour vs explore selection
    ├── QuickNav.tsx           ← Bottom nav bar + keyboard shortcuts 1-5
    ├── Minimap.tsx            ← Canvas 2D map with live boat position + click-to-navigate
    ├── LanguageToggle.tsx     ← ES | EN button
    └── Lights.tsx             ← Ambient + directional + hemisphere
```

### Key design decisions

**Physics / rendering decoupled:** The Rapier `RigidBody` and the rendered boat `<group>` are siblings. Physics drives XZ; Y is snapped to the wave surface every frame. The visual group computes its own quaternion from wave normal + heading — no physics rotation lock needed for visuals.

**Single wave source of truth:** `gerstnerWaves.ts` generates both CPU functions (`getWaveHeight`, `getWaveNormal`) for boat buoyancy and GLSL code (`buildGLSLWaveFunction`) for the vertex shader. The same 3 wave parameters drive both, so physics and visuals are always in sync.

**Ref-based bridge across the Canvas boundary:** React state can't be read inside `useFrame`. The solution is a set of shared `MutableRefObject`s (`boatPositionRef`, `headingRef`, `autopilotTargetRef`) owned by `App` / `Scene` and passed down as props. Components read/write refs directly; the nav Context is only read to update those refs via `useEffect`.

**Autopilot interrupt:** `useBoatControls` tracks an `anyPressed` boolean on the same ref. Boat's `useFrame` checks it every frame — zero overhead, instant response.

---

## 🚧 Roadmap

### Done
- [x] Procedural Gerstner ocean with GPU shaders
- [x] Physics-driven boat with WASD controls
- [x] Wave-synced boat tilt
- [x] Island proximity detection and HTML markers
- [x] Slide-in content panel
- [x] Guided autopilot tour with 6s island pauses
- [x] Free exploration mode
- [x] Quick Nav bar with keyboard shortcuts
- [x] 2D minimap with click-to-navigate
- [x] Visual beacons (lighthouse) per island
- [x] Mid-range distance labels
- [x] Skills panel (Frontend / Backend / Tools)
- [x] Experience panel (job cards)
- [x] Welcome overlay with mode selection
- [x] Bilingual support (ES / EN)
- [x] Cinematic camera during autopilot

### Pending
- [ ] Real project content (screenshots, live links)
- [ ] Mobile touch controls
- [ ] Loading screen with progress indicator
- [ ] Ambient ocean sound design
- [ ] Wake / water trail behind the boat
- [ ] Day/night cycle with dynamic sky
- [ ] Performance pass (LOD, frustum culling for islands)
- [ ] Deployment to production (Vercel / GitHub Pages)

---

## 📄 License

MIT — feel free to use this as inspiration for your own creative portfolio.

---

<p align="center">Built with Three.js, React & a lot of ☕</p>
