'use client';
import { useModal } from '@/providers/modal-provider';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  title: string;
  subHeading: string;
  children: React.ReactNode;
  defaultOpen: boolean;
};

const CustomModal = ({ title, subHeading, defaultOpen, children }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-scroll md:max-h-[700px]  md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left ">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="">{subHeading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
