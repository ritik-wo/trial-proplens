"use client";
import React from 'react';
import { AuthRoleProvider } from './AuthRoleProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthRoleProvider>
      {children}
    </AuthRoleProvider>
  );
}
