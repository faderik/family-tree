import Cookies from 'js-cookie';
import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaFemale, FaMale } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';

import { TMember } from '@/lib/db/model/Member';

type MemberAddModalProps = {
  toggleModal: (show?: boolean) => void;
  baseApiUrl: string;
  syncMember: (baseApiUrl: string) => void;
  familyId: string;
  members: [TMember];
};

const MEMBER_STATES = {
  name: '',
  gender: '',
  birthDate: '',
  deathDate: '',
  parentId: '',
  coupleId: '',
  familyId: '',
};

export default function MemberAddModal(props: MemberAddModalProps) {
  const { toggleModal, baseApiUrl, syncMember, members, familyId } = props;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);
  function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          toggleModal(false);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const [member, setMember] = React.useState(MEMBER_STATES);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function submitMember() {
    setLoading(true);

    const token = Cookies.get('token') ?? '';
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Authorization', token);

    const res = await fetch(`${baseApiUrl}/family/add_member`, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        name: member.name,
        gender: member.gender,
        birthDate: member.birthDate,
        deathDate: member.deathDate,
        familyId: familyId,
        parentId: member.parentId,
        coupleId: member.coupleId,
      }),
    });

    const data = await res.json();

    if (data.metadata.status != 201) {
      setLoading(false);
      setError(data.metadata.message);
      console.error(data.data.error);
      return;
    } else {
      setLoading(false);
      toggleModal(false);
      syncMember(baseApiUrl);
    }
  }

  function handleGenderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setMember({ ...member, gender: value });
  }

  return (
    <div
      id='memberAddModal'
      tabIndex={-1}
      aria-hidden='true'
      className='modal fixed inset-0 z-50 hidden h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-dark/80 p-4'
    >
      {/* This is for setting the width */}
      <div className='w-full max-w-md' ref={wrapperRef}>
        {/* Main Modal */}
        <div className='relative rounded-lg border-2 border-emerald-500 bg-white shadow dark:bg-dark'>
          <button
            onClick={() => toggleModal()}
            type='button'
            className='absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
          >
            <RiCloseLine size={30} />
            <span className='sr-only'>Close modal</span>
          </button>
          <div className='flex flex-col px-6 py-6 lg:px-8'>
            <h3 className='mb-8 text-xl font-medium text-gray-900 dark:text-white'>
              Create new Member
            </h3>
            {error != '' && (
              <h4 className='mb-8 text-sm font-semibold text-red-400'>
                {error}
              </h4>
            )}
            <form className='space-y-4' action='#'>
              {/* Name & Gender */}
              <div className='flex gap-2'>
                <div className='flex-grow'>
                  <label
                    htmlFor='member_name'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Member Name
                  </label>
                  <input
                    type='text'
                    name='member_name'
                    id='member_name'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    placeholder='Name'
                    value={member.name}
                    onChange={(e) =>
                      setMember({ ...member, name: e.target.value })
                    }
                  />
                </div>
                <div className='flex flex-grow-0 flex-col'>
                  <label
                    htmlFor='gender'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Gender
                  </label>
                  <div className='flex flex-grow'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        value='M'
                        name='gender'
                        onChange={(e) => handleGenderChange(e)}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-emerald-600'
                      />
                      <label
                        htmlFor='red-radio'
                        className='ml-0 text-sm font-medium text-gray-900 dark:text-gray-300'
                      >
                        <FaMale size={20} className='text-emerald-500' />
                        {/* Male */}
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        value='F'
                        name='gender'
                        onChange={(e) => handleGenderChange(e)}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-emerald-600'
                      />
                      <label
                        htmlFor='green-radio'
                        className='ml-0 text-sm font-medium text-gray-900 dark:text-gray-300'
                      >
                        <FaFemale size={20} className='text-emerald-500' />
                        {/* Female */}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Date */}
              <div className='flex gap-2'>
                <div className='w-full'>
                  <label
                    htmlFor='birthDate'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Birth Date
                  </label>
                  <input
                    type='date'
                    name='birthDate'
                    id='birthDate'
                    placeholder='Birth Date'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    value={member.birthDate}
                    onChange={(e) =>
                      setMember({ ...member, birthDate: e.target.value })
                    }
                  />
                </div>
                <div className='w-full'>
                  <label
                    htmlFor='deathDate'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Death Date
                  </label>
                  <input
                    type='date'
                    name='deathDate'
                    id='deathDate'
                    placeholder='Death Date'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    value={member.deathDate}
                    onChange={(e) =>
                      setMember({ ...member, deathDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='countries'
                  className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                >
                  Parent
                </label>
                <select
                  onChange={(e) =>
                    setMember({ ...member, parentId: e.target.value })
                  }
                  defaultValue='placeholder'
                  id='parentId'
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                >
                  <option value='placeholder'>Choose the parent</option>
                  {members.map((member) => (
                    <option key={'ddown' + member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit BTN */}
              <div>
                <button
                  type='button'
                  className='mt-8 w-full rounded-lg bg-emerald-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800'
                  onClick={() => {
                    submitMember();
                  }}
                >
                  {!loading ? (
                    'Create Family Member'
                  ) : (
                    <div className='loading mx-auto flex items-center justify-center gap-2 text-sm'>
                      <AiOutlineLoading3Quarters
                        size={18}
                        className='animate-spin'
                      />
                      Loading
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
