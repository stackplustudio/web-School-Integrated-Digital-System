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
import { SchedulesModule } from './schedules/schedules.module';
import { LmsModule } from './lms/lms.module';
import { StudentPortalModule } from './student-portal/student-portal.module';
import { AttendancesModule } from './attendances/attendances.module';
import { GradesModule } from './grades/grades.module';
import { DashboardStatsModule } from './dashboard-stats/dashboard-stats.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';
import { FinanceModule } from './finance/finance.module';

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
    SchedulesModule,
    LmsModule,
    StudentPortalModule,
    AttendancesModule,
    GradesModule,
    DashboardStatsModule,
    LeaveRequestsModule,
    FinanceModule,
  ],
})
export class AppModule {}