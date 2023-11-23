import React from 'react';
import { PuffLoader } from 'react-spinners';

// page loader
export const PageLoader = () => (
  <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black opacity-75">
    <PuffLoader size={60} color={'#0396A6'} />
  </div>
);
