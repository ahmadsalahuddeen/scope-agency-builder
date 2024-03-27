'use client';
import { getAuthUserDetails } from '@/lib/queries';
import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from '@/lib/types';
import { useModal } from '@/providers/modal-provider';
import { SubAccount, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
  id: string | null;
  type: 'agency' | 'subaccount';
  userData: Partial<User>;
  subAccounts: SubAccount[];
};

const UserDetails = ({ id, type, subAccounts, userData }: Props) => {
  const { data, setClose } = useModal();
  const [subAccountsPermissions, setSubAccountsPermissions] =
    useState<UserWithPermissionsAndSubAccounts | null>(null);

  const [roleState, setRoleState] = useState('');
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);
  const router = useRouter();

  // get user details
  useEffect(() => {
    if (data.user) {
      const fetchData = async () => {
        const response = await getAuthUserDetails();
        if (response) {
          setAuthUserData(response);
        }
      };
      fetchData();
    }
  }, [data]);

  return <div>UserDetails</div>;
};

export default UserDetails;
