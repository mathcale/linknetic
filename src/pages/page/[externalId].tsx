import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';

import type { GetServerSideProps } from 'next/types';

import LinkCard from '../../components/LinkCard/link-card.component';
import ShareButton from '../../components/ShareButton/share-button.component';

interface UserLinksPageProps {
  data: any | null; // FIXME: use correct type
  error: any | null; // FIXME: use correct type
  baseUrl: string;
  externalId: string;
}

export default function UserLinksPage({ data, baseUrl, externalId, error }: UserLinksPageProps) {
  return (
    <>
      <Head>
        <title>{data.page.title} | Linknetic</title>
      </Head>

      <div className="mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-5xl mb-5">{data.page.title}</h1>
            <h3 className="text-xl mb-5">{data.page.description}</h3>
          </div>

          <div className="my-12">
            <AnimatePresence>
              {data.links.map((link, i) => (
                <LinkCard key={i} link={link} editable={false} clickable={true} animated={true} />
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <p className="text-sm">Powered by Linknetic</p>
          </div>
        </div>
      </div>

      {data.page && <ShareButton url={`${baseUrl}/page/${externalId}`} />}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await fetch(`${process.env.BASE_URL}/api/pages/${params.externalId}`);
  const data = await response.json();

  if (!response.ok) {
    return {
      props: {
        error: data.error,
        data: null,
        baseUrl: process.env.BASE_URL,
        externalId: params.externalId,
      },
    };
  }

  return {
    props: {
      data,
      baseUrl: process.env.BASE_URL,
      externalId: params.externalId,
      error: null,
    },
  };
};
