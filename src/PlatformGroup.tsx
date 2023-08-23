import React, { Suspense } from 'react'

import { useAtom } from 'jotai'
import { button, folder, useControls } from 'leva'

import Platform from './Platform'
import { platformsAtom } from './stores/createPlatformStore'
import { PlatformTypes, ItemTypes, PlatformModel } from './types'

type PlatformGroupProps = {
  dimension2D?: [number, number]
  distanceOffset?: number
}

export const PatternContext = React.createContext<{
  currentPatternPlatforms: Array<PlatformModel>
  setCurrentPatternPlatforms: (platformIndex: number) => void
}>({
  currentPatternPlatforms: [],
  setCurrentPatternPlatforms: () => {}
})

export default function PlatformGroup({ dimension2D = [9, 9], distanceOffset = 1 }: PlatformGroupProps) {
  const [currentPatternIndex, setCurrentPatternIndex] = React.useState<number>(0)
  const [currentPlatformType, setCurrentPlatformType] = React.useState<number>(PlatformTypes.Drop)
  const [currentPlatformItemType, setCurrentPlatformItemType] = React.useState<number>(ItemTypes.Coin)

  const PlatformsGroupX = dimension2D[0]
  const PlatformsGroupY = dimension2D[1]

  let index = 0

  const [getPatternsAtom, setPatternsAtom] = useAtom(platformsAtom)

  React.useEffect(() => {
    const subscription = () => {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          openNextPattern()
        }

        if (event.key === 'ArrowRight') {
          openPreviousPattern()
        }
      })
    }

    subscription()
    return () => {
      document.removeEventListener('keydown', subscription)
    }
  }, [])

  const openNextPattern = React.useCallback(() => {
    setCurrentPatternIndex((prev) => {
      if (prev === getPatternsAtom.length - 1) return 0
      return prev + 1
    })
  }, [currentPatternIndex])

  const openPreviousPattern = React.useCallback(() => {
    setCurrentPatternIndex((prev) => {
      if (prev === 0) return getPatternsAtom.length - 1
      return prev - 1
    })
  }, [currentPatternIndex])

  const patternIndexesOptions = React.useMemo(() => {
    return getPatternsAtom.map((_, index) => index)
  }, [getPatternsAtom])

  const setCurrentPatternPlatformsIndexes = React.useCallback(
    (platformIndex: number) => {
      setPatternsAtom((prev) => {
        const tempPatterns = [...prev]

        const tempPattern = tempPatterns[currentPatternIndex]
        const tempIndex = tempPattern.findIndex((platform) => platform.id === platformIndex)

        if (tempIndex === -1) {
          tempPatterns[currentPatternIndex].push({
            id: platformIndex,
            platformType: currentPlatformType,
            itemType: currentPlatformItemType
          })
        } else {
          tempPattern[tempIndex].platformType = currentPlatformType
          tempPattern[tempIndex].itemType = currentPlatformItemType
        }

        tempPatterns[currentPatternIndex] = [...tempPattern]

        return tempPatterns
      })
    },
    [currentPatternIndex, currentPlatformType, currentPlatformItemType]
  )

  const currentPatternPlatformsIndexes = React.useMemo(() => {
    return getPatternsAtom[currentPatternIndex]
  }, [getPatternsAtom, currentPatternIndex])

  const onButtonNewPatternPress = () => {
    setPatternsAtom((prev) => {
      return [...prev, [{ id: 0, platformType: 0, itemType: 0 }]]
    })

    setCurrentPatternIndex(getPatternsAtom.length)
  }

  const onButtonExportPress = () => {
    const exportPatterns = [] as Array<string>

    getPatternsAtom.forEach((pattern) => {
      if (pattern === undefined) return
      exportPatterns.push(`[${Array.from(pattern)}]`)
    })

    const params = exportPatterns.join('|')
    const domainUrl = window.location.origin
    window.open(domainUrl + `/export?data=${params}`, 'noreferrer')
  }

  useControls(
    {
      Patterns: folder(
        {
          Platform: folder({
            Type: {
              onChange: (value) => setCurrentPlatformType(value),
              options: PlatformTypes,
              value: currentPlatformType
            },
            ItemType: {
              onChange: (value) => setCurrentPlatformItemType(value),
              options: ItemTypes,
              render: (get) => get('Patterns.Platform.Type') === PlatformTypes.Item,
              value: currentPlatformItemType
            }
          }),
          Index: {
            value: currentPatternIndex,
            onChange(value) {
              setCurrentPatternIndex(value)
            },
            options: patternIndexesOptions,
            step: 1
          },
          'New Pattern': button(onButtonNewPatternPress),
          Export: button(onButtonExportPress)
        },
        { collapsed: false }
      )
    },
    [currentPatternIndex, getPatternsAtom]
  )

  return (
    <Suspense>
      <PatternContext.Provider
        value={{
          currentPatternPlatforms: currentPatternPlatformsIndexes,
          setCurrentPatternPlatforms: setCurrentPatternPlatformsIndexes
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
