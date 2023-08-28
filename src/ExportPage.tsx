// /* eslint-disable prettier/prettier */
import React from 'react'

import { useAtomValue } from 'jotai'

import { platformsAtom } from './stores/createPlatformStore'
import { PlatformTypes } from './types'

export default function ExportPage() {
  const dataTest = useAtomValue(platformsAtom)

  const exportData = React.useMemo(() => {
    return dataTest.map((item) => {
      const filteredPlatforms = item
        .sort((a, b) => a.id - b.id)
        .filter((platform) => Number(platform.platformType) > Number(PlatformTypes.None))

      const platformDatas = filteredPlatforms.map((platform) => {
        return `platform_data{Id:=${platform.id}, ItemIndex:=${platform.itemType}}`
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
