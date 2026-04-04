import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { UserRoleEnum } from '../enums/use-role.enum';

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

  async create(createCvDto: CreateCvDto, user: User): Promise<Cv> {
    const { skillIds, ...cvPayload } = createCvDto;

    let skills: Skill[] = [];
    if (skillIds?.length) {
      skills = await this.skillRepository.find({ where: { id: In(skillIds) } });
      if (skills.length !== skillIds.length) {
        throw new NotFoundException('One or more skills were not found');
      }
    }

    const cv = this.cvRepository.create({ ...cvPayload });
    cv.user = user;
    cv.skills = skills;
    return await this.cvRepository.save(cv);
  }

  async findAll(user: User): Promise<Cv[]> {
    if (user.role === UserRoleEnum.ADMIN) {
      return await this.cvRepository.find({ withDeleted: false });
    }

    return await this.cvRepository.find({
      where: { user: { id: user.id } },
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Cv> {
    const cv = await this.cvRepository.findOneBy({ id });
    if (!cv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return cv;
  }

  async update(id: number, updateCvDto: UpdateCvDto, user: User): Promise<Cv> {
    const cv = await this.findOne(id);

    if (cv.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own CVs');
    }

    const newCv = await this.cvRepository.preload({ id, ...updateCvDto });
    if (!newCv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    return await this.cvRepository.save(newCv);
  }

  async remove(id: number, user: User): Promise<void> {
    const cv = await this.findOne(id);

    if (cv.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own CVs');
    }

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