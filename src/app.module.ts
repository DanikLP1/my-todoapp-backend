import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './common/guards';
import { UsersModule } from './users/users.module';
import { TodolistsModule } from './todolists/todolists.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TodolistsModule, TasksModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AtGuard
    }
  ]
})
export class AppModule {}
