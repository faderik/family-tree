import * as React from 'react';

import clsxm from '@/lib/clsxm';

import UnstyledLink, { UnstyledLinkProps } from '@/components/UnstyledLink';

const UnderlineLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'text-green-800 dark:text-green-200',
          'inline-flex items-center font-semibold',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-offset-2',
          'border-b border-green-700 hover:border-blue-300/0 dark:border-green-300',
          className
        )}
      >
        {children}
      </UnstyledLink>
    );
  }
);

export default UnderlineLink;
