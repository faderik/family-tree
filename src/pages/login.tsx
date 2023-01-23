/* eslint-disable no-console */
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import { TResponseFormat } from '@/lib/ResponseFormat';

import FormLogin from '@/components/FormLogin';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { getAbsoluteUrl, getAppCookies, verifyToken } from '@/middleware/utils';

type LoginPageProps = {
  baseApiUrl: string;
  profile?: { [key: string]: string };
};

type TFormLogin = {
  [key: string]: {
    value: string;
  };
};

const FORM_DATA_LOGIN = {
  email: {
    value: '',
  },
  password: {
    value: '',
  },
};

export default function LoginPage(props: LoginPageProps) {
  const { baseApiUrl } = props;
  const [loading, setLoading] = useState(false);
  const [stateFormData, setStateFormData] =
    useState<TFormLogin>(FORM_DATA_LOGIN);
  const [stateFormMessage, setStateFormMessage] = useState<TResponseFormat>();
  const [stateFormError, setStateFormError] = useState({});

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;

    setStateFormData({
      ...stateFormData,
      [name]: {
        ...stateFormData[name],
        value,
      },
    });

    // TODO: frontend validation
    // validationHandler(stateFormData, e);
    setStateFormError({});
  }

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // TODO: validationHandler(stateFormData);
    const isValid = true;
    const reqBody = {
      email: stateFormData.email.value ?? '',
      password: stateFormData.password.value ?? '',
    };

    if (isValid) {
      setLoading(!loading);
      const loginApi = await fetch(`${baseApiUrl}/auth`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      }).catch((error) => {
        // TODO: error handler
        console.error('Error:', error);
      });

      const result: TResponseFormat = await loginApi?.json();
      if (result.metadata.status == 200) {
        Cookies.set('token', result.data.token);
        Router.push('/');
      } else {
        setStateFormMessage(result);
      }
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Seo title='Login Family Tree' />

      <main className=''>
        <section className='content'>
          <div className='flex min-h-screen flex-col items-center justify-center'>
            <FormLogin
              onSubmitHandler={onSubmitHandler}
              onChangeHandler={onChangeHandler}
              stateFormData={stateFormData}
              stateFormMessage={stateFormMessage}
              stateFormError={stateFormError}
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
  const profile = token ? verifyToken(token.split(' ')[1]) : '';

  if (profile) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      baseApiUrl,
      profile,
    },
  };
};
