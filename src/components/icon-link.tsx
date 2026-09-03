import Link from 'next/link';
import type { ReactNode } from 'react';

export function IconLink({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded text-torat-moshe-gray hover:bg-torat-moshe-gray/10 hover:text-torat-moshe-navy"
    >
      {children}
    </Link>
  );
}
