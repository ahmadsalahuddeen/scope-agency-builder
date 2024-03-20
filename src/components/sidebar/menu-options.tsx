'use client'
import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React from 'react'

type Props = {
  defaultOpen?: boolean,
  subAccounts : SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo : string
  details: any;
  users: any
  id: string
}

const MenuOptions = ({defaultOpen, subAccounts, sidebarLogo, sidebarOpt, details, users, id}: Props) => {
  return (
    <div>MenuOptions</div>
  )
}

export default MenuOptions