'use client';

// components

import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  console.log('Test features')
  return <MainLayout>{children}</MainLayout>;
}
