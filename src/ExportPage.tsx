// /* eslint-disable prettier/prettier */
import React from 'react'

import { useAtomValue } from 'jotai'

import { platformsAtom } from './stores/createPlatformStore'
import { PlatformTypes } from './types'

export default function ExportPage() {
  const dataTest = useAtomValue(platformsAtom)

  const exportData = React.useMemo(() => {
    return [...dataTest].map((item) => {
      const filteredPlatforms = [...item]
        .sort((a, b) => Number(a.id) - Number(b.id))
        .filter((platform) => Number(platform.type) > Number(PlatformTypes.None))

      const platformDatas = filteredPlatforms.map((platform) => {
        const id = 'Id:=' + platform.id
        const type = 'Type:=' + platform.type
        const behavior = 'ItemID:=' + platform.behaviour
        const delay = 'Delay:=' + platform.delay.toFixed(2)
        const speed = 'Speed:=' + platform.delay.toFixed(2)

        return `platform_data{${id},${type},${behavior},${delay},${speed}}`
      })

      const platformDatasString = platformDatas.join(',\n')

      return `stage_data{
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
