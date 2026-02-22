# 🌊 Wave Rider Portfolio

> **Status: Work in Progress** — Core engine complete. Content and polish ongoing.

A Bruno Simon-inspired **3D interactive portfolio** built entirely with React, Three.js, and WebGL. Navigate a procedural ocean on a boat and discover portfolio sections anchored as islands.

---

## Preview

![Wave Rider Portfolio](https://placehold.co/1200x600/0a1628/60c0ff?text=Wave+Rider+Portfolio+—+Coming+Soon)

---

## ✨ Features

- **Procedural Gerstner ocean** — multi-layered wave simulation running on the GPU via custom GLSL shaders; foam, depth gradients, and shimmer included
- **Physics-driven boat** — WASD / Arrow key controls with realistic thrust, drag, and wave-surface tracking via Rapier WebAssembly physics
- **Wave-synced tilting** — the boat's tilt is computed from the wave surface normal, keeping visual and physics always in sync
- **Island proximity system** — sail close to any island to reveal its portfolio section as a contextual HTML overlay
- **Zero GC per frame** — all Three.js scratch objects (Vector3, Quaternion) are hoisted as refs; no heap allocation inside the render loop
- **Smooth camera rig** — diagonal follow camera with lerp-based position and look-at smoothing

---

## 🗺️ World Layout

| Island | Position | Content |
|--------|----------|---------|
| 🏝️ Proyectos | `[40, 0, 0]` | Projects showcase |
| 🏝️ Sobre Mí | `[-35, 0, 45]` | About me |
| 🏝️ Contacto | `[15, 0, -50]` | Contact information |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| 3D Renderer | Three.js 0.183 |
| React Bindings | @react-three/fiber 9.5 |
| Helpers | @react-three/drei 10.7 |
| Physics | @react-three/rapier 2.2 (Rapier WASM) |
| Bundler | Vite 7 |
| Geometry | 100% procedural — no external 3D assets |
| Shaders | Inline GLSL via `String.raw` — no `.glsl` files |

---

## 🚧 Roadmap

The core 3D engine is functional. The following is still in progress:

- [ ] Real project content on islands (cards, screenshots, links)
- [ ] Mobile touch controls
- [ ] Loading screen with progress indicator
- [ ] Ambient ocean sound design
- [ ] Wake / water trail behind the boat
- [ ] Day/night cycle with dynamic sky
- [ ] Lighthouse landmark with animated beam
- [ ] Performance pass (LOD, frustum culling for islands)
- [ ] Deployment to production (Vercel / GitHub Pages)

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

Open [http://localhost:5173](http://localhost:5173) — use **WASD** or **Arrow Keys** to sail.

---

## 🏗️ Architecture

```
src/
├── utils/
│   └── gerstnerWaves.ts     ← Single source of truth for wave math
│                               (CPU buoyancy + GPU vertex shader stay in sync)
├── hooks/
│   └── useBoatControls.ts   ← Keyboard input → stable ref (no stale closures)
└── components/
    ├── Scene.tsx             ← Composition root, owns boatPositionRef
    ├── Ocean.tsx             ← Custom ShaderMaterial, 256×256 plane
    ├── Boat.tsx              ← RigidBody (physics) + Group (visual), decoupled
    ├── Island.tsx            ← Proximity detection via ref + useReducer pattern
    ├── CameraRig.tsx         ← Lerp follow cam, returns null (no JSX)
    └── Lights.tsx            ← Ambient + directional + hemisphere
```

**Key design decision:** The physics `RigidBody` and the rendered boat `<group>` are sibling elements. The physics body drives XZ movement; Y is snapped to the wave surface every frame. The visual group reads position + wave normal and computes its own quaternion — keeping physics and rendering fully decoupled.

---

## 📄 License

MIT — feel free to use this as inspiration for your own creative portfolio.

---

<p align="center">Built with Three.js, React & a lot of ☕</p>
