import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOneBy({ email: dto.email });
    if (exists) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      nickname: dto.nickname,
      department: dto.department || '',
    });
    await this.userRepo.save(user);

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname, department: user.department },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: { id: user.id, email: user.email, nickname: user.nickname, department: user.department },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, nickname: user.nickname, department: user.department };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
