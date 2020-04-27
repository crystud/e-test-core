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
  ],
})
export class AppModule {}
