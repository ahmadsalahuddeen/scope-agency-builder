import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import React from 'react';
import DataTable from './data-table';

type Props = {
  params: {
    agencyId: string;
  };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      agencyId: params.agencyId,
    },
    include: {
      Agency: {
        include: {
          SubAccount: true,
        },
      },
      Permissions: true,
    },
  });

  if (!authUser) return;

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { SubAccount: true },
  });
  if (!agencyDetails) return;


  return <div>

    <DataTable />
  </div>;
};

export default TeamPage;
