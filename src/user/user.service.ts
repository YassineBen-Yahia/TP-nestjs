import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cv } from '../cv/entities/cv.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.userRepository.manager.transaction(async (manager) => {
      await manager
        .getRepository(Cv)
        .createQueryBuilder()
        .softDelete()
        .where('userId = :id', { id })
        .execute();

      await manager.getRepository(User).softDelete(id);
    });
  }

  async restore(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.manager.transaction(async (manager) => {
      await manager.getRepository(User).restore(user.id);

      await manager
        .getRepository(Cv)
        .createQueryBuilder()
        .restore()
        .where('userId = :id', { id: user.id })
        .execute();
    });

    const restoredUser = await this.userRepository.findOneBy({ id });
    if (!restoredUser) {
      throw new NotFoundException(`Failed to restore user with id ${id}`);
    }
    return restoredUser;
  }
}
