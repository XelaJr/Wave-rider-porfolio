import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildGLSLWaveFunction } from '../utils/gerstnerWaves'

// Generated at module load — inlined constants, no arrays, max GPU compat
const waveFunction = buildGLSLWaveFunction()

// Vertex shader: compute waves in world space so XZ both contribute.
// PlaneGeometry local Y maps to world -Z after [-PI/2,0,0] rotation,
// so we must use modelMatrix-transformed XZ, not raw position.xz.
const vertexShader = String.raw`
uniform float uTime;
varying vec3  vWorldPos;
varying float vElevation;

${waveFunction}

void main() {
  // Transform vertex to world space (rotation baked in)
  vec4 wp = modelMatrix * vec4(position, 1.0);

  // Sample wave height at world XZ
  float elevation = gerstnerHeight(wp.x, wp.z);

  // Displace upward in world Y
  wp.y += elevation;

  vWorldPos  = wp.xyz;
  vElevation = elevation;

  // projectionMatrix * viewMatrix is equivalent to projectionMatrix * modelViewMatrix
  // when we handle the model transform ourselves
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const fragmentShader = String.raw`
varying vec3  vWorldPos;
varying float vElevation;
uniform float uTime;

void main() {
  vec3 deepColor    = vec3(0.0,  0.4, 0.5);
  vec3 shallowColor = vec3(0.0,  0.75, 0.9);
  vec3 foamColor    = vec3(0.92, 0.97, 1.0);

  // Blend deep/shallow by elevation
  float t = clamp((vElevation + 0.5) / 1.0, 0.0, 1.0);
  vec3 color = mix(deepColor, shallowColor, t);

  // Foam on crests
  float foam = smoothstep(0.35, 0.90, vElevation);
  color = mix(color, foamColor, foam * 0.65);

  // Approximate surface normal from screen-space derivatives
  vec3 dx = dFdx(vWorldPos);
  vec3 dz = dFdy(vWorldPos);
  vec3 normal = normalize(cross(dz, dx));

  // Sun specular highlight
  vec3 sunDir = normalize(vec3(0.6, 1.0, 0.4));
  float spec = pow(max(dot(normal, sunDir), 0.0), 80.0) * 0.55;
  color += vec3(spec);

  // Incoherent shimmer — irrational frequency ratios break any grid pattern
  float shimmer = sin(vWorldPos.x * 1.73 + vWorldPos.z * 0.97 + uTime * 2.1) * 0.018;
  shimmer      += sin(vWorldPos.x * 0.83 + vWorldPos.z * 2.31 + uTime * 1.7) * 0.013;
  shimmer      += sin(vWorldPos.x * 2.41 + vWorldPos.z * 1.37 + uTime * 2.9) * 0.010;
  color += shimmer;

  gl_FragColor = vec4(color, 0.93);
}
`

export default function Ocean() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        side: THREE.FrontSide,
      }),
    [],
  )

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={material}>
      <planeGeometry args={[500, 500, 1024, 1024]} />
    </mesh>
  )
}
