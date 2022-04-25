import Head from 'next/head';
import { PencilIcon, SaveIcon, TrashIcon, XIcon } from '@heroicons/react/outline';

import Navbar from '../components/Navbar/navbar.component';

import { supabase } from '../utils/supabase.util';

export default function EditorPage({ user, data }) {
  return (
    <>
      <Head>
        <title>Editor | Linknetic</title>
      </Head>

      <div className="container mx-auto px-4 py-4">
        <Navbar title="Editor" user={user} />

        <div className="prose mx-auto mt-10">
          <div className="text-center">
            <h1 className="mb-0">{data.page.title}</h1>
            {data.page.description && <p className="my-0">{data.page.description}</p>}
          </div>

          <div className="my-12">
            {data.links.map(link => (
              <div className="flex flex-row items-center mb-4" key={link.external_id}>
                <div className="card bg-primary text-primary-content shadow-xl flex-auto">
                  <div className="card-body p-5 text-center">
                    <p className="m-0">{link.title}</p>
                  </div>
                </div>

                <a href="#editLinkModal" className="btn btn-circle ml-3">
                  <PencilIcon width={18} />
                </a>

                <a href="#deleteLinkModal" className="btn btn-error btn-circle bg-danger ml-3">
                  <TrashIcon width={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="modal" id="editLinkModal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit link</h3>

          <form className="py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
              </label>

              <input type="text" className="input input-bordered w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">URL</span>
              </label>

              <input type="url" className="input input-bordered w-full" />
            </div>
          </form>

          <div className="modal-action">
            <a href="#" className="btn">
              <XIcon width={16} className="mr-1" /> Close
            </a>

            <button className="btn btn-primary">
              <SaveIcon width={16} className="mr-2" /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="modal" id="deleteLinkModal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">WIP</p>

          <div className="modal-action">
            <a href="#" className="btn">
              No
            </a>

            <button className="btn btn-error bg-danger">Yes</button>
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

  const response = await fetch(`${process.env.BASE_URL}/api/pages`, {
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
