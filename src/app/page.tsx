"use client";
import * as React from 'react';
import { Login2 } from '@/components/blocks/Login2';


export default function Page() {
  return (
    <Login2
      heading="Welcome to Trial AI Assistant"
      logo={{
        url: '/',
        src: '/logos/proplens.png',
        alt: 'Proplens',
        title: 'Trial',
      }}
      buttonText="Sign in"
      signupText=""
    />
  );
}
