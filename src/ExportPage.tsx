/* eslint-disable prettier/prettier */

import { useAtomValue } from 'jotai';

import { platformsAtom } from './stores/createPlatformStore';
import { PlatformModel } from './types';

export default function ExportPage() {
  const dataTest = useAtomValue(platformsAtom)
  console.info("🚀 ~ ExportPage ~ dataTest:", dataTest)
  const data = localStorage.getItem('patterns');
  const array = JSON.parse(data || "[]") as Array<Array<PlatformModel>>

  const exportData = array?.map((item) => {
    const reducedItems = item.filter((platform) => platform.platformType >= '0')

    const platformDatas = reducedItems.map((platform) => {
      return `platform_data{Id:=${platform.id}, ItemIndex:=${platform.platformType}}`
    })

    const platformDatasString = platformDatas.join(",\n")

    return (
      `stage_data{
          PlatformDatas:= array
          {
              ${platformDatasString}
          }
      }`
    )
  })


  return <div className='whitespace'>{exportData?.map((item, index) => <p key={index}>{item + (index === exportData.length - 1 ? "" : "," )}</p>) }</div>
  // return (<></>)
}
