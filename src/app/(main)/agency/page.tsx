import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const AgencyPage = async (props: Props) => {
  
const agencyId = await verifyAndAcceptInvitation()
console.log(agencyId)



const user = await getAuthUserDetails()

  return (
    <div>agency page </div>
  )
}

export default AgencyPage