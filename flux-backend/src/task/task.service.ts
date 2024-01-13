import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../common/persistence/prisma.service';
import { AbstractService } from '../common/shared/abstract.service';
import { ExceptionHandler } from '../common/shared/decorators';

@Injectable()
export class TaskService extends AbstractService<Task> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  @ExceptionHandler()
  async create(data: any): Promise<Task> {
    return this.prismaService.task.create({ data });
  }

  @ExceptionHandler()
  list(board_id: string): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: { board_id },
    });
  }

  @ExceptionHandler()
  update(id: string, data: any): Promise<Task> {
    return this.prismaService.task.update({
      where: { id },
      data,
    });
  }

  @ExceptionHandler()
  async delete(id: string): Promise<void> {
    await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }

  @ExceptionHandler()
  async findOne(id: string): Promise<Task> {
    const list = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });

    if (!list) {
      throw new NotFoundException('task not exist!');
    }

    return list;
  }
}
