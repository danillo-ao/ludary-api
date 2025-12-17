import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type ReqUser = SupabaseUser | undefined;

export const User = createParamDecorator((field: keyof ReqUser, context: ExecutionContext): ReqUser | string => {
  const request = context.switchToHttp().getRequest();
  const user: ReqUser = request.user;

  if (!user) return undefined;
  return field ? (user[field] as string) : user;
});
