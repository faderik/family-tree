import Cookies from 'js-cookie';
import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiCloseLine } from 'react-icons/ri';

type FamilyAddModalProps = {
  toggleModal: (show?: boolean) => void;
  baseApiUrl: string;
  syncFamily: (baseApiUrl: string) => void;
};

export default function FamilyAddModal(props: FamilyAddModalProps) {
  const { toggleModal, baseApiUrl, syncFamily } = props;

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

  const [familyName, setFamilyName] = React.useState('');
  const [familyId, setFamilyId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function submitFamily() {
    setLoading(true);

    const token = Cookies.get('token') ?? '';
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Authorization', token);

    const res = await fetch(`${baseApiUrl}/family/store`, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        fam_name: familyName,
        fam_id: familyId,
      }),
    });

    const data = await res.json();

    if (data.metadata.status != 201) {
      setLoading(false);
      setError(data.metadata.message);
      return;
    } else {
      setLoading(false);
      toggleModal(false);
      syncFamily(baseApiUrl);
    }
  }

  return (
    <div
      id='familyAddModal'
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
              Create new Family
            </h3>
            {error != '' && (
              <h4 className='mb-8 text-sm font-semibold text-red-400'>
                {error}
              </h4>
            )}
            <form className='space-y-6' action='#'>
              <div>
                <label
                  htmlFor='fam_id'
                  className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                >
                  Your Family ID
                </label>
                <input
                  type='text'
                  name='fam_id'
                  id='fam_id'
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                  placeholder='ex: foobar123'
                  value={familyId}
                  onChange={(e) => setFamilyId(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='fam_name'
                  className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                >
                  Your Family Name
                </label>
                <input
                  type='text'
                  name='fam_name'
                  id='fam_name'
                  placeholder='ex: The Foo Family'
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400'
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </div>
              <div>
                <button
                  type='button'
                  className='mt-8 w-full rounded-lg bg-emerald-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800'
                  onClick={() => {
                    submitFamily();
                  }}
                >
                  {!loading ? (
                    'Create Family'
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
