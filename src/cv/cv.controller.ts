import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCvDto: CreateCvDto, @Request() req): Promise<Cv> {
    return await this.cvService.create(createCvDto, req['user']);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req): Promise<Cv[]> {
    return await this.cvService.findAll(req['user']);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cv> {
    return await this.cvService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @Request() req,
  ): Promise<Cv> {
    return await this.cvService.update(+id, updateCvDto, req['user']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return await this.cvService.remove(+id, req['user']);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<Cv> {
    return await this.cvService.restore(+id);
  }
}