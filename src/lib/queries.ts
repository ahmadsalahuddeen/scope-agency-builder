'use server';

import { currentUser } from '@clerk/nextjs';
import { db } from './db';

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
