import { MutableRefObject } from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { button, folder, useControls } from 'leva'
import * as THREE from 'three'

import { InputControls } from './useAppInputControls'

export type ControlCameraConfig = {
  label?: string
  ui?: boolean
  reset?: () => void
}

const defaultConfig: ControlCameraConfig = {
  label: 'Camera',
  ui: true,
  reset: undefined
}

export default function useControlCamera(
  cameraRef: MutableRefObject<THREE.Camera>,
  config: ControlCameraConfig = defaultConfig
) {
  const [_, get] = useKeyboardControls<InputControls>()

  useFrame(() => {
    const { w, s, a, d } = get()

    if (w) {
      cameraRef?.current?.translateY(0.5)
    }

    if (s) {
      cameraRef?.current?.translateY(-0.5)
    }

    if (a) {
      cameraRef?.current?.translateX(-0.5)
    }

    if (d) {
      cameraRef?.current?.translateX(0.5)
    }
  })

  useControls({
    Camera: folder({
      position: {
        value: [
          cameraRef.current?.position.x || 0,
          cameraRef.current?.position.y || 0,
          cameraRef.current?.position.z || 0
        ],
        label: 'Position',
        step: 0.1,
        onChange: (value) => {
          cameraRef.current?.position.set(...(value as [number, number, number]))
        }
      },
      rotation: {
        value: [
          cameraRef.current?.rotation.x || 0,
          cameraRef.current?.rotation.y || 0,
          cameraRef.current?.rotation.z || 0
        ],
        label: 'Rotation',
        step: 0.1,
        onChange: (value) => {
          cameraRef.current?.rotation.set(...(value as [number, number, number]))
        }
      },
      Reset: button(() => {
        config.reset !== undefined
          ? config.reset()
          : () => {
              console.log('reset')
              cameraRef.current?.position.set(0, 0, 0)
              cameraRef.current?.rotation.set(0, 0, 0)
            }
      })
    })
  })
}
