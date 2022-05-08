import { NextApiRequest, NextApiResponse } from 'next';

import { Link } from '../../../services/links/link.model';
import { Page } from '../../../services/pages/page.model';

import { supabase } from '../../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = <string>req.headers.token;
  const { data: user, error: getUserError } = await supabase.auth.api.getUser(token);

  if (getUserError) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const { data: getPageResult, error: getPageError } = await supabase
    .from<Page>('pages')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(1);

  if (getPageError) {
    console.error({ getPageError });
    return res.status(500).json({ error: getPageError });
  }

  const link = req.body;

  // FIXME: improve validation with class-validator/class-transformer
  if (!link.title || !link.url) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  link.page_id = getPageResult[0].id;

  const { status, error: createLinkError } = await supabase.from<Link>('links').insert(link);

  if (createLinkError) {
    console.error({ createLinkError });
    return res.status(status).json({ error: createLinkError });
  }

  return res.status(201).end();
}
