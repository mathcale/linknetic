import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '../utils/supabase.util';

type IUserContext = {
  user: User | boolean;
  session: Session | boolean;
};

export const UserContext = createContext<IUserContext>({
  user: false,
  session: false,
});

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }

  return context;
};

export const SignOut = async () => {
  await supabase.auth.signOut();
};

export const RequireAuth = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);
};

export const AuthRedirect = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/management/dashboard');
    }
  }, [user, router]);
};

export const UserContextProvider = props => {
  const [session, setSession] = useState<Session | boolean>(false);
  const [user, setUser] = useState<User | boolean>(false);

  useEffect(() => {
    const session = supabase.auth.session();

    setSession(session);
    setUser(session?.user ?? false);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? false);

      await fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      });
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
  };

  return <UserContext.Provider value={value} {...props} />;
};

const AuthUser = () => {
  const { user } = useUser();
  return user;
};

export default AuthUser;
