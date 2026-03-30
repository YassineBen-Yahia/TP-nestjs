import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const newSkill = await this.skillRepository.preload({ id, ...updateSkillDto });
    if (!newSkill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return await this.skillRepository.save(newSkill);
  }

  async remove(id: number): Promise<void> {
    const skill = await this.findOne(id);
    await this.skillRepository.softRemove(skill);
  }

  async restore(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    await this.skillRepository.restore(skill.id);
    const restoredSkill = await this.skillRepository.findOneBy({ id });
    if (!restoredSkill) {
      throw new NotFoundException(`Failed to restore skill with id ${id}`);
    }
    return restoredSkill;
  }
}
