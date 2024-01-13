import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '@prisma/client';
import { PrismaService } from '../common/persistence/prisma.service';
import { AbstractService } from '../common/shared/abstract.service';
import { ExceptionHandler } from '../common/shared/decorators/exception.decorator';

@Injectable()
export class BoardService extends AbstractService<Board> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  @ExceptionHandler()
  async create(data: any): Promise<Board> {
    return this.prismaService.board.create({ data });
  }

  @ExceptionHandler()
  async list(user_id: string): Promise<Board[]> {
    return this.prismaService.board.findMany({
      where: {
        user_id,
      },
    });
  }

  @ExceptionHandler()
  async update(id: string, data: any, user_id: string): Promise<Board> {
    await this.findOne(id, user_id);
    return this.prismaService.board.update({
      where: { id, user_id },
      data,
    });
  }

  @ExceptionHandler()
  async delete(id: string, user_id: string): Promise<void> {
    await this.findOne(id, user_id);
    await this.prismaService.board.delete({
      where: {
        id,
        user_id,
      },
    });
  }

  @ExceptionHandler()
  async findOne(id: string, user_id: string): Promise<Board> {
    const board = await this.prismaService.board.findUnique({
      where: {
        id,
        user_id,
      },
    });

    if (!board) {
      throw new NotFoundException('board not exist!');
    }

    return board;
  }
}
