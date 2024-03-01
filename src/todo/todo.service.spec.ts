import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  describe('read', () => {
    it('should return an empty by default', () => {
      const todos = service.getTodos(); //act
      expect(todos).toEqual([]); //assert
    });

    it('should return a single todo after create', () => {
      const createdTodo = service.createTodo({ text: 'test' }); //arrange
      const todo = service.getTodo(createdTodo.id); //act
      expect(todo).toEqual({ id: expect.any(String), text: 'test' }); //assert
    });

    it('should return undefined if id is unknown', () => {
      const todo = service.getTodo('42'); //act
      expect(todo).toBeUndefined(); //assert
    });
  });

  describe('create', () => {
    it('should return a single todo after create', () => {
      service.createTodo({ text: 'test' }); //act
      expect(service.getTodos()).toEqual([
        { id: expect.any(String), text: 'test' },
      ]); //assert
    });
  });

  describe('update', () => {
    it('should return the updated todo with getTodo after update', () => {
      const todo = service.createTodo({ text: 'test' }); //arrange
      service.updateTodo(todo.id, { text: 'after update' }); //act
      expect(service.getTodo(todo.id)).toEqual({
        id: todo.id,
        text: 'after update',
      }); //assert
    });

    it('should return the updated todo after update', () => {
      const todo = service.createTodo({ text: 'test' }); //arrange
      const updatedTodo = service.updateTodo(todo.id, { text: 'after update' }); //act
      expect(updatedTodo).toEqual({
        id: todo.id,
        text: 'after update',
      }); //assert
    });

    it('should return a NotFoundException after update', () => {
      expect(() => {
        service.updateTodo('42', { text: 'after update' });
      }).toThrow(NotFoundException);
    });
  });
});
