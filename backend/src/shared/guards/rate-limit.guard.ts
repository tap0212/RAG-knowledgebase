import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';

@Injectable()
export class RateLimitGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  private readonly limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  } as Options);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = http.getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = http.getResponse();

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.limiter(request, response, (err: any) => {
        if (err) {
          reject(new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS));
        }
        resolve(true);
      });
    });
  }
}
