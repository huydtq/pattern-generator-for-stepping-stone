import React from 'react'

import { Box, Edges, Text } from '@react-three/drei'
import { Color, Euler } from '@react-three/fiber'

import { PatternContext } from './PlatformGroup'
import { ItemTypes, PlatformModel, PlatformTypes } from './types'

export type PlatformProps = React.ComponentProps<typeof Box> & Pick<PlatformModel, 'id'>

type PlatformType = (typeof PlatformTypes)[keyof typeof PlatformTypes]
type ItemType = (typeof ItemTypes)[keyof typeof ItemTypes]

const platformColors: Record<PlatformType, Color> = {
  [PlatformTypes.None]: 'white',
  [PlatformTypes.Drop]: 'deepskyblue',
  [PlatformTypes.Item]: 'coral'
}

const itemColors: Record<ItemType, Color> = {
  [ItemTypes.Coin]: 'gold',
  [ItemTypes.Power]: 'crimson'
}

const textEuler: Euler = [-1.5, 0, 0]

export default function Platform({ position = [0, 0, 0], scale = [1, 0.1, 1], id }: PlatformProps) {
  const boxRef = React.useRef<THREE.Mesh>(null!)
  const textRef = React.useRef<THREE.Mesh>(null!)

  const patternContext = React.useContext(PatternContext)

  const initialPosition = React.useMemo(() => position as [number, number, number], [])

  const onHoverPlatform = () => {
    patternContext.setPlatform(id)
  }

  const onClickPlatform = () => {
    patternContext.setPlatform(id, true)
  }

  const platformData: PlatformModel | undefined = React.useMemo(() => {
    const yeaboi = Array.from(patternContext.currentPattern)
    return yeaboi.find((platform) => platform.id === id)
  }, [patternContext.currentPattern])

  return (
    <group>
      <Box
        position={initialPosition}
        ref={boxRef}
        scale={scale}
        onClick={onClickPlatform}
        onPointerEnter={onHoverPlatform}
      >
        <meshStandardMaterial
          color={platformColors[(platformData?.platformType || PlatformTypes.None) as PlatformType]}
        ></meshStandardMaterial>
        <Edges />
      </Box>
      <Text
        fontSize={0.5}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2]]}
        ref={textRef}
        rotation={textEuler}
        color={
          platformData?.platformType === PlatformTypes.Item ? itemColors[platformData?.itemType as ItemType] : undefined
        }
      >
        {id}
      </Text>
    </group>
  )
}
