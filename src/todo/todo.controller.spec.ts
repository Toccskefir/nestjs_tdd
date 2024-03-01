import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoDTO, TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const mockTodoService = {
      getTodo: (id: string) => {
        if (id === '42') {
          return { text: 'test' };
        }
      },
      getTodos: () => [{ text: 'test' }],
      createTodo: (todoDto: TodoDTO) => ({ id: '42', ...todoDto }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should return the list of todos returned by todoService.getTodos()', () => {
    const todos = controller.getTodos(); //act
    expect(todos).toEqual([{ text: 'test' }]);
  });

  it('should return the single todo returned by todoService.getTodo()', () => {
    const todo = controller.getTodo('42'); //act
    expect(todo).toEqual({ text: 'test' });
  });

  it('should return the single todo returned by todoService.createTodo()', () => {
    const todo = controller.createTodo({ text: 'test' });
    expect(todo).toEqual({ id: '42', text: 'test' });
  });

  it('should return the updated todo returned by todoService.updateTodo()', () => {
    const todo = controller.createTodo({ text: 'test' }); //arrange
    controller.updateTodo(todo.id, { text: 'after update' }); //act
    expect(controller.getTodo(todo.id)).toEqual({
      id: todo.id,
      text: 'after update',
    });
  });
});
