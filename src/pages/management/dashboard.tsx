import Head from 'next/head';
import { LightningBoltIcon, SparklesIcon } from '@heroicons/react/outline';
import { User } from '@supabase/supabase-js';

import DashboardStatCard from '../../components/DashboardStatCard/dashboard-stat-card.component';
import Navbar from '../../components/Navbar/navbar.component';

import { supabase } from '../../utils/supabase.util';

interface DashboardPageProps {
  user: User;
  data: any | null; // FIXME: use correct type
  error: any | null; // FIXME: use correct type
}

export default function DashboardPage({ user, data, error }: DashboardPageProps) {
  return (
    <>
      <Head>
        <title>Dashboard | Linknetic</title>
      </Head>

      <div className="container mx-auto px-4 py-4">
        <Navbar title="Dashboard" user={user} />

        <div className="prose mx-auto mt-10">
          <h1>Welcome back!</h1>

          <div className="stats shadow">
            <DashboardStatCard
              title="Total clicks"
              count={data?.total}
              icon={<LightningBoltIcon width={32} />}
            />

            <DashboardStatCard
              title="Links count"
              count={data?.links?.length}
              icon={<SparklesIcon width={32} />}
            />
          </div>

          <h3>Details</h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Total clicks</th>
                </tr>
              </thead>
              <tbody>
                {data?.links.map((link, i) => (
                  <tr key={i}>
                    <td>{link.title}</td>
                    <td>{link.url}</td>
                    <td>{link.total_clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
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

  const response = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
    headers: {
      token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      props: {
        user,
        data: null,
        error: data.error,
      },
    };
  }

  return {
    props: {
      user,
      data,
      error: null,
    },
  };
}
