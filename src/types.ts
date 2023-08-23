export type PlatformModel = {
  id: number
  platformType: number
  itemType: number
}

export const PlatformTypes = {
  None: 0,
  Item: 1,
  Drop: 2
} as const

export const ItemTypes = {
  Coin: 1,
  Power: 2
} as const
