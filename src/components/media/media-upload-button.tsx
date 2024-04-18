'use client'
import { useModal } from '@/providers/modal-provider';
import React from 'react';
import { Button } from '../ui/button';
import CustomModal from '../global/custom-modal';
import MediaUploadForm from '../forms/upload-media-form';

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subHeading="Upload file to your media bucket"
          >
            <MediaUploadForm subaccountId={subaccountId} ></MediaUploadForm>
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
