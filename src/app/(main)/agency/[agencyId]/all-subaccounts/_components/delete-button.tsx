'use client';
import {
  deleteSubaccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from '@/lib/queries';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        const subAccountDetails = await getSubaccountDetails(subaccountId);
        await saveActivityLogsNotification({
          agencyId: subAccountDetails?.agencyId,
          description: `Deleted subaccount | ${subAccountDetails?.name}`,
          subaccountId,
        });
        await deleteSubaccount(subaccountId);
      }}
    >
      Delete
    </div>
  );
};

export default DeleteButton;
