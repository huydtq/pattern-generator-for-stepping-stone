import React from 'react'

import { useAtomValue } from 'jotai'
import { useSearchParams } from 'react-router-dom'

import { platformsPatternsAtom } from './stores/createPlatformStore'

export default function ExportPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const data = searchParams.get('data')
  const array = data?.split('|').map((value) => JSON.parse(value))

  return <div>{data}</div>
}
