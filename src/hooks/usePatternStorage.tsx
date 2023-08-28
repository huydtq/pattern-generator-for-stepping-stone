import React from 'react'

import { produce } from 'immer'
import { useAtom } from 'jotai'
import _ from 'underscore'

import { platformsAtom } from '../stores/createPlatformStore'
import { PlatformModel, PlatformTypes } from '../types'

export default function usePatternStorage() {
  const [currentPatternIndex, setCurrentPatternIndex] = React.useState<number>(0)
  const [getPatternsAtom, setPatternsAtom] = useAtom(platformsAtom)
  const countRef = React.useRef<number>(0)

  React.useEffect(() => {
    if (countRef.current < getPatternsAtom.length) {
      setCurrentPatternIndex(getPatternsAtom.length - 1)
    } else if (countRef.current > getPatternsAtom.length) {
      if (currentPatternIndex > 0) {
        setCurrentPatternIndex(getPatternsAtom.length - 1)
      } else {
        setCurrentPatternIndex(0)
      }
    }
    countRef.current = getPatternsAtom.length
  }, [getPatternsAtom])

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
      const temp = [...prev]
      temp.push([])
      return temp
    })
  }

  const remove = () => {
    if (getPatternsAtom.length === 1) {
      return
    }

    if (currentPatternIndex === getPatternsAtom.length - 1) {
      setCurrentPatternIndex((prev) => prev - 1)
    }

    setPatternsAtom((prev) => {
      const temp = [...prev]
      temp.splice(currentPatternIndex, 1)
      return temp
    })
  }

  const current = () => {
    return getPatternsAtom[currentPatternIndex]
  }

  const set = (platformModel: PlatformModel) => {
    setPatternsAtom(
      produce((draft) => {
        const currentPattern = [...draft[currentPatternIndex]]
        const tempIndex = _.findIndex(currentPattern, (platform) => platform.id === platformModel.id)

        if (tempIndex === -1) {
          if (platformModel.platformType === PlatformTypes.None) return

          currentPattern.push({
            id: platformModel.id,
            platformType: platformModel.platformType,
            itemType: platformModel.itemType
          })
        } else {
          if (platformModel.platformType === PlatformTypes.None) {
            currentPattern.splice(tempIndex, 1)
          } else {
            currentPattern[tempIndex].platformType = platformModel.platformType
            currentPattern[tempIndex].itemType = platformModel.itemType
          }
        }

        draft[currentPatternIndex] = currentPattern
      })
    )
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
