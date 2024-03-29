import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/lib/db';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
};

const Page = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  });

  if (!agencyDetails) return;

  const isAllAgencyDetailExists =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full w-max-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>{`Let's get started✨`}</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* // WIP: add trigger to install PWA functionality after production */}
            <div className="flex justify-between items-center gap-2 border p-4 rounded-lg w-full">
              <div className="flex md:items-center flex-col md:!flex-row gap-4">
                <Image
                  src={'/appstore.png'}
                  alt="apple logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-md"
                />
                <p>Save the website as a shortcut on your mobile devices. 📲</p>
              </div>
              <Button>Start</Button>
            </div>

            <div className="flex justify-between items-center gap-2 border p-4 rounded-lg w-full">
              <div className="flex md:items-center flex-col md:!flex-row gap-4">
                <Image
                  src={'/stripelogo.png'}
                  alt="stripe logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-md"
                />
                <p>
                  Connect your stripe account to accept payments and access
                  dashboard
                </p>
              </div>
              <Button>Start</Button>
            </div>

            <div className="flex justify-between items-center gap-2 border p-4 rounded-lg w-full">
              <div className="flex md:items-center flex-col md:!flex-row gap-4">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="apple logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-md"
                />
                <p>Fill in all you business details.</p>
              </div>

              {isAllAgencyDetailExists ? (
                <CheckCircle
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  href={`/agency/${params.agencyId}/settings`}
                  className={buttonVariants()}
                >
                  Start
                </Link>

              )}
            </div>
          </CardContent>
        </Card>
      </div>{' '}
    </div>
  );
};

export default Page;
