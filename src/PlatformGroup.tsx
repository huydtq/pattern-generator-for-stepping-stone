import React, { Suspense } from 'react'

import { Html, useKeyboardControls } from '@react-three/drei'
import { saveAs } from 'file-saver'
import { useAtom } from 'jotai'
import { button, buttonGroup, folder, LevaStoreProvider, useControls, useCreateStore } from 'leva'
import { useNavigate } from 'react-router-dom'

import { InputControls } from './hooks/useAppInputControls'
import usePatternStorage from './hooks/usePatternStorage'
import Platform from './Platform'
import { colorsAtom } from './stores/createPlatformStore'
import { PlatformTypes, PlatformModel } from './types'

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

function useColorSettings() {
  const [getColor, setColor] = useAtom(colorsAtom)

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
    Colors: folder(platformColorsSetting)
  })
}

function PlatformGroup({ dimension2D = [9, 9], distanceOffset = 1 }: PlatformGroupProps) {
  const mouseDown = React.useRef<boolean>(false)
  const inputFileRef = React.useRef<HTMLInputElement>(null!)

  const PlatformsGroupX = dimension2D[0]
  const PlatformsGroupY = dimension2D[1]

  const [sub] = useKeyboardControls<InputControls>()
  const patternStorage = usePatternStorage()

  useColorSettings()

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
          set({ Type: PlatformTypes.Item })
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

    const eventPressAdd = sub(
      (state) => state.add,
      (pressed) => {
        if (pressed) {
          patternStorage.add()
        }
      }
    )

    const eventPressRemove = sub(
      (state) => state.remove,
      (pressed) => {
        if (pressed) {
          patternStorage.remove()
        }
      }
    )

    return () => {
      eventPressNext()
      eventPressPrevious()
      eventPressDefault()
      eventPressSlot1()
      eventPressSlot2()
      eventPressAdd()
      eventPressRemove()
    }
  }, [patternStorage])

  const setMouseDown = () => {
    mouseDown.current = true
  }

  const setMouseUp = () => {
    mouseDown.current = false
  }

  const onFileImported = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      const parsedData = JSON.parse(e.target?.result as string) as Array<Array<PlatformModel>>
      if (parsedData !== null) {
        patternStorage.update(parsedData)
        return
      }
    }

    reader.onloadend = () => {
      event.target.value = ''
    }

    reader.readAsText(file)
  }

  const onButtonExportPress = () => {
    const dataToExport = [...patternStorage.all()]

    saveAs(new Blob([JSON.stringify(dataToExport)]), 'export.json')
  }

  const onButtonImportPress = () => {
    inputFileRef.current?.click()
  }

  const navigate = useNavigate()

  const onButtonGeneratePress = () => {
    navigate('/export')
  }

  const setPlatform = (platformIndex: number, isClick: boolean = false) => {
    if (mouseDown.current === false && isClick === false) return

    patternStorage.set({
      id: platformIndex,
      platformType: get('Type'),
      itemType: get('ItemTypeField').toString()
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
  }, [patternStorage.current, patternStorage.index])

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
      onChange: () => {},
      options: PlatformTypes,
      value: PlatformTypes.Drop,
      transient: true
    },
    ItemTypeField: {
      onChange: () => {},
      value: 0,
      step: 1,
      min: 0,
      max: 10,
      render: (get) => get('Type') === PlatformTypes.Item,
      transient: true
    },
    Actions: buttonGroup({
      Add: () => patternStorage.add(),
      Remove: () => patternStorage.remove()
    }),
    Data: folder({
      Generate: button(onButtonGeneratePress),
      Export: button(onButtonExportPress),
      Import: button(onButtonImportPress)
    })
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
        <Html>
          <input
            ref={inputFileRef}
            type='file'
            style={{
              display: 'none'
            }}
            onChange={onFileImported}
          />
        </Html>
      </PatternContext.Provider>
    </Suspense>
  )
}
