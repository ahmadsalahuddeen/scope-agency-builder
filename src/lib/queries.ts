'use server';

import { clerkClient, currentUser } from '@clerk/nextjs';
import { db } from './db';
import { redirect } from 'next/navigation';
import { Agency, Plan, Prisma, Role, SubAccount, User } from '@prisma/client';
import { connect } from 'http2';
import { v4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateMediaType } from './types';

export const getAuthUserDetails = async () => {
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
  try {
    if (user.role === 'AGENCY_OWNER') return null;

    const response = await db.user.create({ data: { ...user } });

    return response;
  } catch (error) {}
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();

  if (!user) return redirect('/sign-in');
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
      description: `Joined`,
      subaccountId: undefined,
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      });

      await db.invitation.delete({
        where: { email: userDetails.email },
      });

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
  return response;
};

//deleting agency
export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({ where: { id: agencyId } });
  return response;
};

// intitializing new user
export const initUser = async (newUser: Partial<User>) => {
  const authUser = await currentUser();
  if (!authUser) return;
  const userData = await db.user.upsert({
    where: { email: authUser?.emailAddresses[0].emailAddress },
    update: newUser,
    create: {
      id: authUser?.id,
      name: `${authUser?.firstName} ${authUser?.lastName}`,
      email: authUser?.emailAddresses[0].emailAddress,
      avatarUrl: authUser?.imageUrl,
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  });
  await clerkClient.users.updateUserMetadata(authUser.id, {
    privateMetadata: {
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  });

  return userData;
};

//upsert agency
export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;
  try {
    const response = await db.agency.upsert({
      where: { id: agency.id },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: 'Dashboard',
              icon: 'category',
              link: `/agency/${agency.id}`,
            },
            {
              name: 'Launchpad',
              icon: 'clipboardIcon',
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: 'Billing',
              icon: 'payment',
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: 'Settings',
              icon: 'settings',
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: 'Sub Accounts',
              icon: 'person',
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: 'Team',
              icon: 'shield',
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    await saveActivityLogsNotification({
      agencyId: response.id,
      description: 'Updated an Agency information',
      subaccountId: undefined,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

//get notification
export const getNotificationAndUsers = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// upsert subaccount

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: 'AGENCY_OWNER',
    },
  });
  if (!agencyOwner) return console.log('🔴 could not create subaccount');

  const permissionId = v4();

  const response = await db.subAccount.upsert({
    where: {
      id: subAccount.id,
    },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      SidebarOption: {
        create: [
          {
            name: 'Launchpad',
            icon: 'clipboardIcon',
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: 'Settings',
            icon: 'settings',
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: 'Funnels',
            icon: 'pipelines',
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: 'Media',
            icon: 'database',
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: 'Automations',
            icon: 'chip',
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: 'Pipelines',
            icon: 'flag',
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: 'Contacts',
            icon: 'person',
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: 'Dashboard',
            icon: 'category',
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
      Pipeline: {
        create: { name: 'Lead Cycle' },
      },
    },
  });

  return response;
};

export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: { id: userId },
    select: { Permissions: { include: { SubAccount: true } } },
  });

  return response;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || 'SUBACCOUNT_USER',
    },
  });

  return response;
};

export const createOrChangeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return response;
  } catch (error) {
    console.log('🔴Could not change persmission', error);
  }
};

export const getSubaccountDetails = async (subaccountId: string) => {
  try {
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSubaccount = async (subaccountId: string) => {
  try {
    const response = await db.subAccount.delete({
      where: { id: subaccountId },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        role: undefined,
      },
    });
    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const response = await db.user.findUnique({
      where: { id: userId },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  let response;

  try {
    // Create invitation in Prisma
    response = await db.invitation.create({
      data: { email, agencyId, role },
    });
  } catch (error) {
    // Handle Prisma errors
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      console.error('Invitation with this email already exists');
      return { error: 'invitationExist' };
    }
    throw error; // Rethrow other Prisma errors
  }

  try {
    // Send invitation using Clerk
    await clerkClient.invitations.createInvitation({
      ignoreExisting: true,
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error; // Rethrow Clerk errors
  }

  return response; // Return the response from Prisma
};

export const getMediaFiles = async (subaccountId: string) => {
  try {
    const mediaFiles = await db.subAccount.findUnique({
      where: { id: subaccountId },
      include: {
        Media: true,
      },
    });

    return mediaFiles;
  } catch (error) {
    console.log(error);
  }
};

export const createMedia = async (
  subaccountId: string,
  MediaFile: CreateMediaType
) => {
  try {
    const response = await db.media.create({
      data: {
        link: MediaFile.link,
        name: MediaFile.name,
        subAccountId: subaccountId,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
