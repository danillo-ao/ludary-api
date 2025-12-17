import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  @Inject(SupabaseService)
  private readonly supabase: SupabaseService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [, token] = authHeader?.split(' ');
    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const { data, error } = await this.supabase.getClient().auth.getUser(token as string);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = data.user;
    request.authenticated = true;
    return true;
  }
}

@Injectable()
export class SupabaseOptionalAuthGuard implements CanActivate {
  @Inject(SupabaseService)
  private readonly supabase: SupabaseService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    request.user = undefined;
    request.authenticated = false;

    if (authHeader) {
      const [, token] = authHeader?.split(' ');
      if (token) {
        const { data, error } = await this.supabase.getClient().auth.getUser(token as string);
        if (error || !data?.user) {
          return true;
        }

        request.user = data.user;
        request.authenticated = true;
        return true;
      }
    }

    return true;
  }
}
