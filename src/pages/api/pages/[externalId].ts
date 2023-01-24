import { NextApiRequest, NextApiResponse } from 'next';

import { Link } from '../../../services/links/link.model';
import { Page } from '../../../services/pages/page.model';

import { supabase } from '../../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { data: page, error: getPageError } = await supabase
    .from<Page>('pages')
    .select(
      `
      id,
      title,
      description,
      image_url,
      banner_url,
      background_color
      `
    )
    .eq('external_id', req.query.externalId as string)
    .is('deleted_at', null)
    .limit(1);

  if (getPageError) {
    console.error({ getPageError });
    return res.status(500).json({ error: getPageError });
  }

  if (page.length === 0) {
    return res.status(200).json({
      page: null,
      links: [],
    });
  }

  const { data: links, error: getLinksError } = await supabase
    .from<Link>('links')
    .select(
      `
      title,
      url,
      index
  `
    )
    .eq('page_id', page[0].id)
    .is('deleted_at', null)
    .order('index', { ascending: true });

  if (getLinksError) {
    console.error({ getLinksError });
    return res.status(500).json({ error: getLinksError });
  }

  delete page[0].id;
  delete page[0].user_id;

  return res.status(200).json({
    page: page[0],
    links: links,
  });
}
