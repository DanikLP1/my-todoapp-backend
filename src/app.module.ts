import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './common/guards';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AtGuard
    }
  ]
})
export class AppModule {}
