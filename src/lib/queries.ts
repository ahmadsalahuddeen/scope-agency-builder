'use server';

import { currentUser } from '@clerk/nextjs';
import { db } from './db';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';

export const getAuthUserDetails = async () => {
  // user object returned form clerk api
  const user = await currentUser();
  if (!user) {
    return;
  }


  // find and define return userdata field
  const userData = db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: { include: { SidebarOption: true } },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};



// create a team user 

const createTeamUser = async (agencyId: string, user: User) =>{
if(user.role = 'AGENCY_OWNER') return null




}



export const verifyAndAcceptInvitation = async () =>{
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in')
  }

  const invitationExists = await db.invitation.findUnique({
    where:{
      email: user.emailAddresses[0].emailAddress, 
      status: "PENDING"
    }
  })

   if(invitationExists){
    const userDetails = await createTeamUser(invitationExists.agencyId,{} )
   }
}