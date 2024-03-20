import { getAuthUserDetails } from '@/lib/queries';
import React from 'react';
import MenuOptions from './menu-options';

type Props = {
  id: string;
  type: 'agency' | 'subaccount';
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return null;
  if (!user.Agency) return;

  const details =
    type === 'agency'
      ? user.Agency
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;
  if (!details) return;

  let sidebarLogo = user.Agency.agencyLogo || '/assets/scope-logo.svg';

  // side bar logo based on type
  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sidebarLogo =
        user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  // side bar options based on type
  const sideBarOpt =
    type === 'agency'
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );
  return (
    <>
      {/* desktop nav */}
      <MenuOptions
        details={details}
        user={user}
        sidebarLogo={sidebarLogo}
        id={id}
        defaultOpen={true}
        sidebarOpt={sideBarOpt}
        subAccounts={subaccounts}
      />

      {/* mobile nav */}
      <MenuOptions
        details={details}
        user={user}
        sidebarLogo={sidebarLogo}
        id={id}
        sidebarOpt={sideBarOpt}
        subAccounts={subaccounts}
      />
    </>
  );
};

export default Sidebar;
