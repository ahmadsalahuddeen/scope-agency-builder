'use client';
import { getNotificationAndUsers } from '@/lib/queries';
import { NotificationWithUser } from '@/lib/types';
import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Sheet, SheetTrigger } from '../ui/sheet';
import { Bell } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

type Props = {
  notifications: NotificationWithUser | [];
  className?: string;
  role?: string;
  subaccountId?: string;
};

const InfoBar = ({ notifications, className, role, subaccountId }: Props) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);
  return (
    <>
      <div
        className={twMerge(
          'fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ',
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex text-white items-center justify-center">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
