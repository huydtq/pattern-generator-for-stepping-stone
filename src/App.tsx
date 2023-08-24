import React, { Suspense } from 'react'

import './App.css'
import { KeyboardControls, PerspectiveCamera, Stage, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import EnvironmentWithSetting from './EnvironmentWithSetting'
import useAppInputControls from './hooks/useAppInputControls'
import useControlCamera from './hooks/useControlCamera'
import PlatformGroup from './PlatformGroup'

function AppCanvas() {
  return (
    <Canvas eventPrefix='client' gl={{ preserveDrawingBuffer: true }}>
      <Suspense>
        <Stage position={[0, 0, 0]}>
          <EnvironmentWithSetting />
          <PlatformGroup />
          <StageCamera />
        </Stage>
        <Stats />
      </Suspense>
    </Canvas>
  )
}

function StageCamera() {
  const mainCameraRef = React.useRef<THREE.PerspectiveCamera>(null!)

  useControlCamera(mainCameraRef, {
    label: 'Main Camera',
    ui: false
  })

  return <PerspectiveCamera position={[0, 10, 0]} ref={mainCameraRef} rotation={[1.5, 0, 0]} makeDefault />
}

export default function App() {
  const appInputControls = useAppInputControls()

  React.useEffect(() => {}, [])

  return (
    <div className='relative w-screen h-screen'>
      <KeyboardControls map={appInputControls}>
        <AppCanvas />
      </KeyboardControls>
    </div>
  )
}
