import React from 'react'

import { KeyboardControlsEntry } from '@react-three/drei'

export enum InputControls {
  Slot_1 = '1',
  Slot_2 = '2',
  Slot_3 = '3',
  Slot_4 = '4',
  Slot_5 = '5',
  Slot_6 = '6',
  Slot_7 = '7',
  Slot_8 = '8',
  Slot_9 = '9',
  Slot_0 = '0',
  Next = 'e',
  Previous = 'q',
  Forward = 'w',
  Backward = 's',
  Left = 'a',
  Right = 'd',
  Up = 'space',
  Down = 'ctrl',
  Add = 'add',
  Remove = 'remove'
}

export default function useAppInputControls() {
  return React.useMemo<KeyboardControlsEntry<InputControls>[]>(
    () => [
      {
        name: InputControls.Slot_1,
        keys: ['Digit1']
      },
      {
        name: InputControls.Slot_2,
        keys: ['Digit2']
      },
      {
        name: InputControls.Slot_3,
        keys: ['Digit3']
      },
      {
        name: InputControls.Slot_4,
        keys: ['Digit4']
      },
      {
        name: InputControls.Slot_5,
        keys: ['Digit5']
      },
      {
        name: InputControls.Slot_6,
        keys: ['Digit6']
      },
      {
        name: InputControls.Slot_7,
        keys: ['Digit7']
      },
      {
        name: InputControls.Slot_8,
        keys: ['Digit8']
      },
      {
        name: InputControls.Slot_9,
        keys: ['Digit9']
      },
      {
        name: InputControls.Slot_0,
        keys: ['Digit0', 'KeyR']
      },
      {
        name: InputControls.Next,
        keys: ['KeyE']
      },
      {
        name: InputControls.Previous,
        keys: ['KeyQ']
      },
      {
        name: InputControls.Forward,
        keys: ['KeyW']
      },
      {
        name: InputControls.Backward,
        keys: ['KeyS']
      },
      {
        name: InputControls.Left,
        keys: ['KeyA']
      },
      {
        name: InputControls.Right,
        keys: ['KeyD']
      },
      {
        name: InputControls.Up,
        keys: ['Space']
      },
      {
        name: InputControls.Down,
        keys: ['ControlLeft']
      },
      {
        name: InputControls.Add,
        keys: ['Insert']
      },
      {
        name: InputControls.Remove,
        keys: ['Delete']
      }
    ],
    []
  )
}
