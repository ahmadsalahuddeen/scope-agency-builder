import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';
import React from 'react';
import Unauthorized from '@/components/unauthorized';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { state: string; code: string };
};

const SubAccountMainPage = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubAccountWithAccess = user.Permissions.find(
    (p) => p.access === true
  );

  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0];
    const stateSubaccountId = searchParams.state.split('___')[1];
    if (!stateSubaccountId) return <div>Not authorized</div>;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

if(getFirstSubAccountWithAccess){
  return redirect(`/subaccount/${getFirstSubAccountWithAccess.subAccountId}`)
}

  return <Unauthorized />
};

export default SubAccountMainPage;
