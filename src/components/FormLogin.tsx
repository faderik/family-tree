import React from 'react';
import { RiLoginCircleFill } from 'react-icons/ri';

import { TResponseFormat } from '@/lib/ResponseFormat';

import UnderlineLink from '@/components/UnderlineLink';

type FormLoginProps = {
  onSubmitHandler?: any;
  onChangeHandler?: any;
  stateFormData?: any;
  stateFormError?: any;
  stateFormMessage: TResponseFormat | undefined;
};

export default function FormLogin(props: FormLoginProps) {
  const {
    onSubmitHandler,
    onChangeHandler,
    stateFormData,
    stateFormMessage,
    stateFormError,
  } = props;

  return (
    <form
      className='border- shadow- w-80 rounded-xl bg-emerald-100 px-8 py-12 shadow-lg shadow-emerald-300 dark:bg-emerald-900 dark:shadow-emerald-700'
      method='POST'
      onSubmit={onSubmitHandler}
    >
      <div className=''>
        <div className='title mb-12 flex items-center justify-center text-emerald-800 dark:text-emerald-100'>
          <h2 className='font-handwrite text-5xl font-bold'>login</h2>
          <RiLoginCircleFill size={35} className='ml-2' />
        </div>
        {stateFormMessage?.metadata.status != 200 && (
          <h4 className='warning text-center'>
            {stateFormMessage?.metadata.message}
          </h4>
        )}
      </div>
      <div className='form-group'>
        <label className='form-label' htmlFor='email'>
          Email / Username
        </label>
        <input
          className='form-control'
          type='text'
          id='email'
          name='email'
          placeholder='Email'
          onChange={onChangeHandler}
          value={stateFormData.email.value}
        />
        {stateFormError.email && (
          <span className='warning'>{stateFormError.email.hint}</span>
        )}
      </div>
      <div className='form-group'>
        <label className='form-label' htmlFor='password'>
          Password
        </label>
        <input
          className='form-control'
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          onChange={onChangeHandler}
          value={stateFormData.email.password}
        />
        {stateFormError.password && (
          <span className='warning'>{stateFormError.password.hint}</span>
        )}
      </div>
      <div className='form-group'>
        <p className='my-2 text-sm text-dark dark:text-light'>
          Not have account? Register{' '}
          <UnderlineLink href='/register'>here</UnderlineLink>
        </p>
      </div>
      <button
        type='submit'
        className='mt-2 rounded bg-emerald-800 py-2 px-4 font-bold text-white focus:outline-none dark:bg-emerald-200 dark:text-emerald-800 hover:dark:bg-emerald-300'
      >
        Sign In
      </button>
    </form>
  );
}
