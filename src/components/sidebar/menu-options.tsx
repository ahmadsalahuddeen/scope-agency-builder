'use client';
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  users: any;
  id: string;
};

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarLogo,
  sidebarOpt,
  details,
  users,
  id,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false); // temperory solution for hydration error due to shadcn sheet comp

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {    // temperory solution for hydration error due to shadcn sheet comp
    setIsMounted(true);
  }, []);
  if (!isMounted) return;

  
  return <div>MenuOptions</div>;
};

export default MenuOptions;
