import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function LoginPage() {
  return (
    <Layout>
      <Seo title='Login Family Tree' />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen flex-col items-center justify-center'>
            <div className='h2 font-bold'>Login</div>
            <div className='continue flex items-center text-base'>
              <form action='/auth/login' method='post'></form>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
