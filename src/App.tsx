import React, { Suspense } from 'react'

import './App.css'
import { Dialog } from '@headlessui/react'
import { OrbitControls, Stage, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useAtomValue, useSetAtom } from 'jotai'

import EnvironmentWithSetting from './EnvironmentWithSetting'
import PlatformGroup from './PlatformGroup'
import { dialogExportPlatformsPatternsAtom, platformsPatternsAtom } from './stores/createPlatformStore'

export default function App() {
  const mainCameraRef = React.useRef<THREE.PerspectiveCamera | undefined>(undefined)

  return (
    <div className='relative w-screen h-screen'>
      <Canvas eventPrefix='client' gl={{ preserveDrawingBuffer: true }}>
        <Suspense>
          <Stage position={[0, 0, 0]}>
            <EnvironmentWithSetting />
            <PlatformGroup />
          </Stage>
          <OrbitControls
            camera={mainCameraRef.current}
            enablePan={false}
            enableRotate={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 4.1}
            minPolarAngle={Math.PI / 4.1}
          />
          <Stats />
        </Suspense>
      </Canvas>
    </div>
  )
}

function DialogExport() {
  const getPatternsAtom = useAtomValue(platformsPatternsAtom)
  const getDialogExportPlatformsPatternsAtom = useAtomValue(dialogExportPlatformsPatternsAtom)
  const setDialogExportPlatformsPatternsAtom = useSetAtom(dialogExportPlatformsPatternsAtom)

  return (
    <Dialog open={getDialogExportPlatformsPatternsAtom} onClose={() => setDialogExportPlatformsPatternsAtom(false)}>
      <Dialog.Panel>
        <Dialog.Title>Export data</Dialog.Title>
        <Dialog.Description>
          {getPatternsAtom.map((pattern, index) => {
            if (pattern === undefined) return `pattern ${index}: undefined`
            return `pattern ${index}: ${pattern}`
          })}
        </Dialog.Description>

        <button onClick={() => setDialogExportPlatformsPatternsAtom(false)}>Close</button>
      </Dialog.Panel>
    </Dialog>
  )
}
