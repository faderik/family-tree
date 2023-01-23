import * as React from 'react';

import SwitchTheme from '@/components/buttons/SwitchTheme';

export default function Layout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.classList.add('dark');
  }, []);

  return (
    <div className='min-h-screen bg-light font-primary text-dark dark:bg-dark dark:text-light'>
      <SwitchTheme className='absolute bottom-5 right-5' />
      {children}
    </div>
  );
}
