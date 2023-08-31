import { useAtom } from 'jotai'
import { folder, useControls } from 'leva'

import { patternSettingsAtom } from '../stores/createAppStore'

export default function usePatternSettings() {
  const [getPatternSettings, setPatternSettings] = useAtom(patternSettingsAtom)
  console.info('🚀 ~ usePatternSettings ~ getPatternSettings:', getPatternSettings)

  useControls({
    PatternSettings: folder(
      {
        TargetDistance: {
          label: 'Distance',
          value: getPatternSettings.targetDistance,
          min: 0,
          max: 100,
          step: 1,
          onChange: (value) => {
            setPatternSettings({
              ...getPatternSettings,
              targetDistance: value
            })
          },
          transient: true
        },
        TargetRevertSpeed: {
          label: 'Speed',
          value: getPatternSettings.targetRevertSpeed,
          min: 0,
          max: 100,
          step: 1,
          onChange: (value) => {
            console.info('🚀 ~ usePatternSettings ~ value:', value)
            setPatternSettings({
              ...getPatternSettings,
              targetRevertSpeed: value
            })
          },
          transient: true
        }
      },
      {
        collapsed: true
      }
    )
  })
}
