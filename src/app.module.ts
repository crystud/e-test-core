import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: 'eTest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      cache: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
