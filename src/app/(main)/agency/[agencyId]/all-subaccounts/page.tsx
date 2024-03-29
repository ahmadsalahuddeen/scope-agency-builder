import { Button, buttonVariants } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getAuthUserDetails } from '@/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import DeleteButton from './_components/delete-button';

type Props = {};

const AllSubaccountsPage = async (props: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <Button>Create</Button>
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Accounts..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.Agency?.SubAccount.length
                ? user.Agency.SubAccount.map((subaccount) => (
                    <CommandItem
                      className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                      key={subaccount.id}
                    >
                      <Link
                        href={`/subaccount/${subaccount.id}`}
                        className="w-full h-full flex gap-4"
                      >
                        <div className="relative w-32">
                          <Image
                            src={subaccount.subAccountLogo}
                            fill
                            alt="subaccount logo"
                            className="object-contain bg-muted/50  rounded-md p-4"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-col">
                            {subaccount.name}
                            <span className="text-xs text-muted-foreground">
                              {subaccount.address}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <AlertDialogTrigger>
                        <Button
                          size={'sm'}
                          variant={'destructive'}
                          className=" w-20 hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-left">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-left">
                            This action cannot be undone. This will permanently
                            delete your subaccount and remove all your related
                            data to the subaccount from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                          <AlertDialogCancel className="">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className={buttonVariants({
                              variant: 'destructive'
                            })}
                          >
                            <DeleteButton subaccountId={subaccount.id} />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </CommandItem>
                  ))
                : 'df'}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubaccountsPage;
