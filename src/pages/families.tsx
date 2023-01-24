import { GetServerSideProps } from 'next';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { getAbsoluteUrl, getAppCookies, verifyToken } from '@/middleware/utils';

type FamiliesPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

async function getFamilies(baseApiUrl: string) {
  const res = await fetch(`${baseApiUrl}/family`);
  const data = await res.json();

  return data.data.families;
}

export default function FamiliesPage(props: FamiliesPageProps) {
  const [families, setFamilies] = React.useState([]);

  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen flex-col items-center justify-center'></div>
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
