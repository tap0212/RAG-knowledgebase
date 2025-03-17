import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthCredentialsDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body(ValidationPipe) credentials: AuthCredentialsDto) {
    return this.authService.register(credentials.email, credentials.password);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) credentials: AuthCredentialsDto) {
    return this.authService.login(credentials.email, credentials.password);
  }
}
