import { GetMediaFilesType } from '@/lib/types';
import React from 'react';
import MediaUploadButton from './media-upload-button';
import { Command, CommandInput, CommandList } from '../ui/command';
import { CommandEmpty } from 'cmdk';

type Props = {
  data: GetMediaFilesType;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="fle flex-col gap-4 h-full w-full">

      <div className="flex items-center justify-between">
        <h1 className='text-4xl'>Media Bucket</h1>
      <MediaUploadButton subaccountId={subaccountId} />
      
      </div>  
      <Command className='bg-transparent'>
        <CommandInput placeholder='Search file name'/>
        <CommandList>
          <CommandEmpty>No Media Files</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
