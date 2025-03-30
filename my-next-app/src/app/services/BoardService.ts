import { BoardRepository } from "@/app/repositories/BoardRepository";

export class BoardService {
  static async getAllBoards(page: number) {
    const boards = await BoardRepository.findAll(page);
    return boards;
  }

}