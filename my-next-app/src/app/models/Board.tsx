export interface BoardData {
  id: number;
  category: string;
  title: string;
  content: string;
  like_count: number;
  views: number;
  created_at: string;
  updated_at: string;
  author: string;
}

export class Board {
  id: number;
  category: string;
  title: string;
  content: string;
  like_count: number;
  views: number;
  created_at: string;
  updated_at: string;
  author: string;

  constructor(data: BoardData) {
    this.id = data.id;
    this.category = data.category;
    this.title = data.title;
    this.content = data.content;
    this.like_count = data.like_count;
    this.views = data.views;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.author = data.author;
  }
}