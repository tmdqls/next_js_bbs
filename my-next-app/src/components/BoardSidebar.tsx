import SidebarLink from "@/components/SidebarLink";

export default function BoardSidebar() {
  return (
    <nav className="w-64 h-full text-black p-6 flex flex-col space-y-6 mt-24">
      <ul className="space-y-4">
        <li　className="mb-14">
          <SidebarLink href="/bbs/create" label="掲示板作成" iconType="pen" />
        </li>
        <li>
          <SidebarLink href="/bbs/board" label="ホーム" iconType="home" />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/category/1"
            label="カテゴリ１"
            iconType="list"
          />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/category/1"
            label="カテゴリ２"
            iconType="list"
          />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/category/1"
            label="カテゴリ３"
            iconType="list"
          />
        </li>
      </ul>
    </nav>
  );
}
