import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoDTO, TodoService } from './todo.service';
import { Todo } from './todo.model';

@Controller('/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTodos(): Promise<Todo[]> {
    return this.todoService.getTodos();
  }

  @Get('/:id')
  async getTodo(@Param('id') id: string) {
    return this.todoService.getTodo(id);
  }

  @Post()
  async createTodo(@Body() todoDto: TodoDTO) {
    return this.todoService.createTodo(todoDto);
  }

  @Put('/:id')
  async updateTodo(@Param('id') id: string, @Body() todoDto: TodoDTO) {
    return this.todoService.updateTodo(id, todoDto);
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}
