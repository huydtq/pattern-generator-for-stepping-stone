import { atom } from 'jotai'

export const storeSelectedPlatformsIndex = atom<number[]>([])

export const platformsPatternsAtom = atom<Array<Set<number> | undefined>>([])

export const dialogExportPlatformsPatternsAtom = atom<boolean>(true)
