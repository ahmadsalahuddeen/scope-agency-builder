'use client';
import {
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from '@/lib/queries';
import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from '@/lib/types';
import { useModal } from '@/providers/modal-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubAccount, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import FileUpload from '../global/file-upload';
import { Input } from '../ui/input';

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

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      'AGENCY_OWNER',
      'AGENCY_ADMIN',
      'SUBACCOUNT_USER',
      'SUBACCOUNT_GUEST',
    ]),
  });
  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData ? userData.name : data.user?.name,
      email: userData ? userData.email : data.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data.user?.avatarUrl,
      role: userData ? userData.role : data.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permissions = await getUserPermissions(data.user?.id);
      if (permissions) {
        setSubAccountsPermissions(permissions);
      }
    };
    console.log('getting');

    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
    if (data.user) {
      form.reset(data.user);
    }
  }, [userData, data]);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userData || data?.user) {
      const updatedUser = await updateUser(values);
      authUserData?.Agency?.SubAccount.filter((subacc) =>
        authUserData.Permissions.find(
          (p) => p.subAccountId === subacc.id && p.access
        )
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        });
      });

      if (updatedUser) {
        toast('Success', { description: 'Update User Information' });
        setClose();
        router.refresh();
      } else {
        toast.error('Oppse!', {
          description: 'Could not update user information',
        });
      }
    } else {
      console.log('Error could not submit');
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update user information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === 'AGENCY_OWNER' ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={field.value === 'AGENCY_OWNER'}
                    onValueChange={(value) => {
                      if (
                        value === 'SUBACCOUNT_GUEST' ||
                        value === 'SUBACCOUNT_USER'
                      ) {
                        setRoleState(
                          'You need to have subaccounts to assign Subaccount access to team members.'
                        );
                      } else {
                        setRoleState('');
                      }
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent> 
                      <SelectItem value="AGENCY_ADMIN">
                        Agency Admin
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Subaccount Guest
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Subaccount User
                      </SelectItem>
                      {(data.user?.role === 'AGENCY_OWNER' || userData.role === 'AGENCY_OWNER')&& (
                        <SelectItem value="AGENCY_OWNER">
                        Agency Owner
                      </SelectItem>
                      )}
                      
                    </SelectContent>
                  </Select>

                  <p className='text-muted-foreground'>{roleState}</p>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
