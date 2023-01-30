import React from 'react';
import { CiLock, CiUnlock } from 'react-icons/ci';

import { TFamily } from '@/lib/db/model/Family';

type FamilyBoxProps = {
  family: TFamily;
  isPublic?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

export default function FamilyBox(props: FamilyBoxProps) {
  const { family } = props;
  return (
    <div className='flex h-32 w-60 grow cursor-pointer flex-col flex-wrap justify-center rounded-md border-2 border-emerald-600 px-6 py-2 text-lg hover:-translate-y-1'>
      {props.isPublic ? (
        <CiUnlock size={25} className='mb-1 text-emerald-400' />
      ) : (
        <CiLock size={25} className='mb-1 text-red-400' />
      )}
      <div className='item flex justify-between'>
        <p className='h4'>{family.name}</p>
      </div>
      <div className='item flex justify-between text-xs'>
        <p className='overflow-hidden text-emerald-100'>Family @{family._id}</p>
      </div>
    </div>
  );
}
