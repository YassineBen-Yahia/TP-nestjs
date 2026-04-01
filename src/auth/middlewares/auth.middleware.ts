import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const decoded = verify(token, process.env.SECRET as string) as unknown as { userId: number };

      if (!decoded.userId) throw new UnauthorizedException('Invalid token');

      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

      if (!user) throw new UnauthorizedException('User not found');

      req['user'] = user;
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}