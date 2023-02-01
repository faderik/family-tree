/* eslint-disable react-hooks/exhaustive-deps */
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsArrowLeftCircleFill } from 'react-icons/bs';

import { TFamily } from '@/lib/db/model/Family';

import Layout from '@/components/layout/Layout';
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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getFamily(props.baseApiUrl);
  }, []);

  async function getFamily(baseApiUrl: string) {
    setLoading(true);

    const token = Cookies.get('token') ?? '';
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Authorization', token);

    const res = await fetch(`${baseApiUrl}/family/${famid}`, {
      method: 'GET',
      headers: reqHeaders,
    });
    const data = await res.json();
    setFamily(data.data.family);
    setLoading(false);

    return;
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
                <div className='mx-auto flex flex-wrap items-center gap-4'></div>
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
