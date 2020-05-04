import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { SpecialtiesModule } from './specialties/specialties.module'
import configuration from './config/configuration'
import { GroupsModule } from './groups/groups.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        cache: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SpecialtiesModule,
    GroupsModule,
  ],
})
export class AppModule {}
