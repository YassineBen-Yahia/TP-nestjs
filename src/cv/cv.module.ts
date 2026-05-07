import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { AuthModule } from '../auth/auth.module';
import { CvEventsService } from './listeners/cv-events.service';
import { CvEventsListener } from './listeners/cv-events.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, User, Skill]),
    AuthModule                                       
  ],
  controllers: [CvController],
  providers: [CvService, CvEventsService, CvEventsListener],
})
export class CvModule {}