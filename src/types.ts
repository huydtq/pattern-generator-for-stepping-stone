export type PlatformModel = {
  id: number
  type: string
  behaviour: number
  delay: number
  speed: number
}

export const PlatformTypes = {
  None: '-2',
  Drop: '-1',
  Item: '0'
} as const

export const ItemTypes = {
  Coin: '1',
  Power: '2'
} as const
