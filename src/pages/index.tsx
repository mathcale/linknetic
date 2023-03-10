import Link from 'next/link';

import AuthUser from '../hooks/auth-user.hook';
import Navbar from '../components/Navbar/navbar.component';

export default function IndexPage() {
  const user = AuthUser();

  return (
    <div className="container mx-auto px-4 py-4">
      <Navbar title="Linknetic" user={user} />

      <div className="prose mx-auto mt-24 text-center">
        <h1 className="text-5xl mb-5" aria-label="main-title">
          Your links in one place!
        </h1>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum magni fuga amet ex quod
          error ullam nostrum blanditiis nemo aut sed recusandae, tenetur dignissimos repellat
          necessitatibus fugit beatae molestias? Animi.
        </p>

        <Link
          href={user ? '/management/dashboard' : '/auth'}
          className="btn btn-md"
          aria-label="start-button"
          passHref
        >
          Start now
        </Link>
      </div>
    </div>
  );
}
