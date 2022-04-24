import { AuthRedirect } from '../hooks/auth-user.hook';
import { supabase } from '../utils/supabase.util';

type SignInProvider = 'facebook' | 'google' | 'twitter';

export default function IndexPage() {
  AuthRedirect();

  const onSignInButtonClick = async (provider: SignInProvider, e) => {
    await supabase.auth.signIn({ provider });
  };

  return (
    <div>
      <h1 className="text-6xl">Auth</h1>

      <button type="button" className="btn" onClick={e => onSignInButtonClick('facebook', e)}>
        Sign in with Facebook
      </button>

      <button type="button" className="btn" onClick={e => onSignInButtonClick('google', e)}>
        Sign in with Google
      </button>

      <button type="button" className="btn" onClick={e => onSignInButtonClick('twitter', e)}>
        Sign in with Twitter
      </button>
    </div>
  );
}
