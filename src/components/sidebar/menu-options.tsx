'use client';
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { ChevronsUpDown, Compass, Menu, PlusCircle } from 'lucide-react';
import clsx from 'clsx';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import Link from 'next/link';

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarLogo,
  sidebarOpt,
  details,
  user,
  id,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false); // temperory solution for hydration error due to shadcn sheet comp

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    // temperory solution for hydration error due to shadcn sheet comp
    setIsMounted(true);
  }, []);
  if (!isMounted) return;

  return (
    <Sheet
      modal={false}
      open={true}
      // {...openState}
    >
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100]  md:!hidden flex"
      >
        <Button variant={'outline'} size={'icon'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        showX={!defaultOpen}
        className={clsx(
          'backdrop-blur-lg bg-background/80 fixed top-0 border-r-[1px] p-6',
          {
            'hidden md:inline-block z-0 w-[300px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        <AspectRatio ratio={16 / 5}>
          <Image
            src={sidebarLogo}
            fill
            alt="Side bar Logo"
            className="rounded-md object-contain"
          />
        </AspectRatio>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="w-full my-4 flex items-center justify-between py-8"
              variant={'ghost'}
            >
              <div className="flex text-left items-center gap-2">
                <Compass />
                <div className="flex flex-col">
                  {details.name}{' '}
                  <span className="text-muted-foreground">
                    {details.address}
                  </span>
                </div>
              </div>
              <div>
                <ChevronsUpDown size={16} className="text-muted-foreground" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 h-80 mt-4 z-[200]">
            
              <Command className="rounded-lg">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16">
                  <CommandEmpty>No results found.</CommandEmpty>
                  {(user?.role === 'AGENCY_OWNER' ||
                    user?.role === 'AGENCY_ADMIN') &&
                    user?.Agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.Agency?.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.Agency?.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {user?.Agency?.name}
                                <span className="text-muted-foreground">
                                  {user?.Agency?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.Agency?.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.Agency?.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user?.Agency?.name}
                                  <span className="text-muted-foreground">
                                    {user?.Agency?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}

                  {/* subaccount section */}
                  <CommandGroup heading="Accounts">
                    {!!subAccounts
                      ? subAccounts.map((subaccount) => (
                          <CommandItem
                            key={subaccount.id}
                            className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all"
                          >
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${subaccount?.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subaccount?.subAccountLogo}
                                    alt="SubAccount Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {subaccount?.name}
                                  <span className="text-muted-foreground">
                                    {subaccount?.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/subaccount/${subaccount?.id}`}
                                  className="flex gap-4 w-full h-full"
                                >
                                  <div className="relative w-16">
                                    <Image
                                      src={subaccount?.subAccountLogo}
                                      alt="SubAccount Logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    {subaccount?.name}
                                    <span className="text-muted-foreground">
                                      {subaccount?.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : 'No Accounts Found'}
                  </CommandGroup>
                </CommandList>

                {(user?.role === 'AGENCY_OWNER' ||
                  user?.role === 'AGENCY_ADMIN') && (
                    <Button  className="w-full flex  gap-2">
                      <PlusCircle size={16} />
                      Create Sub Account
                    </Button>
                  )}
              </Command>
            
          </PopoverContent>
        </Popover>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
