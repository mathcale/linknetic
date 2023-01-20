import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

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

  if (getPageResult.length > 0) {
    console.error({ error: `User [${user.id}] already has a page` });
    return res.status(409).json({ error: 'User already has a page' });
  }

  const { status, error: createPageError } = await supabase.from<Page>('pages').insert({
    user_id: user.id,
    external_id: uuid(),
    title: req.body.title,
    description: req.body.description,
    allowed_link_quantity: 10,
  });

  if (createPageError) {
    console.error({ createPageError });
    return res.status(status).json({ error: createPageError });
  }

  return res.status(201).end();
}
