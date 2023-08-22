import React, { Suspense } from 'react'

import { useSetAtom, useAtomValue } from 'jotai'
import { button, folder, useControls } from 'leva'

import Platform from './Platform'
import { platformsPatternsAtom, dialogExportPlatformsPatternsAtom } from './stores/createPlatformStore'

type PlatformGroupProps = {
  dimension2D?: [number, number]
  distanceOffset?: number
}

export const PatternContext = React.createContext<{
  currentPatternPlatformsIndexes: Set<number> | undefined
  setCurrentPatternPlatformsIndexes: (index: number) => void
}>({
  currentPatternPlatformsIndexes: new Set(),
  setCurrentPatternPlatformsIndexes: () => {}
})

export default function PlatformGroup({ dimension2D = [9, 9], distanceOffset = 1 }: PlatformGroupProps) {
  const [currentPatternIndex, setCurrentPatternIndex] = React.useState<number | undefined>(undefined)

  const PlatformsGroupX = dimension2D[0]
  const PlatformsGroupY = dimension2D[1]

  let index = 0

  const setPatternsAtom = useSetAtom(platformsPatternsAtom)
  const getPatternsAtom = useAtomValue(platformsPatternsAtom)

  const patternIndexesOptions = React.useMemo(() => {
    return getPatternsAtom.map((_, index) => index)
  }, [getPatternsAtom])

  const setCurrentPatternPlatformsIndexes = React.useCallback(
    (patternIndex: number) => {
      if (currentPatternIndex === undefined) return

      setPatternsAtom((prev) => {
        const newPatterns = [...prev]

        let currentSet = newPatterns[currentPatternIndex]
        if (currentSet === undefined) {
          currentSet = new Set<number>([patternIndex])
          newPatterns[currentPatternIndex] = currentSet
          return newPatterns
        }

        if (currentSet.has(patternIndex)) {
          currentSet.delete(patternIndex)
        } else {
          currentSet.add(patternIndex)
        }

        return newPatterns
      })
    },
    [currentPatternIndex]
  )

  const currentPatternPlatformsIndexes = React.useMemo(() => {
    return currentPatternIndex !== undefined ? getPatternsAtom[currentPatternIndex] : undefined
  }, [currentPatternIndex])

  const onButtonNewPatternPress = () => {
    setPatternsAtom((prev) => {
      return [...prev, undefined]
    })
  }

  const onButtonExportPress = () => {
    const exportPatterns = [] as Array<string>

    // reduce number[] only
    getPatternsAtom.forEach((pattern, index) => {
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
          Index: {
            value: currentPatternIndex,
            onChange(value) {
              console.info('🚀 ~ onChange ~ value:', value)
              setCurrentPatternIndex(value)
            },
            options: patternIndexesOptions
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
          currentPatternPlatformsIndexes: currentPatternPlatformsIndexes,
          setCurrentPatternPlatformsIndexes: setCurrentPatternPlatformsIndexes
        }}
      >
        {Array.from({ length: PlatformsGroupX }).map((_, y) =>
          Array.from({ length: PlatformsGroupY }).map((_, x) => {
            const newIndex = index++
            return (
              <Platform
                index={newIndex}
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
