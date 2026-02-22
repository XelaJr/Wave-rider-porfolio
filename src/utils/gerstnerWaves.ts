/**
 * Gerstner wave parameters — single source of truth for both
 * GPU vertex shader and CPU buoyancy simulation.
 */
export interface WaveParams {
  dirX: number
  dirZ: number
  amplitude: number
  steepness: number
  wavelength: number
  speed: number
}

export const WAVES: WaveParams[] = [
  { dirX: 1.0,    dirZ: 0.0,   amplitude: 0.5, steepness: 0.3,  wavelength: 20.0, speed: 1.5 },
  { dirX: 0.894,  dirZ: 0.447, amplitude: 0.3, steepness: 0.25, wavelength: 12.0, speed: 1.2 },
  { dirX: -0.707, dirZ: 0.707, amplitude: 0.2, steepness: 0.2,  wavelength: 8.0,  speed: 0.8 },
]

const G = 9.81

/**
 * Sample wave height at world position (x, z) at given time.
 * Uses simplified sinusoidal Gerstner approximation.
 */
export function getWaveHeight(x: number, z: number, time: number): number {
  let height = 0
  for (const w of WAVES) {
    const k = (2 * Math.PI) / w.wavelength
    const phi = w.speed * Math.sqrt(G * k)
    const dot = w.dirX * x + w.dirZ * z
    height += w.amplitude * Math.sin(k * dot + phi * time)
  }
  return height
}

/**
 * Approximate wave surface normal at world position (x, z) at given time.
 * Returns [nx, ny, nz] normalized.
 */
export function getWaveNormal(x: number, z: number, time: number): [number, number, number] {
  let dHdx = 0
  let dHdz = 0
  for (const w of WAVES) {
    const k = (2 * Math.PI) / w.wavelength
    const phi = w.speed * Math.sqrt(G * k)
    const dot = w.dirX * x + w.dirZ * z
    const cos = Math.cos(k * dot + phi * time)
    dHdx += w.amplitude * k * w.dirX * cos
    dHdz += w.amplitude * k * w.dirZ * cos
  }
  // Surface tangents: T=(1,dHdx,0), B=(0,dHdz,1) → normal = cross(T,B)
  const nx = -dHdx
  const ny = 1
  const nz = -dHdz
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
  return [nx / len, ny / len, nz / len]
}

/**
 * Generate a fully-inlined GLSL gerstnerHeight(wx, wz) function.
 * Unrolled loop with no arrays — works on all GPU/GLSL versions.
 * The uniform `uTime` must be declared in the shader that includes this.
 */
export function buildGLSLWaveFunction(): string {
  const PI2 = 2 * Math.PI
  const lines = [
    'float gerstnerHeight(float wx, float wz) {',
    '  float h = 0.0;',
  ]
  for (const w of WAVES) {
    const k     = PI2 / w.wavelength
    const omega = w.speed * Math.sqrt(G * k)
    lines.push(
      `  h += ${w.amplitude.toFixed(6)} * sin(` +
      `${k.toFixed(6)} * (${w.dirX.toFixed(6)} * wx + ${w.dirZ.toFixed(6)} * wz)` +
      ` + ${omega.toFixed(6)} * uTime);`,
    )
  }
  lines.push('  return h;', '}')
  return lines.join('\n')
}
