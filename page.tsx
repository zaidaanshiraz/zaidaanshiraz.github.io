'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import DomainRegistrationMain from './_comps/main';

export default function DomainRegistrationPage() {
  return (
    <>
      <Header />
      <DomainRegistrationMain />
      <Footer />
    </>
  );
}
