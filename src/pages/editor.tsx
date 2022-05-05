import { MouseEvent, useState } from 'react';
import Head from 'next/head';
import { PlusIcon } from '@heroicons/react/outline';
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

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export default function EditorPage({ user, data, error }: EditorPageProps) {
  const [linkExternalId, setLinkExternalId] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [titleHasError, setTitleHasError] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');
  const [urlHasError, setUrlHasError] = useState<boolean>(false);

  const [isCreateOrEditLinkModalVisible, setIsCreateOrEditLinkModalVisible] =
    useState<boolean>(false);
  const [isDeleteLinkModalVisible, setIsDeleteLinkModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSaveLinkPress = (event: MouseEvent<HTMLButtonElement>) => {
    if (titleHasError || urlHasError) {
      return;
    }

    const payload = {
      title,
      url,
    };

    alert(JSON.stringify(payload));
  };

  const renderCreateOrEditLinkModal = (): JSX.Element => (
    <Modal
      isVisible={isCreateOrEditLinkModalVisible}
      title={isEditing ? 'Edit link' : 'Add link'}
      buttons={[
        {
          title: 'Close',
          onClick: () => {
            setTitle('');
            setTitleHasError(false);

            setUrl('');
            setUrlHasError(false);

            setIsEditing(false);
            setIsCreateOrEditLinkModalVisible(false);
          },
        },
        { title: 'Save', onClick: onSaveLinkPress, type: 'primary' },
      ]}
    >
      <form>
        <div className="form-control w-full">
          <label className="label">
            <span className={`label-text${titleHasError ? ' text-error' : ''}`}>Title</span>
          </label>

          <input
            type="text"
            className={`input input-bordered w-full${titleHasError ? ' input-error' : ''}`}
            value={title}
            onChange={e => {
              setTitleHasError(false);
              setTitle(e.target.value);

              if (e.target.value.match(/^$/g)) {
                setTitleHasError(true);
              }
            }}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className={`label-text${urlHasError ? ' text-error' : ''}`}>URL</span>
          </label>

          <input
            type="url"
            className={`input input-bordered w-full${urlHasError ? ' input-error' : ''}`}
            value={url}
            onChange={e => {
              setUrlHasError(false);
              setUrl(e.target.value);

              if (!e.target.value.match(urlRegex)) {
                setUrlHasError(true);
              }
            }}
            required
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
        { title: 'No', type: 'secondary', onClick: () => setIsDeleteLinkModalVisible(false) },
        { title: 'Yes', type: 'error', onClick: () => null },
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
                onEditButtonClick={() => {
                  setLinkExternalId(link.external_id);
                  setTitle(link.title);
                  setUrl(link.url);

                  setIsEditing(true);
                  setIsCreateOrEditLinkModalVisible(true);
                }}
                onDeleteButtonClick={() => setIsDeleteLinkModalVisible(true)}
              />
            ))}

            <button
              type="button"
              className="card bg-transparent text-primary-content shadow-xl flex-auto border-4 border-dashed rounded-2xl border-primary cursor-pointer no-underline w-full"
              onClick={() => setIsCreateOrEditLinkModalVisible(true)}
            >
              <div className="card-body p-5 text-center w-full">
                <h3 className="m-0 flex flex-row items-center justify-center">
                  <PlusIcon width={27} className="mr-2" /> Add new link
                </h3>
              </div>
            </button>
          </div>
        </div>
      </div>

      {renderCreateOrEditLinkModal()}
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
