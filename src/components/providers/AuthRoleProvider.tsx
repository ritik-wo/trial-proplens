"use client";
import React from 'react';

export type UserRole = 'sales-user' | 'sales-admin' | null;

const RoleContext = React.createContext<{
  role: UserRole;
  setRole: (r: UserRole) => void;
}>({ role: null, setRole: () => {} });

export function AuthRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<UserRole>(null);
  const value = React.useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useAuthRole(){ return React.useContext(RoleContext); }

export function mapEmailToRole(email: string): UserRole {
  const e = (email || '').toLowerCase().trim();
  if (e === 'sales@gmail.com') return 'sales-user';
  if (e === 'sales@admin.com') return 'sales-admin';
  return 'sales-user';
}
