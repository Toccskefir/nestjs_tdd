import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoDTO, TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';

describe('TodoController', () => {
  let controller: TodoController;
  let mockTodoService: TodoService;

  beforeEach(async () => {
    mockTodoService = {} as TodoService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
        PrismaService,
      ],
    }).compile();

    await module.get<PrismaService>(PrismaService).todo.deleteMany();
    controller = module.get<TodoController>(TodoController);
  });

  it('should return the list of todos returned by todoService.getTodos()', async () => {
    mockTodoService.getTodos = async () => {
      return [{ text: 'test' } as Todo];
    };
    const todos = await controller.getTodos(); //act
    expect(todos).toEqual([{ text: 'test' }]);
  });

  it('should return the single todo returned by todoService.getTodo()', async () => {
    mockTodoService.getTodo = async (id: string): Promise<any> => {
      if (id === '42') {
        return { id: '42', text: 'test' };
      }
    }; //arrange
    const todo = await controller.getTodo('42'); //act
    expect(todo).toEqual({ id: '42', text: 'test' });
  });

  it('should return the single todo returned by todoService.createTodo()', async () => {
    mockTodoService.createTodo = async (input: TodoDTO) => ({
      id: '42',
      ...input,
    }); //arrange
    const todo = await controller.createTodo({ text: 'test' }); //act
    expect(todo).toEqual({ id: '42', text: 'test' }); //assert
  });

  it('should return the updated todo returned by todoService.updateTodo()', async () => {
    mockTodoService.updateTodo = async (id: string, input: TodoDTO) => {
      return { id, ...input };
    }; //arrange
    const todo = await controller.updateTodo('42', { text: 'after update' }); //act
    expect(todo).toEqual({ id: '42', text: 'after update' }); //assert
  });

  it('should call todoService.deleteTodo()', () => {
    mockTodoService.deleteTodo = jest.fn(); //arrange
    controller.deleteTodo('42'); //act
    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('42'); //assert
  });
});
