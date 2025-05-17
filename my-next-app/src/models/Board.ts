import { AppSymbol } from "../lib/Simbol/AppSymbol";

export interface Board {
  id: number;
  category: string;
  title: string;
  content: string;
  users_id: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  views: number;
}

export interface BoardListOptions {
  category?: string;
  sort?: "newest" | "oldest";
  search?: string;
  searchField?: "title" | "content" | "author";
}


export type BoardListResponse = {
  [AppSymbol.BOARD_LIST_TOTAL_COUNT]: number;
  [AppSymbol.BOARD_LIST]: Board[];
};