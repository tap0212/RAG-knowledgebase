import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { JwtPayload, LoginResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private users: User[] = []; // In production, use a real database

  constructor(private jwtService: JwtService) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async register(email: string, password: string): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password using simple SHA-256 (temporary solution)
    const hashedPassword = this.hashPassword(password);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // Generate JWT
    const payload: JwtPayload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = this.hashPassword(password);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  validateUser(payload: JwtPayload): User | null {
    const user = this.users.find(u => u.id === payload.sub && u.email === payload.email);
    return user || null;
  }
}
