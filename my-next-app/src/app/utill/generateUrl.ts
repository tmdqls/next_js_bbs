import { AppSymbol } from "../lib/Simbol/AppSymbol";

export function boardListUrl(
  page: number,
  category: string = "",
  sort: string = "",
  search: string = "",
  searchField: string = ""
): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`${baseUrl}/api/board/getList`);

  const params = new URLSearchParams({
    [AppSymbol.BOARD_PAGE]: page.toString(),
    [AppSymbol.BOARD_CATEGORY]: category,
    [AppSymbol.BOARD_SORT]: sort,
    [AppSymbol.BOARD_SEARCH]: search,
    [AppSymbol.BOARD_SEARCH_FIELD]: searchField,
  });

  url.search = params.toString();

  return url.toString();
}
