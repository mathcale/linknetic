import { useState } from 'react';
import Head from 'next/head';
import { SaveIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import { User } from '@supabase/supabase-js';

import LinkCard from '../components/LinkCard/link-card.component';
import Navbar from '../components/Navbar/navbar.component';

import { supabase } from '../utils/supabase.util';
import Modal from '../components/Modal/modal.component';

interface EditorPageProps {
  user: User;
  data: any | null; // FIXME: use correct type
  error: any | null; // FIXME: use correct type
}

export default function EditorPage({ user, data, error }: EditorPageProps) {
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedUrl, setEditedUrl] = useState<string>('');

  const [isEditLinkModalVisible, setIsEditLinkModalVisible] = useState<boolean>(false);
  const [isDeleteLinkModalVisible, setIsDeleteLinkModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderEditLinkModal = (): JSX.Element => (
    <Modal
      isVisible={isEditLinkModalVisible}
      title="Edit link"
      buttons={[
        { title: 'Close', onClick: () => setIsEditLinkModalVisible(false) },
        { title: 'Save', onClick: () => null, type: 'primary' },
      ]}
    >
      <form>
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
    </Modal>
  );

  const renderDeleteLinkModal = (): JSX.Element => (
    <Modal
      isVisible={isDeleteLinkModalVisible}
      title="Are you sure?"
      buttons={[
        { title: 'No', onClick: () => setIsDeleteLinkModalVisible(false) },
        { title: 'Yes', onClick: () => null, type: 'danger' },
      ]}
    >
      <p>
        Do you <strong>really</strong> want to delete this item?
      </p>
    </Modal>
  );

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
              <LinkCard
                key={link.external_id}
                link={link}
                editable={true}
                onEditButtonClick={() => setIsEditLinkModalVisible(true)}
                onDeleteButtonClick={() => setIsDeleteLinkModalVisible(true)}
              />
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

      {renderEditLinkModal()}
      {renderDeleteLinkModal()}
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
