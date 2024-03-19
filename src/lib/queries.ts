'use server';

import { clerkClient, currentUser } from '@clerk/nextjs';
import { db } from './db';
import { redirect } from 'next/navigation';
import { Agency, Role, User } from '@prisma/client';
import { connect } from 'http2';

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

// save activity logs notifications
export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;

  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    });
  }

  if (!userData) {
    console.log('could not find a user');
    return;
  }

  let foundAgencyId = agencyId;
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error('provide atleast agencyId or subaccountId');
    }
    const response = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
    });
    if (response) foundAgencyId = response?.agencyId;
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subaccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        User: {
          connect: {
            id: userData.id,
          },
        },
      },
    });
  }
};

// create a team user
const createTeamUser = async (agencyId: string, user: User) => {
  if ((user.role = 'AGENCY_OWNER')) return null;

  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: 'PENDING',
    },
  });

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: 'Joined',
      subaccountId: undefined,
    });
    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      });
      await db.invitation.delete({ where: { email: userDetails.email } });
      return userDetails.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.agencyId : null;
  }
};


// udpate agency details 
export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  });
return response
};


//deleting agency 
export const deleteAgency = async () =>{
  
}