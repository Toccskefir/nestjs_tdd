import { Module, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TodoController],
  imports: [PrismaModule],
  providers: [
    TodoService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class TodoModule {}
