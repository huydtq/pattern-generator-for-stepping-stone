// /* eslint-disable prettier/prettier */
import React from 'react'

import { useAtomValue } from 'jotai'

import { patternsAtom } from './stores/createAppStore'
import { PlatformTypes } from './types'

export default function ExportPage() {
  const dataTest = useAtomValue(patternsAtom)

  const exportData = React.useMemo(() => {
    return [...dataTest].map((item) => {
      const filteredPlatforms = [...item]
        .sort((a, b) => Number(a.id) - Number(b.id))
        .filter((platform) => Number(platform.type) > Number(PlatformTypes.None))

      const platformDatas = filteredPlatforms.map((platform) => {
        const id = 'Id:=' + platform.id
        const type = 'Type:=' + platform.type
        const itemId = 'ItemID:=' + platform.itemId
        const delay = 'Delay:=' + platform.delay.toFixed(2)
        const speed = 'Speed:=' + platform.speed.toFixed(2)

        return `platform_data{${id},${type},${itemId},${delay},${speed}}`
      })

      const platformDatasString = platformDatas.join(',\n')

      const getMaxDelayTime = Math.max(...filteredPlatforms.map((platform) => platform.delay))

      return `stage_data{
            MaxDelayTime:=${getMaxDelayTime.toFixed(2)},
            MoveDistance:=20.0,
            RevertSpeed:=10.0,
            PlatformDatas:= array
            {
                ${platformDatasString}
            }
        }`
    })
  }, dataTest)

  return (
    <div className='whitespace'>
      {exportData?.map((item, index) => <p key={index}>{item + (index === exportData.length - 1 ? '' : ',')}</p>)}
    </div>
  )
}
