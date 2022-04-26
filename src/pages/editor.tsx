import { useState } from 'react';
import Head from 'next/head';
import { SaveIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import { User } from '@supabase/supabase-js';

import LinkCard from '../components/LinkCard/link-card.component';
import Navbar from '../components/Navbar/navbar.component';

import { supabase } from '../utils/supabase.util';

interface EditorPageProps {
  user: User;
  data: any | null; // FIXME: use correct type
  error: any | null; // FIXME: use correct type
}

export default function EditorPage({ user, data, error }: EditorPageProps) {
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedUrl, setEditedUrl] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
              <LinkCard link={link} editable={true} key={link.external_id} />
            ))}

            <div className="card bg-transparent text-primary-content shadow-xl flex-auto border-4 border-dashed rounded-2xl border-primary cursor-pointer">
              <div className="card-body p-5 text-center">
                <h3 className="m-0 flex flex-row items-center justify-center">
                  <PlusIcon width={27} className="mr-2" /> Add new link
                </h3>
              </div>
            </div>
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

              <input
                type="text"
                className="input input-bordered w-full"
                onChange={e => setEditedTitle(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">URL</span>
              </label>

              <input
                type="url"
                className="input input-bordered w-full"
                onChange={e => setEditedUrl(e.target.value)}
              />
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
