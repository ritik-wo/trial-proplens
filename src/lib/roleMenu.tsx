import * as React from 'react';
import { FolderOpenIcon, FileTextIcon, UsersIcon, UserIcon } from '@/assets/icon-svg';
import { Target, Rocket } from 'lucide-react';
import type { UserRole } from '@/components/providers/AuthRoleProvider';

export type MenuItem = { href: string; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };
export type MenuSection = { id: string; title: string; items: MenuItem[] };

const conversation: MenuSection = {
  id: 'conversation',
  title: 'Conversation Panel',
  items: [
    { href: '/ask-buddy', label: 'Ask Buddy', Icon: UserIcon },
    { href: '/market-transaction', label: 'Transaction Data', Icon: UserIcon },
    { href: '/personalize-pitches', label: 'Personalize Pitches', Icon: UsersIcon },
    { href: '/ask-buddy', label: 'Chat History', Icon: FolderOpenIcon },
  ] as MenuItem[],
};

const salesAdmin: MenuSection = {
  id: 'sales-admin',
  title: 'Sales Admin Panel',
  items: [
    { href: '/our-projects', label: 'Our projects', Icon: FolderOpenIcon },
    { href: '/sop-policies', label: 'SOP & Policies', Icon: FileTextIcon },
    { href: '/stakeholders', label: 'Stakeholder Identification', Icon: UsersIcon },
    { href: '/competition', label: 'Competition', Icon: Target },
    { href: '/new-launches', label: 'New Launches', Icon: Rocket },
  ] as MenuItem[],
};

export function getSectionsForRole(role: UserRole): MenuSection[] {
  // Testing: expose Sales Admin + Conversation sections for all roles
  return [salesAdmin, conversation];
}
