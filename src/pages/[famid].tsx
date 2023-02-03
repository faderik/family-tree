/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { AiOutlineLoading3Quarters, AiOutlineNumber } from 'react-icons/ai';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { FiTrash } from 'react-icons/fi';

import { TFamily } from '@/lib/db/model/Family';
import { TMember } from '@/lib/db/model/Member';

import Layout from '@/components/layout/Layout';
import MemberAddModal from '@/components/MemberAddModal';
import Seo from '@/components/Seo';

import { getAbsoluteUrl, getAppCookies, verifyToken } from '@/middleware/utils';

type FamilyPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

export default function FamilyPage(props: FamilyPageProps) {
  const router = useRouter();
  const { famid } = router.query;
  const [family, setFamily] = React.useState<TFamily>();
  const [members, setMembers] = React.useState<[TMember]>([{}] as [TMember]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getMembers(props.baseApiUrl);
  }, []);

  async function getMembers(baseApiUrl: string) {
    setLoading(true);

    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-Type', 'application/json');

    const res = await fetch(`${baseApiUrl}/family/${famid}`, {
      method: 'GET',
      headers: reqHeaders,
    });

    const data = await res.json();
    setFamily(data.data.family);
    setMembers(data.data.members);
    setLoading(false);

    return;
  }

  function toggleModal(show?: boolean) {
    if (show === false) {
      document.getElementById('memberAddModal')?.classList.add('hidden');
      document.getElementById('memberAddModal')?.classList.remove('flex');
      return;
    } else if (show === true) {
      document.getElementById('memberAddModal')?.classList.remove('hidden');
      document.getElementById('memberAddModal')?.classList.add('flex');
      return;
    }

    document.getElementById('memberAddModal')?.classList.toggle('hidden');
    document.getElementById('memberAddModal')?.classList.toggle('flex');
  }

  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='mx-auto flex min-h-screen w-8/12 flex-col items-center justify-center'>
            <div className='title mt-8 mb-12 w-full items-center text-center'>
              <h1 className='text-3xl font-bold'>{family?.name}</h1>
              <h2 className='text-sm font-normal text-emerald-500'>
                Family @{family?._id}
              </h2>
              <p className='mt-2'>All registered member of your family</p>
            </div>
            <div className='flex w-full items-center'>
              {loading ? (
                <div className='loading mx-auto flex items-center justify-center gap-2 text-sm'>
                  <AiOutlineLoading3Quarters
                    size={30}
                    className='animate-spin'
                  />
                  Loading
                </div>
              ) : (
                <div className='mx-auto flex flex-col items-center gap-4'>
                  <button
                    className='mb-8 rounded-md bg-emerald-800 px-4 py-2 font-bold text-white hover:bg-emerald-700'
                    onClick={() => toggleModal()}
                  >
                    Add Member
                  </button>

                  {/* List Member */}
                  <p className='oldest'>{'Oldest : ' + family?.oldestId}</p>
                  <div className='flex flex-col items-center gap-4'>
                    {members.map((member) => (
                      <div
                        key={member._id}
                        className='flex items-center gap-2 rounded-sm bg-emerald-500 px-2 py-1 font-bold text-dark hover:translate-x-1'
                      >
                        <>{member.name}</>

                        <div className='icon ml-4'>
                          {family?.oldestId === member._id ? (
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
                    ))}
                  </div>

                  <MemberAddModal
                    baseApiUrl={props.baseApiUrl}
                    toggleModal={toggleModal}
                    syncMember={getMembers}
                    familyId={famid as string}
                    members={members}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Link href='/families'>
        <BsArrowLeftCircleFill
          size={25}
          className='absolute bottom-5 left-5 hover:translate-x-1'
        />
      </Link>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { origin } = getAbsoluteUrl(context.req);

  const baseApiUrl = `${origin}/api`;

  const { token } = getAppCookies(context.req);
  const profile = token ? await verifyToken(token.split(' ')[1]) : null;

  if (!profile)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: {
      baseApiUrl,
      profile,
      token,
    },
  };
};
