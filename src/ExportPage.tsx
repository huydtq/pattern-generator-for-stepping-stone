// /* eslint-disable prettier/prettier */
import React from 'react'

import { useAtomValue } from 'jotai'

import { platformsAtom } from './stores/createPlatformStore'

export default function ExportPage() {
  const dataTest = useAtomValue(platformsAtom)

  const exportData = React.useMemo(() => {
    return dataTest.map((item) => {
      const filteredPlatforms = item.filter((platform) => platform.platformType >= '0')

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
