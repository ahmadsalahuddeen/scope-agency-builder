import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo';
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split('.').pop();
  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== 'pdf' ? (<div className="relative  h-40 w-40">
          <Image  src={value} alt='Uploaded Image' className='object-contain' fill />
        </div> )
        :  (
          <div className="flex relative items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a href={value} target='_blank'
            rel='noopener_noreferrer'
            className='text-sm text-indigo-500  hover:underline dark:text-indigo-400 ml-2'
            >View PDF</a>
          </div>
        ) }
        <Button onClick={()=> onChange('')} variant={'ghost'} type='button'>
          <X className='h-4 w-4'/>
          Remove Logo</Button>
      </div>
    );
  }

  return <div>FileUpload</div>;
};

export default FileUpload;
