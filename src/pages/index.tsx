import * as React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { GiPineTree } from 'react-icons/gi';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import UnderlineLink from '@/components/UnderlineLink';

export default function IndexPage() {
  return (
    <Layout>
      <Seo />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen flex-col items-center justify-center'>
            <div className='title flex items-center'>
              <GiPineTree
                size={45}
                className='text-green-900 drop-shadow-[2px_2px_3px_rgba(20,83,45.4)] hover:animate-blink'
              />
              <div className='h2 font-bold'>Welcome, It&apos;s Family Tree</div>
            </div>
            <div className='continue flex items-center text-base'>
              <p>
                <UnderlineLink href='/login' className=''>
                  Login
                </UnderlineLink>{' '}
                to Continue
              </p>
              <BsArrowRight className='ml-2 font-bold text-green-800 hover:animate-blink dark:text-green-200' />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
