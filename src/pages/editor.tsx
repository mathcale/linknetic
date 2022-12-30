import { MouseEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/outline';

import LinkCard from '../components/LinkCard/link-card.component';
import Modal from '../components/Modal/modal.component';
import Navbar from '../components/Navbar/navbar.component';

import { supabase } from '../utils/supabase.util';

interface EditorPageProps {
  user: User;
  data: any | null; // FIXME: use correct type
  error: any | null; // FIXME: use correct type
}

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export default function EditorPage({ user, data, error }: EditorPageProps) {
  const [linkExternalId, setLinkExternalId] = useState<string>('');

  const [pageTitle, setPageTitle] = useState<string>(data.page.title || '');
  const [pageTitleHasError, setPageTitleHasError] = useState<boolean>(false);
  const [hasPageTitleChanged, setHasPageTitleChanged] = useState<boolean>(false);

  const [pageDescription, setPageDescription] = useState<string>(data.page.description || '');
  const [hasPageDescriptionChanged, setHasPageDescriptionChanged] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [titleHasError, setTitleHasError] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');
  const [urlHasError, setUrlHasError] = useState<boolean>(false);

  const [isCreateOrEditLinkModalVisible, setIsCreateOrEditLinkModalVisible] =
    useState<boolean>(false);
  const [isDeleteLinkModalVisible, setIsDeleteLinkModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setHasPageTitleChanged(pageTitle !== data.page.title);
    setIsEditing(pageTitle !== data.page.title);
  }, [pageTitle]);

  useEffect(() => {
    setHasPageDescriptionChanged(pageDescription !== data.page.description);
    setIsEditing(pageDescription !== data.page.description);
  }, [pageDescription]);

  const onSavePagePress = async (event: MouseEvent<HTMLButtonElement>): Promise<void | never> => {
    if (pageTitleHasError) {
      return;
    }

    const payload = {
      title: pageTitle,
      description: pageDescription,
    };

    setIsLoading(true);

    try {
      const session = supabase.auth.session();
      const endpoint = isEditing ? `/api/pages/${data.page.external_id}/edit` : '/api/pages/create';

      const response = await fetch(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: session.access_token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(JSON.stringify(responseBody));
      }

      toast.success('Link successfully saved!');

      setIsEditing(false);
      setPageTitleHasError(false);
      setHasPageTitleChanged(false);
      setHasPageDescriptionChanged(false);

      router.replace(router.asPath);
    } catch (err) {
      console.error({ err });
      const parsedError = JSON.parse(err.message);

      if (parsedError.code === 'ALLOWED_LINKS_PER_PAGE_LIMIT_REACHED') {
        toast.error(parsedError.error);
      } else {
        toast.error('There was a problem while saving your link... Please, try again later!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveLinkPress = async (event: MouseEvent<HTMLButtonElement>): Promise<void | never> => {
    if (titleHasError || urlHasError) {
      return;
    }

    const payload = {
      title,
      url,
    };

    setIsLoading(true);

    try {
      const session = supabase.auth.session();
      const endpoint = isEditing ? `/api/links/${linkExternalId}/edit` : '/api/links/create';

      const response = await fetch(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: session.access_token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(JSON.stringify(responseBody));
      }

      toast.success('Link successfully saved!');

      setIsCreateOrEditLinkModalVisible(false);
      setTitle('');
      setUrl('');

      router.replace(router.asPath);
    } catch (err) {
      console.error({ err });
      const parsedError = JSON.parse(err.message);

      if (parsedError.code === 'ALLOWED_LINKS_PER_PAGE_LIMIT_REACHED') {
        toast.error(parsedError.error);
      } else {
        toast.error('There was a problem while saving your link... Please, try again later!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteLinkClick = async (event: MouseEvent<HTMLButtonElement>): Promise<void | never> => {
    if (!linkExternalId) {
      return;
    }

    setIsLoading(true);

    try {
      const session = supabase.auth.session();
      const endpoint = `/api/links/${linkExternalId}/delete`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: session.access_token,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }

      toast.success('Link successfully deleted!');

      setIsDeleteLinkModalVisible(false);
      setLinkExternalId('');

      router.replace(router.asPath);
    } catch (err) {
      console.error({ err });
      toast.error('There was a problem while saving your link... Please, try again later!');
    } finally {
      setIsLoading(false);
    }
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
      isLoading={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
        {
          title: 'No',
          type: 'secondary',
          onClick: () => {
            setLinkExternalId('');
            setIsDeleteLinkModalVisible(false);
          },
        },
        { title: 'Yes', type: 'error', onClick: onDeleteLinkClick },
      ]}
      isLoading={isLoading}
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
            <input
              type="text"
              value={pageTitle}
              maxLength={30}
              onChange={e => {
                setPageTitleHasError(false);
                setPageTitle(e.target.value);

                if (e.target.value.match(/^$/g) || e.target.value.length < 3) {
                  setPageTitleHasError(true);
                }
              }}
              className={`input input-bordered input-ghost w-full max-w mb-5 py-8 text-center text-4xl font-bold${
                pageTitleHasError ? ' input-error' : ''
              }`}
              disabled={isLoading}
              required
            />

            <textarea
              value={pageDescription}
              maxLength={120}
              onChange={e => setPageDescription(e.target.value)}
              className="textarea textarea-bordered textarea-ghost w-full max-w text-center text-lg resize-none"
              disabled={isLoading}
            />

            <AnimatePresence>
              {(hasPageTitleChanged || hasPageDescriptionChanged) && (
                <motion.button
                  onClick={onSavePagePress}
                  className={`btn${isLoading ? ' loading btn-disabled' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Save changes
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="my-12">
            <AnimatePresence>
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
                  onDeleteButtonClick={() => {
                    setLinkExternalId(link.external_id);
                    setIsDeleteLinkModalVisible(true);
                  }}
                />
              ))}
            </AnimatePresence>

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
