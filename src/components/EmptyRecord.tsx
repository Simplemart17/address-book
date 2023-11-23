import React from 'react';
import notFoundIcon from '@/images/icons/notFound.svg';
import Image from 'next/image';

type EmptyRecordProps = {
  className?: string;
  message: string;

};

const EmptyRecord = ({ className, message }: EmptyRecordProps) => {
  return (
    <div className={className}>
      <div>
        <Image
          src={notFoundIcon}
          alt="not_found"
          className="block my-0 mx-auto w-16"
        />
        <p className="text-center font-bold text-gray-700 leading-relaxed text-sm mt-4">
          {message}
        </p>
      </div>
    </div>
  );
};

export default EmptyRecord;
