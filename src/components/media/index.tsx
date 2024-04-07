import { GetMediaFilesType } from '@/lib/types';
import React from 'react';

type Props = {
  data: GetMediaFilesType;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="fle flex-col gap-4 h-full w-full">

      <div className="flex items-center justify-between">
        <h1 className='text-4xl'>Media Bucket</h1>
      <UploadButton subaccountId={subaccountId} />
      
      </div>
    </div>
  );
};

export default MediaComponent;
