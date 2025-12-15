import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const User = createParamDecorator(
  (field: keyof SupabaseUser | undefined, context: ExecutionContext): SupabaseUser | string | undefined => {
    const request = context.switchToHttp().getRequest();
    const user: SupabaseUser | undefined = request.user;

    if (!user) return undefined;
    return field ? (user[field] as string) : user;
  },
);
