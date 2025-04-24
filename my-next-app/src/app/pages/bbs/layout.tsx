import BoardSidebar from "@/app/components/boardSidebar";
import { ReactNode } from "react";

export default function BbsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-glow flex">
      <BoardSidebar />
      <main className="p-3">{children}</main>
    </div>
  );
}
