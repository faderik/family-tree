import * as React from 'react';
import {
  BsFillSunFill,
  BsMoonStars,
  BsMoonStarsFill,
  BsSun,
} from 'react-icons/bs';

type SwitchThemeProps = React.ComponentPropsWithoutRef<'div'>;

export default function SwitchTheme({ className }: SwitchThemeProps) {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const switchTheme = () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      setTheme('light');
    } else {
      document.body.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <div className={className}>
      <button onClick={switchTheme}>
        <div className='flex w-fit flex-row justify-center rounded-full border-[0.15rem] border-slate-400 bg-yellow-50 p-0.5 text-center align-middle font-primary text-white dark:border-light dark:bg-slate-800'>
          <div className='flex w-full justify-center rounded-full bg-slate-500 p-1 shadow-md dark:bg-transparent dark:shadow-none'>
            {theme === 'light' ? (
              <BsFillSunFill className='text-sm text-orange-300 dark:text-xs' />
            ) : (
              <BsSun className='text-sm text-light dark:text-xs' />
            )}
          </div>
          <div className='flex w-full justify-center rounded-full bg-transparent p-1 dark:bg-slate-500 dark:shadow-md'>
            {theme === 'dark' ? (
              <BsMoonStarsFill className='text-xs text-orange-300 dark:text-sm' />
            ) : (
              <BsMoonStars className='text-xs text-dark dark:text-sm' />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
