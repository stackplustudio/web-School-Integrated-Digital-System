import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PpdbModule } from './ppdb/ppdb.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PpdbModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    SubjectsModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}