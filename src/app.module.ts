import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { CollegesModule } from './colleges/colleges.module'
import { SpecialtiesModule } from './specialties/specialties.module'
import { GroupsModule } from './groups/groups.module'
import { SubjectsModule } from './subjects/subjects.module'
import { StudiesModule } from './studies/studies.module'
import { TestsModule } from './tests/tests.module'
import { TopicsModule } from './topics/topics.module'
import { LevelsModule } from './levels/levels.module'
import { TasksModule } from './tasks/tasks.module'
import { AnswersModule } from './answers/answers.module'
import { PermissionsModule } from './permissions/permissions.module'
import { TicketsModule } from './tickets/tickets.module'
import { AttemptsModule } from './attempts/attempts.module'
import { ResultsModule } from './results/results.module'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'

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
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CollegesModule,
    SpecialtiesModule,
    GroupsModule,
    SubjectsModule,
    StudiesModule,
    TestsModule,
    TopicsModule,
    LevelsModule,
    TasksModule,
    AnswersModule,
    PermissionsModule,
    TicketsModule,
    AttemptsModule,
    ResultsModule,
  ],
})
export class AppModule {}
