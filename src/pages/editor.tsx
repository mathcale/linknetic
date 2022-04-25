import Navbar from '../components/Navbar/navbar.component';

import { supabase } from '../utils/supabase.util';

export default function EditorPage({ user }) {
  return (
    <div className="container mx-auto px-4 py-4">
      <Navbar title="Editor" user={user} />

      <div className="prose mt-5">
        <h1>Editor</h1>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
