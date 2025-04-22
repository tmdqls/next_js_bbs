import Sidebar from "@/app/components/sidebar";
import { ReactNode } from "react";

export default function BbsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-2">{children}</main>
    </div>
  );
}
