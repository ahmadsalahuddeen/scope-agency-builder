import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
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
                  src={'/stripe.png'}
                  alt="apple logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-md"
                />
                <p>Connect your stripe account to accept payments and access dashboard</p>
              </div>
              <Button>Start</Button>
            </div>


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
          </CardContent>
        </Card>
      </div>{' '}
    </div>
  );
};

export default Page;
