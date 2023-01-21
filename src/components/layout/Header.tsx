import * as React from 'react';

import SwitchTheme from '@/components/buttons/SwitchTheme';
import UnstyledLink from '@/components/UnstyledLink';

import Fd45 from '~/svg/Fd45.svg';

const links = [
  { href: '/duadua', label: '2022' },
  { href: '/coming', label: 'About' },
  { href: '/files/Resume-MohammadFaderik.pdf', label: 'Resume' },
];

const welcome = [
  'Welcome;',
  'Selamat Datang;',
  'Bienvenue;',
  'Sugeng Rawuh;',
  '欢迎;',
  'ようこそ;',
  'Bienvenido;',
];

export default function Header() {
  const [welcomeText, setWelcomeText] = React.useState('Welcome');

  React.useEffect(() => {
    let idxChoosen = Math.floor(Math.random() * welcome.length);
    let i = 1;

    setInterval(async () => {
      if (i == -1) {
        idxChoosen = Math.floor(Math.random() * welcome.length);
        i++;
      }
      if (i > welcome[idxChoosen].length) {
        i = -1;
        return;
      }

      const word = welcome[idxChoosen].substring(0, i);
      setWelcomeText(word);
      // document.getElementById('cursorText')?.classList.
      i++;
    }, 300);
  }, []);

  return (
    <header className='absolute top-0 z-50 w-full bg-light hover:drop-shadow-md dark:bg-dark'>
      <div className='layout flex h-14 items-center justify-between text-dark dark:text-light'>
        <UnstyledLink
          href='/'
          className='flex flex-row items-center font-primary font-semibold hover:text-slate-600'
        >
          <Fd45 className='fill-yellow-700 text-xl' />
          <span id='welcome'>{welcomeText}</span>
          <span
            id='cursorText'
            className='ml-[-0.5rem] mb-[1px] h-[2px] w-[0.5rem] animate-blink self-end bg-yellow-600'
          ></span>
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink href={href} className='hover:text-gray-600'>
                  {label}
                </UnstyledLink>
              </li>
            ))}
            <SwitchTheme className='' />
          </ul>
        </nav>
      </div>
    </header>
  );
}
