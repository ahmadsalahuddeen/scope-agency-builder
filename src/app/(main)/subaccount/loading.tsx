import Loading from '@/components/global/loading';
import React from 'react';

type Props = {};

const LoadingPageSubaccount = (props: Props) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loading></Loading>
    </div>
  );
};

export default LoadingPageSubaccount;
