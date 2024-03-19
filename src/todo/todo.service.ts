import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class TodoDTO {
  @IsNotEmpty()
  @IsString()
  text!: string;
}

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTodos(): Promise<Todo[]> {
    return this.prismaService.todo.findMany();
  }

  async getTodo(id: string): Promise<Todo | null> {
    return this.prismaService.todo.findUnique({
      where: { id },
    });
  }

  async createTodo(input: TodoDTO) {
    return this.prismaService.todo.create({ data: input });
  }

  async updateTodo(id: string, input: TodoDTO) {
    try {
      return await this.prismaService.todo.update({
        where: { id },
        data: input,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  async deleteTodo(id: string) {
    try {
      return await this.prismaService.todo.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        return;
      }
      throw e;
    }
  }
}
