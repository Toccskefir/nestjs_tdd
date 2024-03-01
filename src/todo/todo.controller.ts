import { Controller } from '@nestjs/common';
import { TodoDTO, TodoService } from './todo.service';
import { Todo } from './todo.model';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  getTodos() {
    return this.todoService.getTodos();
  }

  getTodo(id: string) {
    return this.todoService.getTodo(id);
  }

  createTodo(todoDto: TodoDTO) {
    return this.todoService.createTodo(todoDto);
  }

  updateTodo(id: string, todoDto: TodoDTO) {
    return this.todoService.updateTodo(id, todoDto);
  }
}
