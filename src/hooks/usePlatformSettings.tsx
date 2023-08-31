import React from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { useAtom } from 'jotai'
import { folder, useControls } from 'leva'

import { InputControls } from './useAppInputControls'
import { platformSettingsAtom } from '../stores/createAppStore'
import { PlatformTypes } from '../types'

export default function usePlatformSettings() {
  const [getPlatformSettings, setPlatformSettings] = useAtom(platformSettingsAtom)
  const [sub] = useKeyboardControls<InputControls>()

  React.useEffect(() => {
    const eventPressDefault = sub(
      (state) => state['0'],
      (pressed) => {
        if (pressed) {
          setPlatformSettings({
            ...getPlatformSettings,
            type: PlatformTypes.None
          })
        }
      }
    )

    const eventPressSlot1 = sub(
      (state) => state['1'],
      (pressed) => {
        if (pressed) {
          setPlatformSettings({
            ...getPlatformSettings,
            type: PlatformTypes.Drop
          })
        }
      }
    )

    const eventPressSlot2 = sub(
      (state) => state['2'],
      (pressed) => {
        if (pressed) {
          setPlatformSettings({
            ...getPlatformSettings,
            type: PlatformTypes.Item
          })
        }
      }
    )

    const eventPressNextOption = sub(
      (state) => state.nextOption,
      (pressed) => {
        if (pressed) {
          setPlatformSettings({
            ...getPlatformSettings,
            currentOption: 'itemId'
          })
        }
      }
    )

    const eventPressPreviousOption = sub(
      (state) => state.previousOption,
      (pressed) => {
        if (pressed) {
          //
        }
      }
    )

    const eventPressIncreaseValue = sub(
      (state) => state.increaseValue,
      (pressed) => {
        if (pressed) {
          // const prevValue = get(currentSettingOption)
          // const newValue = Number(prevValue) + 1
          // set({ [currentSettingOption]: newValue })
        }
      }
    )

    const eventPressDecreaseValue = sub(
      (state) => state.decreaseValue,
      (pressed) => {
        if (pressed) {
          // const prevValue = get(currentSettingOption)
          // const newValue = Number(prevValue) - 1
          // set({ [currentSettingOption]: newValue })
        }
      }
    )

    return () => {
      eventPressDefault()
      eventPressSlot1()
      eventPressSlot2()
      eventPressNextOption()
      eventPressPreviousOption()
      eventPressIncreaseValue()
      eventPressDecreaseValue()
    }
  }, [getPlatformSettings])

  useControls(
    {
      type: folder(
        {
          type: {
            onChange: (value) => {
              setPlatformSettings({
                ...getPlatformSettings,
                type: value
              })
            },
            options: PlatformTypes,
            value: PlatformTypes.Drop,
            transient: false
          }
        },
        {
          collapsed: getPlatformSettings.currentOption === 'type',
          color: getPlatformSettings.currentOption === 'type' ? 'red' : 'white'
        }
      ),
      itemId: folder(
        {
          itemId: {
            onChange: (value) => {
              setPlatformSettings({
                ...getPlatformSettings,
                itemId: value
              })
            },
            value: 0,
            step: 1,
            min: 0,
            max: 10,
            transient: false
          }
        },
        {
          collapsed: getPlatformSettings.currentOption === 'itemId',
          color: getPlatformSettings.currentOption === 'itemId' ? 'red' : 'white'
        }
      ),
      delay: folder(
        {
          delay: {
            onChange: (value) => {
              setPlatformSettings({
                ...getPlatformSettings,
                delay: value
              })
            },
            value: 0,
            step: 1,
            min: 0,
            max: 10,
            transient: false
          }
        },
        {
          collapsed: getPlatformSettings.currentOption === 'delay',
          color: getPlatformSettings.currentOption === 'delay' ? 'red' : 'white'
        }
      ),
      speed: folder(
        {
          speed: {
            onChange: (value) => {
              setPlatformSettings({
                ...getPlatformSettings,
                speed: value
              })
            },
            value: 10,
            step: 1,
            min: 0,
            max: 100,
            transient: false
          }
        },
        {
          collapsed: getPlatformSettings.currentOption === 'speed',
          color: getPlatformSettings.currentOption === 'speed' ? 'red' : 'white'
        }
      )
    },
    [getPlatformSettings]
  )

  return getPlatformSettings
}
