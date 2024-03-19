import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, PrismaService],
    }).compile();

    await module.get<PrismaService>(PrismaService).todo.deleteMany();
    service = module.get<TodoService>(TodoService);
  });

  describe('read', () => {
    it('should return an empty by default', async () => {
      const todos = await service.getTodos(); //act
      expect(todos).toEqual([]); //assert
    });

    it('should return a single todo after create', async () => {
      const createdTodo = await service.createTodo({ text: 'test' }); //arrange
      const todo = await service.getTodo(createdTodo.id); //act
      expect(todo).toEqual({ id: expect.any(String), text: 'test' }); //assert
    });

    it('should return undefined if id is unknown', async () => {
      const todo = await service.getTodo('42'); //act
      expect(todo).toBeNull(); //assert
    });
  });

  describe('create', () => {
    it('should return a single todo after create', async () => {
      await service.createTodo({ text: 'test' }); //act
      expect(await service.getTodos()).toEqual([
        { id: expect.any(String), text: 'test' },
      ]); //assert
    });
  });

  describe('update', () => {
    it('should return the updated todo with getTodo after update', async () => {
      const todo = await service.createTodo({ text: 'test' }); //arrange
      await service.updateTodo(todo.id, { text: 'after update' }); //act
      expect(await service.getTodo(todo.id)).toEqual({
        id: todo.id,
        text: 'after update',
      }); //assert
    });

    it('should return the updated todo after update', async () => {
      const todo = await service.createTodo({ text: 'test' }); //arrange
      const updatedTodo = await service.updateTodo(todo.id, {
        text: 'after update',
      }); //act
      expect(updatedTodo).toEqual({
        id: todo.id,
        text: 'after update',
      }); //assert
    });

    it('should return a NotFoundException after update', async () => {
      await expect(async () => {
        await service.updateTodo('42', { text: 'after update' });
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the existing todo', async () => {
      await service.createTodo({ text: 'a' });
      const todoToDelete = await service.createTodo({ text: 'b' });
      await service.createTodo({ text: 'c' }); //arrange

      await service.deleteTodo(todoToDelete.id); //act

      expect(await service.getTodos()).toEqual([
        { id: expect.any(String), text: 'a' },
        { id: expect.any(String), text: 'c' },
      ]); //assert
    });

    it('should not delete anything if todo does not exist', async () => {
      await service.createTodo({ text: 'test' }); //arrange

      await service.deleteTodo('42'); //act

      expect(await service.getTodos()).toEqual([
        { id: expect.any(String), text: 'test' },
      ]); //assert
    });
  });
});
