import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CvEventsService } from './listeners/cv-events.service';
import { UserRoleEnum } from '../enums/use-role.enum';
import { APP_EVENTS } from './config/events.config';

@Controller('cv')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cvEvents: CvEventsService,
  ) {}

  @Post()
  async create(
    @Body() createCvDto: CreateCvDto,
    @Request() req,
  ): Promise<Cv> {
    return await this.cvService.create(createCvDto, req['user']);
  }

  @Get()
  async findAll(@Request() req): Promise<Cv[]> {
    return await this.cvService.findAll(req['user']);
  }

  @Get('events/history')
  async history(@Request() req) {
    const user = req['user'];

    if (user.role === UserRoleEnum.ADMIN) {
      return this.cvEvents.getHistory();
    }

    return this.cvEvents.getHistoryForUser(user.id);
  }

  @Sse('events/stream')
  stream(@Request() req): Observable<MessageEvent> {
    const user = req['user'];

    return this.cvEvents.events$.pipe(
      filter((event) =>
        user.role === UserRoleEnum.ADMIN ? true : event.userId === user.id,
      ),
      map((event) => ({ data: event, type: event.type ?? APP_EVENTS.addedCv }) as MessageEvent),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Cv> {
    return await this.cvService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @Request() req,
  ): Promise<Cv> {
    return await this.cvService.update(+id, updateCvDto, req['user']);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return await this.cvService.remove(+id, req['user']);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string, @Request() req): Promise<Cv> {
    return await this.cvService.restore(+id);
  }
}