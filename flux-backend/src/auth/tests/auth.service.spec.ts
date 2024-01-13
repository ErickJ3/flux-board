import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/persistence/prisma.service';

const fakeUser = [
  {
    id: '2f4da63c-8d04-4ae2-ace7-d01a320be590',
    email: 'mock@gmail.com',
    password: 'correct_password',
    refresh_token: null,
  },
];

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeUser[0]),
    findMany: jest.fn().mockResolvedValue(fakeUser),
    findUnique: jest.fn().mockResolvedValue(fakeUser[0]),
    update: jest.fn().mockResolvedValue(fakeUser[0]),
    delete: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user object for correct credentials', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const response = await service.validateUser(
        fakeUser[0].email,
        'correct_password',
      );
      expect(response).toEqual({ ...fakeUser[0], password: undefined });
    });

    it('should return null for incorrect password', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      const response = await service.validateUser(
        fakeUser[0].email,
        'wrong_password',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong_password',
        fakeUser[0].password,
      );
      expect(response).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: fakeUser[0].email },
        select: {
          id: true,
          email: true,
          password: true,
          refresh_token: true,
        },
      });
    });
  });

  describe('generateUserCredentials', () => {
    it('should generate user credentials correctly', async () => {
      const mockAccessToken = 'access-token';
      const mockRefreshToken = 'refresh-token';

      jest.spyOn(jwt, 'signAsync').mockResolvedValue(mockAccessToken);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        id: fakeUser[0].id,
        refresh_token: mockRefreshToken,
      } as any);

      const tokens = await service.generateUserCredentials(fakeUser[0]);

      expect(jwt.signAsync).toHaveBeenCalledWith({
        email: fakeUser[0].email,
        sub: fakeUser[0].id,
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: fakeUser[0].id },
        data: {
          id: fakeUser[0].id,
          refresh_token: expect.any(String),
        },
      });

      expect(tokens).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
      });
    });
  });

  describe('logout', () => {
    it('should clear refresh token and return user id', async () => {
      const userId = 'user-id';
      jest
        .spyOn(prisma.user, 'update')
        .mockResolvedValue({ id: userId } as any);

      const result = await service.logout(userId);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refresh_token: null, id: userId },
      });
      expect(result).toBe(userId);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token for a user', async () => {
      const userId = 'user-id';
      const refreshToken = 'new-refresh-token';
      jest
        .spyOn(prisma.user, 'update')
        .mockResolvedValue({ id: userId, refresh_token: refreshToken } as any);

      const result = await service.updateRefreshToken(userId, refreshToken);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refresh_token: refreshToken, id: userId },
      });
      expect(result).toEqual({ id: userId, refresh_token: refreshToken });
    });
  });

  describe('refreshTokens', () => {
    it('should generate new tokens for valid refresh token', async () => {
      const userId = 'user-id';
      const refreshToken = 'valid-refresh-token';
      const user = { id: userId, refresh_token: refreshToken };
      const newTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user as any);
      jest
        .spyOn(service, 'generateUserCredentials')
        .mockResolvedValue(newTokens);

      const tokens = await service.refreshTokens(userId, refreshToken);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(service.generateUserCredentials).toHaveBeenCalledWith(user);
      expect(tokens).toEqual(newTokens);
    });
  });

  describe('createUser', () => {
    it('should create a new user and generate credentials', async () => {
      const signUpData = { email: 'mocker@mocker.com', password: 'mock123' };
      const createdUser = { id: 'new-user-id', email: signUpData.email };
      const newTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser as any);
      jest
        .spyOn(service, 'generateUserCredentials')
        .mockResolvedValue(newTokens);

      const tokens = await service.createUser(signUpData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: signUpData.email },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(service.generateUserCredentials).toHaveBeenCalledWith(createdUser);
      expect(tokens).toEqual(newTokens);
    });
  });

  describe('login', () => {
    it('should validate user and return credentials', async () => {
      const signInData = { email: 'mocker@mocker.com', password: 'mock123' };
      const user = { id: 'user-id', email: signInData.email };
      const credentials = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest
        .spyOn(service, 'generateUserCredentials')
        .mockResolvedValue(credentials);

      const result = await service.login(signInData);

      expect(service.validateUser).toHaveBeenCalledWith(
        signInData.email,
        signInData.password,
      );
      expect(service.generateUserCredentials).toHaveBeenCalledWith(user);
      expect(result).toEqual(credentials);
    });
  });
});
