export type PlatformModel = {
  id: number
  platformType: string
  itemType: string
}

export const PlatformTypes = {
  None: '2',
  Drop: '-1',
  Item: '0'
} as const

export const ItemTypes = {
  Coin: '1',
  Power: '2'
} as const
