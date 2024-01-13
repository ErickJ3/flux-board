import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const userAuth = { email: 'test@example.com', password: 'password123' };
const tokens = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
};
const mockTokens = () => Promise.resolve(tokens);

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      createUser: jest.fn().mockReturnValue(mockTokens()),
      login: jest.fn().mockReturnValue(mockTokens()),
      refreshTokens: jest.fn().mockReturnValue(mockTokens()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    expect(await controller.createUser(userAuth)).toBe(tokens);
    expect(service.createUser).toHaveBeenCalledWith(userAuth);
  });

  it('should login a user', async () => {
    expect(await controller.loginUser(userAuth)).toBe(tokens);
    expect(service.login).toHaveBeenCalledWith(userAuth);
  });

  it('should refresh the token', async () => {
    const refreshTokenDto = { refresh_token: 'refresh-token' };
    const userIdParamDto = { user_id: 'mock-id' };
    expect(await controller.refreshToken(refreshTokenDto, userIdParamDto)).toBe(
      tokens,
    );
    expect(service.refreshTokens).toHaveBeenCalledWith(
      userIdParamDto.user_id,
      refreshTokenDto.refresh_token,
    );
  });
});
