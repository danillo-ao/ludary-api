import { User } from '@supabase/supabase-js';

declare global {
  interface Request {
    user?: User;
    authenticated?: boolean;
  }

  namespace Express {
    interface Request {
      user?: User;
      authenticated?: boolean;
    }
  }
}
