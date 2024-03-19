'use client';
import { Agency } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { NumberInput } from '@tremor/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '../ui/alert-dialog';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import FileUpload from '../global/file-upload';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from '@/lib/queries';
import { Button } from '../ui/button';
import Loading from '../global/loading';
import { v4 } from 'uuid';

type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Agency name must be atleast 2 chars.' }),
  agencyLogo: z.string().min(1, { message: 'Provide logo for the agency' }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

const AgencyDetailsComp = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      agencyLogo: data?.agencyLogo,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
    },
  });
  const isLoading = form.formState.isLoading;
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let customerId;

      if (!data?.id) {
        // stripe bodyData
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };
      }

//WIP: stripe customeID
      newUserData = await initUser({role: 'AGENCY_OWNER'})
      if(!data?.id){
        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),

          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: '',
          goal: 5,
        })
      }
    } catch (error) {}
  };

  //handles the deletion of agency
  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    //WIP: discontinue agency subscription
    try {
      const response = await deleteAgency(data.id);
      toast({
        title: 'Deleted Agency',
        description: 'Deleted you agency and all sub accounts',
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'ooppse! Deleting Failed',
        description: 'could not delete your agency ',
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agecny setting
            later form the agency setting tab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agencylogo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="flex md:flex-row gap-4">
                {/* Agency  Name */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Agency Name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Agency email */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex md:flex-row gap-4">
                {/* Agency  phone number */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* whiteLabel */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center rounded-lg justify-between border gap-4 p-4">
                      <div>
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription>
                          Turning on whitelabel mode will show your agency logo
                          to all sub accounts by default. you can overwrite this
                          functionality through sub account settings.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <div className="flex md:flex-row gap-4">
                {/* address */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 st.." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex md:flex-row gap-4">
                {/* city */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* state */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* zipcode */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zipcode" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex md:flex-row gap-4">
                {/* country */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create a Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for you agency. As your business grows your
                    goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (value: number) => {
                      if (!data?.id) return;
                      await updateAgencyDetails(data.id, { goal: value });
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goals to | ${value} Sub Accounts`,
                        subaccountId: undefined,
                      });
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input rounded-lg"
                    placeholder="Sub Account Goals"
                  />
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : 'Save Agency Information'}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div>
              <div className="flex flex-row items-center justify-between rounded-lg border-destructive border gap-4 p-4 mt-4   ">
                <div>
                  <div>Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your agency cannot be undone. this will also delete
                  all sub accounts and all data related to the sub accounts. Sub
                  account will no longer have access to Funnels, contact etc.
                </div>
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap "
              >
                {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetailsComp;
