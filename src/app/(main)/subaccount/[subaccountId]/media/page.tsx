import BlurPage from '@/components/global/blur-page'
import MediaComponent from '@/components/media'
import { getMediaFiles } from '@/lib/queries'
import React from 'react'

type Props = {
  params: {
    subaccountId: string
  }
}

const MediaPage =async ({params}: Props) => {
  const media = await getMediaFiles(params.subaccountId)
  
  return (
  <BlurPage>
    <MediaComponent data={media} subaccountId={params.subaccountId}/>
  </BlurPage>
  )
}

export default MediaPage