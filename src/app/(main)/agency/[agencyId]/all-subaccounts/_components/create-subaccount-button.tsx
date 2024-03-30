'use client';
import SubAccountDetails from '@/components/forms/subaccount-details';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useModal } from '@/providers/modal-provider';
import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client';
import { PlusCircle, PlusCircleIcon } from 'lucide-react';
import React from 'react';

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className: string;
};
const CreateSubaccountButton = ({ user, className, id }: Props) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;
  if (!agencyDetails) return;

  return (
    <Button
      className={cn('w-full gap-4 flex', className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create Sub Account"
            subHeading="You can switch between subaccounts from menu or sub-account page "
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};

export default CreateSubaccountButton;
