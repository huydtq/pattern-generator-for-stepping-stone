import React from 'react'

import { useAtom } from 'jotai'

import { platformsAtom } from '../stores/createPlatformStore'
import { ItemTypes, PlatformModel, PlatformTypes } from '../types'

export default function usePatternStorage() {
  const [currentPatternIndex, setCurrentPatternIndex] = React.useState<number>(0)
  const [getPatternsAtom, setPatternsAtom] = useAtom(platformsAtom)

  const previous = () => {
    if (currentPatternIndex === 0) {
      return
    }

    setCurrentPatternIndex((prev) => prev - 1)
  }

  const next = () => {
    if (currentPatternIndex === getPatternsAtom.length - 1) {
      return
    }

    setCurrentPatternIndex((prev) => prev + 1)
  }

  const add = () => {
    setPatternsAtom((prev) => {
      return [...prev, [{ id: 0, platformType: PlatformTypes.None, itemType: ItemTypes.Coin }]]
    })

    setCurrentPatternIndex(getPatternsAtom.length)
  }

  const remove = () => {
    setPatternsAtom((prev) => {
      const tempPatterns = [...prev]
      tempPatterns.splice(currentPatternIndex, 1)
      return tempPatterns
    })

    setCurrentPatternIndex((prev) => {
      if (prev === 0) {
        return 0
      }

      return prev - 1
    })
  }

  const current = () => {
    return getPatternsAtom[currentPatternIndex]
  }

  const set = (platformModel: PlatformModel) => {
    const currentPattern = [...current()]
    const tempIndex = currentPattern.findIndex((platform) => platform.id === platformModel.id)

    if (tempIndex === -1) {
      currentPattern.push({
        id: platformModel.id,
        platformType: platformModel.platformType,
        itemType: platformModel.itemType
      })
    } else {
      currentPattern[tempIndex].platformType = platformModel.platformType
      currentPattern[tempIndex].itemType = platformModel.itemType
    }

    setPatternsAtom((prev) => {
      const tempPatterns = [...prev]
      tempPatterns[currentPatternIndex] = currentPattern
      return tempPatterns
    })
  }

  const select = (index: number) => {
    setCurrentPatternIndex(index)
  }

  const all = () => {
    return getPatternsAtom
  }

  return {
    index: currentPatternIndex,
    current,
    add,
    remove,
    previous,
    next,
    set,
    all,
    select,
    update: setPatternsAtom
  }
}
