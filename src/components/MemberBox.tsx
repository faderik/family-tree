import React from 'react';
import { AiOutlineNumber } from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';

import { TMember } from '@/lib/db/model/Member';

type MemberBoxProps = {
  member: TMember;
  oldest: boolean;
};

function MemberBox(props: MemberBoxProps) {
  const { member, oldest } = props;

  return (
    <div
      key={'mem' + member._id}
      className='flex items-center gap-2 rounded-sm bg-emerald-500 px-2 py-1 font-bold text-dark hover:translate-x-1'
    >
      <>{member.name}</>

      <div className='icon ml-4'>
        {oldest ? (
          <div className='rounded-sm bg-emerald-800 p-1 text-light'>
            <AiOutlineNumber />
          </div>
        ) : (
          <button className='rounded-sm bg-emerald-600 p-1 hover:bg-emerald-400'>
            <FiTrash className='text-dark' />
          </button>
        )}
      </div>
    </div>
  );
}

export default MemberBox;
