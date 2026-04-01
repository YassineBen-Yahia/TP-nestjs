import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private jwtService: JwtService  
    ){}

    async register(userData: RegisterDto) {
        const existing = await this.userRepository.findOne({ where: { username: userData.username } });
        if (existing) throw new ConflictException('Username already taken');
        const hashed = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({ ...userData, password: hashed });
        return await this.userRepository.save(user);
  }

    async login(userCredentials: LoginDto) {
        const user = await this.userRepository.findOne({ where: [{ username: userCredentials.identifier },
            { email: userCredentials.identifier }] });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(userCredentials.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        
        const payload = { sub: user.id, username: user.username, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }



}
