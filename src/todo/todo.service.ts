import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.model';

export type TodoDTO = Omit<Todo, 'id'>;

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];
  getTodos(): any {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todos.find((todo) => todo.id === id);
  }

  createTodo(todoDto: TodoDTO) {
    const newTodo: Todo = {
      id: Math.random().toString(),
      ...todoDto,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: string, input: TodoDTO) {
    const todo = this.getTodo(id);
    if (!todo) {
      throw new NotFoundException();
    }
    Object.assign(todo, input);
    return todo;
  }
}
