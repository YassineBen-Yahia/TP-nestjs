import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const { userId, skillIds, ...cvPayload } = createCvDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    let skills: Skill[] = [];
    if (skillIds?.length) {
      skills = await this.skillRepository.find({ where: { id: In(skillIds) } });
      if (skills.length !== skillIds.length) {
        throw new NotFoundException('One or more skills were not found');
      }
    }

    const cv = this.cvRepository.create({
      ...cvPayload,
      cin: cvPayload.cin,
    });
    cv.user = user;
    cv.skills = skills;
    return await this.cvRepository.save(cv);
  }
 
  async findAll(): Promise<Cv[]> {
    return await this.cvRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOneBy({ id });
    if (!cv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const newCv = await this.cvRepository.preload({ id, ...updateCvDto });
    if (!newCv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return await this.cvRepository.save(newCv);
  }

  async remove(id: number): Promise<void> {
    const cv = await this.findOne(id);
    await this.cvRepository.softRemove(cv);
  }

  async restore(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!cv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    await this.cvRepository.restore(cv.id);
    const restoredCv = await this.cvRepository.findOneBy({ id });
    if (!restoredCv) {
      throw new NotFoundException(`Failed to restore CV with id ${id}`);
    }
    return restoredCv;
  }
}
