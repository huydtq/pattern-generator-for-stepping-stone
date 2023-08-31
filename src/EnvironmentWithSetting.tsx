import React from 'react'

import { Environment } from '@react-three/drei'
import { PresetsType as EnvironmentPresetsType } from '@react-three/drei/helpers/environment-assets'
import { folder, useControls } from 'leva'

export default function EnvironmentWithSetting() {
  const [preset, setPreset] = React.useState<EnvironmentPresetsType>('sunset')
  const [_, startTransition] = React.useTransition()
  const { blur } = useControls({
    'Environment Settings': folder(
      {
        blur: { value: 0.65, min: 0, max: 1 },
        preset: {
          value: preset,
          options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],
          onChange: (value) => startTransition(() => setPreset(value))
        }
      },
      {
        collapsed: true
      }
    )
  })
  return <Environment blur={blur} preset={preset} background />
}
