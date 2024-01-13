import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../common/persistence/prisma.service';
import { User } from '@prisma/client';
import { Tokens } from './interfaces/tokens.interface';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/sigin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        refresh_token: true,
        password: true,
      },
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  async generateUserCredentials(user: Partial<any>): Promise<Tokens> {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user.id,
    };

    const access_token = await this.jwtTokenService.signAsync(payload);

    const updated = await this.updateRefreshToken(user.id, randomUUID());

    return {
      access_token,
      refresh_token: updated.refresh_token as string,
    };
  }

  async logout(userId: string): Promise<string> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        refresh_token: null,
        id: userId,
      },
    });
    return user.id;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<Partial<any>> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken, id: userId },
    });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('access denied');
    }

    if (user.refresh_token != refreshToken)
      throw new ForbiddenException('access denied');

    const tokens = await this.generateUserCredentials(user);

    return tokens;
  }

  async createUser(data: SignUpDto) {
    const user_exist = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!!user_exist) {
      const error = new ConflictException(`user ${data.email} exists`);
      throw error;
    }

    const password_hash = bcrypt.hashSync(data.password, Math.random() * 10);

    data.password = password_hash;

    const user_created = await this.prismaService.user.create({
      data,
      select: {
        id: true,
        email: true,
      },
    });

    return this.generateUserCredentials(user_created);
  }

  async login(data: SignInDto) {
    const user: Partial<User> = await this.validateUser(
      data.email,
      data.password,
    );

    if (!user) {
      throw new BadRequestException(`email or password are invalid`);
    }

    const credentials = await this.generateUserCredentials(user);

    return credentials;
  }
}
