import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { SpecialtiesModule } from './specialties/specialties.module'
import configuration from './config/configuration'
import { GroupsModule } from './groups/groups.module'
import { SubjectsModule } from './subject/subjects.module'
import { TopicsModule } from './topics/topics.module'
import { StudentsModule } from './students/students.module'
import { TeachersModule } from './teachers/teachers.module'
import { TestsModule } from './tests/tests.module'
import { AdminsModule } from './admins/admins.module'
import { TasksModule } from './tasks/tasks.module'
import { AnswersModule } from './answers/answers.module'
import { PermissionsModule } from './permissions/permissions.module'
import { TicketsModule } from './tickets/tickets.module'
import { utilities, WinstonModule } from 'nest-winston'
import { AttemptsModule } from './attempts/attempts.module'
import * as winston from 'winston'
import { ScheduleModule } from '@nestjs/schedule'
import { ResultsModule } from './results/results.module'
import { InvitesModule } from './invites/invites.module'
import { MessagesModule } from './messages/messages.module'
import { MessagesGateway } from './messages/messages.gateway'

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
        ],
      }),
    }),
    UsersModule,
    AuthModule,
    SpecialtiesModule,
    GroupsModule,
    SubjectsModule,
    TopicsModule,
    StudentsModule,
    TeachersModule,
    TestsModule,
    AdminsModule,
    TasksModule,
    AnswersModule,
    PermissionsModule,
    TicketsModule,
    AttemptsModule,
    ResultsModule,
    InvitesModule,
    MessagesModule,
  ],
  providers: [MessagesGateway],
})
export class AppModule {}
