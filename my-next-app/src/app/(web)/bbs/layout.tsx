import BoardSidebar from "@/app/(web)/bbs/BoardSidebar";
import { ReactNode } from "react";

export default function BbsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-glow flex">
      <BoardSidebar />
      <main className="p-3 min-w-[83%]">{children}</main>
    </div>
  );
}
