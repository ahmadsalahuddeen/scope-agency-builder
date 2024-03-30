'use client';
import {
  deleteSubaccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from '@/lib/queries';
import { Loader, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  return (
    <div
      onClick={async () => {
        setLoading(true);
        const subAccountDetails = await getSubaccountDetails(subaccountId);
        await saveActivityLogsNotification({
          agencyId: subAccountDetails?.agencyId,
          description: `Deleted subaccount | ${subAccountDetails?.name}`,
          subaccountId,
        });
        await deleteSubaccount(subaccountId);
        router.refresh();
        setLoading(false);
      }}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
    </div>
  );
};

export default DeleteButton;
