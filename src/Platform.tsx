import React from 'react'

import { Box, Edges, Text } from '@react-three/drei'
import { Euler } from '@react-three/fiber'
import { useAtomValue } from 'jotai'
import _ from 'underscore'

import { PatternContext } from './PlatformGroup'
import { colorSettingsAtom } from './stores/createAppStore'
import { PlatformSchema, PlatformTypes } from './types'

export type PlatformProps = React.ComponentProps<typeof Box> & Pick<PlatformSchema, 'id'>

// type type = (typeof types)[keyof typeof types]

const textEuler: Euler = [-1.5, 0, 0]

export default function Platform({ position = [0, 0, 0], scale = [1, 0.1, 1], id }: PlatformProps) {
  const boxRef = React.useRef<THREE.Mesh>(null!)
  const textRef = React.useRef<THREE.Mesh>(null!)
  const getColorsSetting = useAtomValue(colorSettingsAtom)

  const patternContext = React.useContext(PatternContext)

  const platformData: PlatformSchema | undefined = React.useMemo(() => {
    const yeaboi = Array.from(patternContext.currentPattern)
    return yeaboi.find((platform) => platform.id === id)
  }, [patternContext.currentPattern])

  const platformColor = React.useMemo(() => {
    const platformColorKey = _.invert(PlatformTypes)[platformData ? platformData.type : PlatformTypes.None]
    return getColorsSetting[platformColorKey as keyof typeof PlatformTypes]
  }, [platformData, getColorsSetting])

  const initialPosition = React.useMemo(() => position as [number, number, number], [])

  const onHoverPlatform = () => {
    patternContext.setPlatform(id)
  }

  const onClickPlatform = () => {
    patternContext.setPlatform(id, true)
  }

  const renderPlatform = () => {
    return (
      <Box
        position={initialPosition}
        ref={boxRef}
        scale={scale}
        onPointerDown={onClickPlatform}
        onPointerEnter={onHoverPlatform}
      >
        <meshStandardMaterial color={platformColor}></meshStandardMaterial>
        <Edges />
      </Box>
    )
  }

  const renderTextType = () => {
    const invertedPlatformTypes = _.invert(PlatformTypes)

    return (
      <Text
        color='black'
        fontSize={0.2}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] - 0.3]}
        ref={textRef}
        rotation={textEuler}
      >
        {platformData ? invertedPlatformTypes[platformData.type] : invertedPlatformTypes[PlatformTypes.None]}
      </Text>
    )
  }

  const renderTextPlatformSettings = () => {
    return (
      platformData && (
        <>
          <Text
            color='red'
            fontSize={0.12}
            position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] - 0.125]}
            ref={textRef}
            rotation={textEuler}
          >
            {`Item:${platformData.itemId}`}
          </Text>
          <Text
            color='green'
            fontSize={0.12}
            position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2]]}
            ref={textRef}
            rotation={textEuler}
          >
            {`Delay:${platformData.delay}`}
          </Text>
          <Text
            color='blue'
            fontSize={0.12}
            position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] + 0.125]}
            ref={textRef}
            rotation={textEuler}
          >
            {`Speed:${platformData.speed}`}
          </Text>
        </>
      )
    )
  }

  function renderPlatformId() {
    return (
      <Text
        color='black'
        fontSize={0.2}
        position={[initialPosition[0], initialPosition[1] + 0.1, initialPosition[2] + 0.275]}
        ref={textRef}
        rotation={textEuler}
      >
        {id}
      </Text>
    )
  }

  return (
    <group>
      {renderPlatform()}
      {renderTextType()}
      {renderTextPlatformSettings()}
      {renderPlatformId()}
    </group>
  )
}
