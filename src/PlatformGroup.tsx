import React, { Suspense } from 'react'

import { Html } from '@react-three/drei'
import saveAs from 'file-saver'
import { button, buttonGroup, folder, LevaStoreProvider, useControls, useCreateStore } from 'leva'
import { useNavigate } from 'react-router-dom'

import { useColorSettings } from './hooks/useColorSettings'
import usePatternSettings from './hooks/usePatternSettings'
import usePatternStorage from './hooks/usePatternStorage'
import usePlatformSettings from './hooks/usePlatformSettings'
import Platform from './Platform'
import { PlatformSchema } from './types'

type PlatformGroupProps = {
  dimension2D?: [number, number]
  distanceOffset?: number
}

export const PatternContext = React.createContext<{
  currentPattern: Array<PlatformSchema>
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
  const inputFileRef = React.useRef<HTMLInputElement>(null!)

  const PlatformsGroupX = dimension2D[0]
  const PlatformsGroupY = dimension2D[1]

  const patternStorage = usePatternStorage()

  useColorSettings()
  usePatternSettings()
  const platformSettings = usePlatformSettings()

  let index = 0

  React.useEffect(() => {
    document.addEventListener('mousedown', setMouseDown)
    document.addEventListener('mouseup', setMouseUp)

    return () => {
      document.removeEventListener('mousedown', setMouseDown)
      document.removeEventListener('mouseup', setMouseUp)
    }
  }, [])

  React.useEffect(() => {}, [patternStorage])

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
      const parsedData = JSON.parse(e.target?.result as string) as Array<Array<PlatformSchema>>
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

  const setPlatform = (platformIndex: number, isClick: boolean = false) => {
    if (mouseDown.current === false && isClick === false) return
    patternStorage.set({
      id: platformIndex,
      type: platformSettings.type,
      itemId: platformSettings.itemId,
      delay: Number(platformSettings.delay.toFixed(2)),
      speed: Number(platformSettings.speed.toFixed(2))
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

  useControls(
    {
      Patterns: folder(
        {
          ...arrayPatterns
        },
        { collapsed: false }
      ),
      Actions: buttonGroup({
        Add: () => patternStorage.add(),
        Remove: () => {
          patternStorage.remove()
        }
      }),
      Data: folder({
        Generate: button(onButtonGeneratePress),
        Export: button(onButtonExportPress),
        Import: button(onButtonImportPress)
      })
    },

    [arrayPatterns]
  )

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
