'use client';
import { Agency } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { NumberInput } from '@tremor/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const handleSubmit = async () => {};

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
              <div className="flex flex-col gap-2">
                <FormLabel>Create a Goal</FormLabel>
                <FormDescription>
                  ✨ Create a goal for you agency. As your business grows your
                  goals grow too so dont forget to set the bar higher!
                </FormDescription>
                <NumberInput defaultValue={data?.goal} 
                onChange={()=>{
                  if(!data?.id) return 
                  
                }}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetailsComp;
