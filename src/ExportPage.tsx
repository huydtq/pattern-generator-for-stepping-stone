/* eslint-disable prettier/prettier */
import React from 'react'

import { useSearchParams } from 'react-router-dom'

export default function ExportPage() {
  const [searchParams] = useSearchParams()
  const data = searchParams.get('data')
  const array = data?.split('|')
  const exportData = array?.map((item, index) => {
    const itemAsArrayNumber = JSON.parse(item) as number[]

    const platformDatas = itemAsArrayNumber.map((itemIndex) => {
      return `platform_data{Id:=${itemIndex}, ItemIndex:=0}`
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
}
