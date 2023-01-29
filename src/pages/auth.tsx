import Navbar from '../components/Navbar/navbar.component';

import { AuthRedirect } from '../hooks/auth-user.hook';
import { supabase } from '../utils/supabase.util';

type SignInProvider = 'facebook' | 'google';

export default function IndexPage() {
  AuthRedirect();

  const onSignInButtonClick = async (provider: SignInProvider, e) => {
    await supabase.auth.signIn({ provider });
  };

  return (
    <div className="container mx-auto px-4 py-4 h-screen">
      <Navbar title="Sign in" user={false} />

      <div className="flex flex-col align-center justify-center h-screen">
        <button
          type="button"
          className="btn mb-5"
          onClick={e => onSignInButtonClick('facebook', e)}
        >
          Sign in with Facebook
        </button>

        <button type="button" className="btn mb-5" onClick={e => onSignInButtonClick('google', e)}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
