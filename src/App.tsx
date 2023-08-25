import React, { Suspense } from 'react'

import './App.css'
import { KeyboardControls, PerspectiveCamera, Stage, Stats } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Provider } from 'jotai'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as THREE from 'three'

import EnvironmentWithSetting from './EnvironmentWithSetting'
import ExportPage from './ExportPage'
import useAppInputControls from './hooks/useAppInputControls'
import PlatformGroup from './PlatformGroup'

function AppCanvas() {
  return (
    <Suspense>
      <Canvas eventPrefix='client' gl={{ preserveDrawingBuffer: true }}>
        <Stage position={[0, 0, 0]}>
          <EnvironmentWithSetting />
          <StageCamera />
          <PlatformGroup />
        </Stage>
      </Canvas>
    </Suspense>
  )
}

function Wrapper() {
  const appInputControls = useAppInputControls()

  return (
    <div className='relative w-screen h-screen'>
      <KeyboardControls map={appInputControls}>
        <AppCanvas />
      </KeyboardControls>
    </div>
  )
}

function StageCamera({ initialPosition = [-4, 10, 5], initialRotation = [-1.5, 0, 0] }) {
  const mainCameraRef = React.useRef<THREE.PerspectiveCamera>(null!)

  const set = useThree((state) => state.set)
  // useControlCamera(mainCameraRef)

  React.useEffect(() => {
    void set({ camera: mainCameraRef.current })
  }, [])
  useFrame(() => {
    mainCameraRef.current.position.set(...(initialPosition as [number, number, number]))
    mainCameraRef.current.rotation.set(...(initialRotation as [number, number, number]))
    mainCameraRef.current.updateMatrixWorld()
  })

  return (
    <PerspectiveCamera
      position={[...(initialPosition as [number, number, number])]}
      ref={mainCameraRef}
      rotation={[...(initialRotation as [number, number, number])]}
      makeDefault
    />
  )
}

export default function App() {
  return (
    <Provider>
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/pattern-generator-for-stepping-stone/'}>
        <Routes>
          <Route element={<Wrapper />} path='/' />
          <Route element={<ExportPage />} path='/export' />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
