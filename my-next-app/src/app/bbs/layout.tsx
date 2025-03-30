import Sidebar from "@/app/components/sidebar";
import { ReactNode } from "react";

export default function BbsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
