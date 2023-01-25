import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { TFamily } from '@/lib/db/model/Family';

import FamilyBox from '@/components/FamilyBox';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { getAbsoluteUrl, getAppCookies, verifyToken } from '@/middleware/utils';

type FamiliesPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

async function getFamilies(baseApiUrl: string) {
  const token = Cookies.get('token') ?? '';
  const reqHeaders: HeadersInit = new Headers();
  reqHeaders.set('Content-Type', 'application/json');
  reqHeaders.set('Authorization', token);

  const res = await fetch(`${baseApiUrl}/family`, {
    method: 'GET',
    headers: reqHeaders,
  });
  const data = await res.json();

  return data.data.families;
}

export default function FamiliesPage(props: FamiliesPageProps) {
  const [families, setFamilies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getFamilies(props.baseApiUrl).then((families) => {
      setFamilies(families);
      setLoading(false);
    });
  }, [props]);

  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen p-8'>
            {loading ? (
              <div className='loading mx-auto flex items-center justify-center gap-2 text-sm'>
                <AiOutlineLoading3Quarters size={30} className='animate-spin' />
                Loading
              </div>
            ) : (
              families.map((family: TFamily) => (
                <FamilyBox key={family._id} family={family} />
              ))
            )}
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
