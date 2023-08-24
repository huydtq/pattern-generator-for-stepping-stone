import React, { Suspense } from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { button, folder, LevaPanel, LevaStoreProvider, useControls, useCreateStore, useStoreContext } from 'leva'

import { InputControls } from './hooks/useAppInputControls'
import usePatternStorage from './hooks/usePatternStorage'
import Platform from './Platform'
import { PlatformTypes, ItemTypes, PlatformModel } from './types'

type PlatformGroupProps = {
  dimension2D?: [number, number]
  distanceOffset?: number
}

export const PatternContext = React.createContext<{
  currentPattern: Array<PlatformModel>
  setPlatform: (platformIndex: number, isClick?: boolean) => void
}>({
  currentPattern: [],
  setPlatform: () => {}
})

export default function PlatformGroupWrapper() {
  const typesStore = useCreateStore()

  return (
    <LevaStoreProvider store={typesStore}>
      <PlatformGroup />
    </LevaStoreProvider>
  )
}

function PlatformGroup({ dimension2D = [9, 9], distanceOffset = 1 }: PlatformGroupProps) {
  const mouseDown = React.useRef<boolean>(false)

  const PlatformsGroupX = dimension2D[0]
  const PlatformsGroupY = dimension2D[1]

  const [sub] = useKeyboardControls<InputControls>()
  const patternStorage = usePatternStorage()

  let index = 0

  React.useEffect(() => {
    document.addEventListener('mousedown', setMouseDown)
    document.addEventListener('mouseup', setMouseUp)

    return () => {
      document.removeEventListener('mousedown', setMouseDown)
      document.removeEventListener('mouseup', setMouseUp)
    }
  }, [])

  React.useEffect(() => {
    const eventPressNext = sub(
      (state) => state.e,
      (pressed) => {
        if (pressed) {
          patternStorage.next()
        }
      }
    )

    const eventPressPrevious = sub(
      (state) => state.q,
      (pressed) => {
        if (pressed) {
          patternStorage.previous()
        }
      }
    )

    const eventPressDefault = sub(
      (state) => state['0'],
      (pressed) => {
        if (pressed) {
          set({ Type: PlatformTypes.None })
        }
      }
    )

    const eventPressSlot2 = sub(
      (state) => state['2'],
      (pressed) => {
        if (pressed) {
          if (get('Type') === PlatformTypes.Item) {
            set({ ItemType: get('ItemType') === ItemTypes.Coin ? ItemTypes.Power : ItemTypes.Coin })
            return
          }

          set({ Type: PlatformTypes.Item })
          set({ ItemType: ItemTypes.Coin })
        }
      }
    )

    const eventPressSlot1 = sub(
      (state) => state['1'],
      (pressed) => {
        if (pressed) {
          set({ Type: PlatformTypes.Drop })
        }
      }
    )

    return () => {
      eventPressNext()
      eventPressPrevious()
      eventPressDefault()
      eventPressSlot1()
      eventPressSlot2()
    }
  }, [patternStorage])

  const setMouseDown = () => {
    mouseDown.current = true
  }

  const setMouseUp = () => {
    mouseDown.current = false
  }

  const onButtonNewPatternPress = () => {
    patternStorage.add()
  }

  const onButtonExportPress = () => {
    const domainUrl = window.location.origin
    console.info('🚀 ~ onButtonExportPress ~ patternStorage.all():', patternStorage.all())
    localStorage.setItem('patterns', JSON.stringify(patternStorage.all()))
    window.open(domainUrl + `/export`, 'noreferrer')
  }

  const setPlatform = (platformIndex: number, isClick: boolean = false) => {
    if (mouseDown.current === false && isClick === false) return

    patternStorage.set({
      id: platformIndex,
      platformType: get('Type'),
      itemType: get('ItemType')
    })
  }

  const arrayPatterns = React.useMemo(() => {
    const tempPatterns = [...patternStorage.all()]

    return tempPatterns.reduce((acc, _, index) => {
      return Object.assign(acc, {
        [`pattern_${index}`]: button(() => patternStorage.select(index), {
          disabled: index === patternStorage.index
        })
      })
    }, {})
  }, [patternStorage])

  useControls(
    {
      Patterns: folder(
        {
          ...arrayPatterns
        },
        { collapsed: false }
      )
    },
    [arrayPatterns]
  )

  const [_, set, get] = useControls(() => ({
    Type: {
      onChange: (value) => {},
      options: PlatformTypes,
      value: PlatformTypes.Drop,
      transient: true
    },
    ItemType: {
      onChange: (value) => {},
      options: ItemTypes,
      render: (get) => get('Type') === PlatformTypes.Item,
      value: ItemTypes.Coin,
      transient: true
    },
    'New Pattern': button(onButtonNewPatternPress),
    Export: button(onButtonExportPress)
  }))

  return (
    <Suspense>
      <PatternContext.Provider
        value={{
          currentPattern: patternStorage.current(),
          setPlatform: setPlatform
        }}
      >
        {Array.from({ length: PlatformsGroupX }).map((_, y) =>
          Array.from({ length: PlatformsGroupY }).map((_, x) => {
            const newIndex = index++
            return (
              <Platform
                id={newIndex}
                key={newIndex}
                position={[-x * distanceOffset, 0, y * distanceOffset]}
                scale={[1, 0.1, 1]}
              />
            )
          })
        )}
      </PatternContext.Provider>
    </Suspense>
  )
}
