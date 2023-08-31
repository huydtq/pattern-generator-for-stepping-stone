import React from 'react'

import { useAtom } from 'jotai'
import { folder, useControls } from 'leva'

import { colorSettingsAtom } from '../stores/createAppStore'
import { PlatformTypes } from '../types'

export function useColorSettings() {
  const [getColor, setColor] = useAtom(colorSettingsAtom)

  const platformColorsSetting = React.useMemo(() => {
    return Object.keys(PlatformTypes).reduce((acc, key) => {
      return Object.assign(acc, {
        [key]: {
          value: getColor[key as keyof typeof PlatformTypes] as string,
          transient: true,
          onChange: (value: string) => {
            setColor((prev) => {
              return {
                ...prev,
                [key as keyof typeof PlatformTypes]: value
              }
            })
          }
        }
      })
    }, {})
  }, [])

  useControls({
    Colors: folder(platformColorsSetting, {
      collapsed: true
    })
  })
}
