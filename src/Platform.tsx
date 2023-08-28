import React from 'react'

import { Box, Edges, Text } from '@react-three/drei'
import { Euler } from '@react-three/fiber'
import { useAtomValue } from 'jotai'
import _ from 'underscore'

import { PatternContext } from './PlatformGroup'
import { colorsAtom } from './stores/createPlatformStore'
import { PlatformModel, PlatformTypes } from './types'

export type PlatformProps = React.ComponentProps<typeof Box> & Pick<PlatformModel, 'id'>

// type PlatformType = (typeof PlatformTypes)[keyof typeof PlatformTypes]

const textEuler: Euler = [-1.5, 0, 0]

export default function Platform({ position = [0, 0, 0], scale = [1, 0.1, 1], id }: PlatformProps) {
  const boxRef = React.useRef<THREE.Mesh>(null!)
  const textRef = React.useRef<THREE.Mesh>(null!)
  const getColorsSetting = useAtomValue(colorsAtom)

  const patternContext = React.useContext(PatternContext)

  const platformData: PlatformModel | undefined = React.useMemo(() => {
    const yeaboi = Array.from(patternContext.currentPattern)
    return yeaboi.find((platform) => platform.id === id)
  }, [patternContext.currentPattern])

  const platformColor = React.useMemo(() => {
    const platformColorKey = _.invert(PlatformTypes)[platformData ? platformData.platformType : PlatformTypes.None]
    return getColorsSetting[platformColorKey as keyof typeof PlatformTypes]
  }, [platformData, getColorsSetting])

  const initialPosition = React.useMemo(() => position as [number, number, number], [])

  const onHoverPlatform = () => {
    patternContext.setPlatform(id)
  }

  const onClickPlatform = () => {
    patternContext.setPlatform(id, true)
  }

  return (
    <group>
      <Box
        position={initialPosition}
        ref={boxRef}
        scale={scale}
        onClick={onClickPlatform}
        onPointerEnter={onHoverPlatform}
      >
        <meshStandardMaterial color={platformColor}></meshStandardMaterial>
        <Edges />
      </Box>
      <Text
        color='black'
        fontSize={0.2}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] - 0.2]}
        ref={textRef}
        rotation={textEuler}
      >
        {platformData !== undefined
          ? `${_.invert(PlatformTypes)[platformData.platformType]}-${platformData.itemType}`
          : ''}
      </Text>
      <Text
        color='black'
        fontSize={0.3}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] + 0.15]}
        ref={textRef}
        rotation={textEuler}
      >
        {id}
      </Text>
    </group>
  )
}
