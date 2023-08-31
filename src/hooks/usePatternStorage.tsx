import React from 'react'

import { useKeyboardControls } from '@react-three/drei'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import _ from 'underscore'

import { InputControls } from './useAppInputControls'
import { patternsAtom } from '../stores/createAppStore'
import { PlatformSchema, PlatformTypes } from '../types'

export default function usePatternStorage() {
  const [currentPatternIndex, setCurrentPatternIndex] = React.useState<number>(0)
  const [getPatternsAtom, setPatternsAtom] = useAtom(patternsAtom)
  const countRef = React.useRef<number>(0)

  const [sub] = useKeyboardControls<InputControls>()

  React.useEffect(() => {
    const eventPressNext = sub(
      (state) => state.e,
      (pressed) => {
        if (pressed) {
          next()
        }
      }
    )

    const eventPressPrevious = sub(
      (state) => state.q,
      (pressed) => {
        if (pressed) {
          previous()
        }
      }
    )

    const eventPressAdd = sub(
      (state) => state.add,
      (pressed) => {
        if (pressed) {
          add()
        }
      }
    )

    const eventPressRemove = sub(
      (state) => state.remove,
      (pressed) => {
        if (pressed) {
          remove()
        }
      }
    )

    return () => {
      eventPressNext()
      eventPressPrevious()
      eventPressAdd()
      eventPressRemove()
    }
  }, [])

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

  const set = (platformModel: PlatformSchema) => {
    setPatternsAtom(
      produce((draft) => {
        const currentPattern = [...draft[currentPatternIndex]] as PlatformSchema[]
        const tempIndex = _.findIndex(currentPattern, (platform) => platform.id === platformModel.id)

        if (tempIndex === -1) {
          if (platformModel.type === PlatformTypes.None) return
          currentPattern.push({
            id: platformModel.id,
            type: platformModel.type,
            itemId: platformModel.itemId,
            speed: platformModel.speed,
            delay: platformModel.delay
          } as PlatformSchema)
        } else {
          if (platformModel.type === PlatformTypes.None) {
            currentPattern.splice(tempIndex, 1)
          } else {
            currentPattern[tempIndex].type = platformModel.type
            currentPattern[tempIndex].itemId = platformModel.itemId
            currentPattern[tempIndex].speed = platformModel.speed
            currentPattern[tempIndex].delay = platformModel.delay
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
