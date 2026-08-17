import { Module } from '@nestjs/common';
import { StudentPortalService } from './student-portal.service';
import { StudentPortalController } from './student-portal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentPortalController],
  providers: [StudentPortalService],
})
export class StudentPortalModule {}