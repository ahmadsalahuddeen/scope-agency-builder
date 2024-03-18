'use client';
import { Agency } from '@prisma/client';
import React, { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod'

type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z.string().min(1, {message: 'Agency name must be atleast 2 chars.'})
})

const AgencyDetailsComp = (props: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form  = useForm<z.infer<typeof FormSchema>>()

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
          <Form></Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetailsComp;
