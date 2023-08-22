import React from 'react'

import { Box, Edges, Text } from '@react-three/drei'
import { Color, Euler } from '@react-three/fiber'

import { PatternContext } from './PlatformGroup'

export type PlatformProps = React.ComponentProps<typeof Box> & {
  index: number
}

const selectColor: Color = 'deepskyblue'
const deselectColor: Color = 'white'

const textSelectedColor: Color = 'crimson'
const textDeselectColor: Color = 'white'

const textEuler: Euler = [-1.5, 0, 0]

export default function Platform({ position = [0, 0, 0], scale = [1, 0.1, 1], index }: PlatformProps) {
  const boxRef = React.useRef<THREE.Mesh>(null!)
  const textRef = React.useRef<THREE.Mesh>(null!)

  const patternContext = React.useContext(PatternContext)

  const initialPosition = React.useMemo(() => position as [number, number, number], [])

  const onPlatformClick = () => {
    patternContext.setCurrentPatternPlatformsIndexes(index)
  }

  const isPlatformSelected = React.useMemo(() => {
    return (
      patternContext.currentPatternPlatformsIndexes !== undefined &&
      patternContext.currentPatternPlatformsIndexes.has(index)
    )
  }, [patternContext])

  console.log('render Platform')

  return (
    <group>
      <Box position={initialPosition} ref={boxRef} scale={scale} onClick={onPlatformClick}>
        <meshStandardMaterial color={isPlatformSelected ? selectColor : deselectColor}></meshStandardMaterial>
        <Edges />
      </Box>
      <Text
        color={isPlatformSelected ? textSelectedColor : textDeselectColor}
        fontSize={0.5}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2]]}
        ref={textRef}
        rotation={textEuler}
      >
        {index}
      </Text>
    </group>
  )
}
