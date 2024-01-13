import { Body, Controller, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenBodyDto,
  UserIdParamDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async createUser(@Body() body: SignUpDto) {
    return this.authService.createUser(body);
  }

  @Post('/sign-in')
  loginUser(@Body() body: SignInDto) {
    return this.authService.login(body);
  }

  @Post('/refresh-token/:user_id')
  refreshToken(
    @Body() body: RefreshTokenBodyDto,
    @Param() param: UserIdParamDto,
  ) {
    return this.authService.refreshTokens(param.user_id, body.refresh_token);
  }
}
