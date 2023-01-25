import React from 'react';

import { TFamily } from '@/lib/db/model/Family';

type FamilyBoxProps = {
  family: TFamily;
} & React.ComponentPropsWithoutRef<'div'>;

export default function FamilyBox(props: FamilyBoxProps) {
  const { family } = props;
  return (
    <div className='mx-2 flex w-60 cursor-pointer flex-col flex-wrap rounded-md border-2 border-emerald-500 bg-emerald-900 px-4 py-5 hover:scale-105'>
      <div className='item flex justify-between'>
        <p className='mr-2 font-bold'>ID : </p>
        <p>{family._id}</p>
      </div>
      <div className='item flex justify-between'>
        <p className='mr-2 font-bold'>Name : </p>
        <p>{family.name}</p>
      </div>
    </div>
  );
}
