import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { Suspense, useRef } from 'react'

function CubeCore() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const mouseX = state.mouse.x
    const mouseY = state.mouse.y
    ref.current.rotation.x = 0.25 + mouseY * 0.2
    ref.current.rotation.y += 0.006 + mouseX * 0.002
  })

  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={1.4}>
      <group ref={ref}>
        <RoundedBox args={[2.7, 2.7, 0.55]} radius={0.12} smoothness={6}>
          <MeshTransmissionMaterial
            thickness={0.45}
            roughness={0.12}
            transmission={0.95}
            ior={1.2}
            chromaticAberration={0.04}
            backside
            color="#dfe3ea"
          />
        </RoundedBox>

        <mesh position={[0, 0.82, 0.34]}>
          <boxGeometry args={[2.35, 0.08, 0.05]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.55} />
        </mesh>

        {[...Array(3)].map((_, row) =>
          [...Array(4)].map((__, col) => (
            <mesh key={`${row}-${col}`} position={[-0.88 + col * 0.58, 0.35 - row * 0.48, 0.35]}>
              <boxGeometry args={[0.34, 0.26, 0.04]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={row === 1 && col === 2 ? 0.82 : 0.34} />
            </mesh>
          ))
        )}

        <Text position={[0, -1.05, 0.36]} fontSize={0.18} letterSpacing={0.08} color="white" anchorX="center" anchorY="middle">
          DAYFLOW
        </Text>
      </group>
    </Float>
  )
}

export default function CalendarCube() {
  return (
    <Canvas camera={{ position: [0, 0, 5.3], fov: 42 }} dpr={[1, 1.65]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 4]} intensity={1.6} />
      <pointLight position={[-3, -2, 3]} intensity={1.2} color="#ffffff" />
      <Suspense fallback={null}>
        <CubeCore />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
    </Canvas>
  )
}
