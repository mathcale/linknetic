import { User } from '@supabase/supabase-js';

import Navbar from '../../components/Navbar/navbar.component';

import { supabase } from '../../utils/supabase.util';

interface DashboardPageProps {
  user: User;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <Navbar title="Dashboard" user={user} />

      <div className="prose mt-5">
        <p>WIP</p>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

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
