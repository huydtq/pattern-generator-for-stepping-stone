import React from 'react'

import { Box, OrbitControls, OrthographicCamera, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useControls } from 'leva'
import './App.css'

export default function App() {
  const mainCameraRef = React.useRef<THREE.PerspectiveCamera | undefined>(undefined)

  const rotationOptions = React.useMemo(() => {
    return {
      x: { value: 0, min: -360, max: 360, step: 0.01 },
      y: { value: 0, min: -360, max: 360, step: 0.01 },
      z: { value: 0, min: -360, max: 360, step: 0.01 }
    }
  }, [])

  const rotation = useControls('Rotation', rotationOptions)

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'gray'
      }}
    >
      <Canvas
        gl={{
          antialias: true
        }}
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: 'yellow'
        }}
      >
        <OrthographicCamera
          position={[0, 0, 10]}
          ref={mainCameraRef}
          rotation={[rotation.x, rotation.x, rotation.z]}
          zoom={200}
          makeDefault
        />
        <ambientLight intensity={0.5} />
        <Box attach='material' position={[0, 0, 0]}>
          <meshNormalMaterial />
        </Box>
        <OrbitControls camera={mainCameraRef.current} />
        <Stats />
      </Canvas>
    </div>
  )
}
