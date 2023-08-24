export type PlatformModel = {
  id: number
  platformType: string
  itemType: string
}

export const PlatformTypes = {
  None: '-1',
  Drop: '0',
  Item: '1'
} as const

export const ItemTypes = {
  Coin: '1',
  Power: '2'
} as const
