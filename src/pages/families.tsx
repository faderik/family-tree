import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { TFamily } from '@/lib/db/model/Family';

import FamilyAddModal from '@/components/FamilyAddModal';
import FamilyBox from '@/components/FamilyBox';
import FamilyBoxAdd from '@/components/FamilyBoxAdd';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { getAbsoluteUrl, getAppCookies, verifyToken } from '@/middleware/utils';

type FamiliesPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

export default function FamiliesPage(props: FamiliesPageProps) {
  const [families, setFamilies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getFamilies(props.baseApiUrl);
  }, [props]);

  async function getFamilies(baseApiUrl: string) {
    setLoading(true);

    const token = Cookies.get('token') ?? '';
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Authorization', token);

    const res = await fetch(`${baseApiUrl}/family`, {
      method: 'GET',
      headers: reqHeaders,
    });
    const data = await res.json();
    setFamilies(data.data.families);
    setLoading(false);

    return;
  }

  function toggleModal(show?: boolean) {
    if (show === false) {
      document.getElementById('familyAddModal')?.classList.add('hidden');
      document.getElementById('familyAddModal')?.classList.remove('flex');
      return;
    } else if (show === true) {
      document.getElementById('familyAddModal')?.classList.remove('hidden');
      document.getElementById('familyAddModal')?.classList.add('flex');
      return;
    }

    document.getElementById('familyAddModal')?.classList.toggle('hidden');
    document.getElementById('familyAddModal')?.classList.toggle('flex');
  }

  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='mx-auto flex min-h-screen w-8/12 flex-col items-center justify-center'>
            <div className='title mt-8 mb-12 w-full items-center text-center'>
              <h1 className='text-3xl font-bold'>Family List</h1>
              <p className='mt-2'>
                All listed families that you already registered in your account
              </p>
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
                <div className='mx-auto flex flex-wrap items-center gap-4'>
                  <FamilyBoxAdd
                    onClick={() => {
                      toggleModal();
                    }}
                  />
                  {families.map((family: TFamily) => (
                    <FamilyBox
                      key={family._id}
                      family={family}
                      isPublic={Math.random() > 0.5}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Modal */}
            <FamilyAddModal
              toggleModal={toggleModal}
              baseApiUrl={props.baseApiUrl}
              syncFamily={getFamilies}
            />
          </div>
        </section>
      </main>
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
