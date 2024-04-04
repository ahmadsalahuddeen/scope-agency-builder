import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import React from 'react';
import DataTable from './data-table';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import SendInvitation from '@/components/forms/send-invitation';

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

    <DataTable actionButtonText={<>
    <Plus size={15} />
    Add
    </>}
    modalChildren={<><SendInvitation agencyId={params.agencyId} /></>}
    filterValue={'name'}
    columns={columns}
    data={teamMembers}

    />
  </div>;
};

export default TeamPage;
