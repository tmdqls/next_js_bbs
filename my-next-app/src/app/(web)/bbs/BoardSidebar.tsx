import SidebarLink from "@/app/(web)/bbs/SidebarLink";

export default function BoardSidebar() {
  return (
    <nav className="w-64 h-full text-black p-6 flex flex-col space-y-6 mt-24">
      <ul className="space-y-4">
        <li　className="mb-14">
          <SidebarLink href="/bbs/create" label="掲示板作成" iconType="pen" />
        </li>
        <li>
          <SidebarLink href="/bbs/board/Home/1" label="Home" iconType="home" />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/Technology/1"
            label="Technology"
            iconType="list"
          />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/Lifestyle/1"
            label="Lifestyle"
            iconType="list"
          />
        </li>
        <li>
          <SidebarLink
            href="/bbs/board/Business/1"
            label="Business"
            iconType="list"
          />
        </li>
                <li>
          <SidebarLink
            href="/bbs/board/Entertainment/1"
            label="Entertainment"
            iconType="list"
          />
        </li>
                <li>
          <SidebarLink
            href="/bbs/board/Sports/1"
            label="Sports"
            iconType="list"
          />
        </li>
      </ul>
    </nav>
  );
}
