import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type FamilyBoxAddProps = {
  onClick: () => void;
};

export default function FamilyBoxAdd(props: FamilyBoxAddProps) {
  const { onClick } = props;

  return (
    <button
      className='flex h-32 w-60 grow cursor-pointer flex-row flex-wrap items-center justify-center gap-2 rounded-md border-2 border-dashed border-emerald-400 px-4 py-5 text-lg hover:-translate-y-1 '
      type='button'
      onClick={() => {
        onClick();
      }}
    >
      <FiPlusCircle size={30} className='' />
      Add
    </button>
  );
}
