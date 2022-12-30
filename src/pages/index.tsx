import Link from 'next/link';

import Navbar from '../components/Navbar/navbar.component';
import AuthUser from '../hooks/auth-user.hook';

import { supabase } from '../utils/supabase.util';

export default function IndexPage() {
  const user = AuthUser();

  return (
    <div className="container mx-auto px-4 py-4">
      <Navbar title="Linknetic" user={user} />

      <div className="prose mt-10">
        <h1 className="text-5xl mb-5">Cool title here</h1>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum magni fuga amet ex quod
          error ullam nostrum blanditiis nemo aut sed recusandae, tenetur dignissimos repellat
          necessitatibus fugit beatae molestias? Animi.
        </p>

        <Link href={user ? '/dashboard' : '/auth'} passHref>
          <a className="btn btn-md">Start now</a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  return {
    props: {
      user,
    },
  };
}
