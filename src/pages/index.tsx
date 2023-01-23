import { GetServerSideProps } from 'next';
import * as React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { GiPineTree } from 'react-icons/gi';
import { RiLogoutCircleLine } from 'react-icons/ri';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import UnderlineLink from '@/components/UnderlineLink';

import {
  getAbsoluteUrl,
  getAppCookies,
  setLogout,
  verifyToken,
} from '@/middleware/utils';

type IndexPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

async function handleOnClickLogout(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  setLogout();
}

export default function IndexPage(props: IndexPageProps) {
  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen flex-col items-center justify-center'>
            <div className='title flex items-center'>
              <GiPineTree
                size={45}
                className='text-emerald-900 drop-shadow-[2px_2px_3px_rgba(20,83,45.4)] hover:animate-blink'
              />
              <div className='h2 font-bold'>Welcome, It&apos;s Family Tree</div>
            </div>
            <div className='continue mt-2 flex items-center text-base'>
              {!props.profile ? (
                <p>
                  <UnderlineLink href='/login' className=''>
                    Login
                  </UnderlineLink>{' '}
                  to Continue
                </p>
              ) : (
                <div className='flex gap-2'>
                  <a
                    href='#'
                    className='flex items-center font-bold text-emerald-800 dark:text-emerald-200'
                    onClick={(e) => handleOnClickLogout(e)}
                  >
                    <RiLogoutCircleLine className='mr-2' />
                    <p className='border-b border-emerald-700 hover:border-blue-300/0 dark:border-emerald-300'>
                      Logout
                    </p>
                  </a>
                  |
                  <UnderlineLink href='/about' className='font-normal'>
                    Continue as{' '}
                    <p className='ml-1 font-bold text-emerald-600'>
                      {' '}
                      {props.profile.name}
                    </p>
                  </UnderlineLink>
                </div>
              )}
              <BsArrowRight className='ml-2 font-bold text-emerald-800 hover:animate-blink dark:text-emerald-200' />
            </div>
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
  console.log('TOKEN: ', token);
  const profile = token ? await verifyToken(token.split(' ')[1]) : null;

  return {
    props: {
      baseApiUrl,
      profile,
    },
  };
};
