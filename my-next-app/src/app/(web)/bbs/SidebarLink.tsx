"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPen, FaHome, FaListAlt } from "react-icons/fa";

type SidebarLinkProps = {
  href: string;
  label: string;
  iconType: "pen" | "home" | "list";
};

export default function SidebarLink({
  href,
  label,
  iconType,
}: SidebarLinkProps) {
  const pathname = usePathname();
  
  const pathSplit = pathname.split("/");
  const propPathSplit = href.split("/");
  
  const categoryName = pathSplit[3];
  const propCategoryName = propPathSplit[3];
  
  const isActive = categoryName === propCategoryName;

  let Icon;

  switch (iconType) {
    case "home":
      Icon = FaHome;
      break;
    case "list":
      Icon = FaListAlt;
      break;
    case "pen":
    default:
      Icon = FaPen;
  }

  return (
    <Link
      href={href}
      className={`flex items-center text-lg font-medium p-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-400 text-black'
      }`}
    >
      <Icon className="mr-3" />
      {label}
    </Link>
  );
}
