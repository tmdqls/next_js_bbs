'use client';

import Link from 'next/link';
import { FaPen, FaHome, FaListAlt } from 'react-icons/fa';

type SidebarLinkProps = {
  href: string;
  label: string;
  iconType: 'pen' | 'home' | 'list';
};

export default function SidebarLink({ href, label, iconType }: SidebarLinkProps) {
  let Icon;

  switch (iconType) {
    case 'home':
      Icon = FaHome;
      break;
    case 'list':
      Icon = FaListAlt;
      break;
    case 'pen':
    default:
      Icon = FaPen;
  }

  return (
    <Link
      href={href}
      className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
    >
      <Icon className="mr-3" />
      {label}
    </Link>
  );
}