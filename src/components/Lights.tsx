export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffeedd" />
      <directionalLight
        castShadow
        position={[50, 80, 30]}
        intensity={1.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <hemisphereLight args={['#87ceeb', '#004080', 0.3]} />
    </>
  )
}
