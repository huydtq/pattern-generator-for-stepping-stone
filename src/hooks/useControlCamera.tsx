import { MutableRefObject } from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { folder, useControls } from 'leva'
import * as THREE from 'three'

import { InputControls } from './useAppInputControls'

export type ControlCameraConfig = {
  label: string
  ui: boolean
}

export default function useControlCamera(cameraRef: MutableRefObject<THREE.Camera>, config: ControlCameraConfig) {
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
    [config.label]: folder(
      {
        position: {
          value: [cameraRef?.current?.position.x, cameraRef?.current?.position.y, cameraRef?.current?.position.z],
          label: 'Position'
        },
        rotation: {
          value: [cameraRef?.current?.rotation.x, cameraRef?.current?.rotation.y, cameraRef?.current?.rotation.z],
          label: 'Rotation'
        }
      },
      {
        render: () => config.ui
      }
    )
  })
}
