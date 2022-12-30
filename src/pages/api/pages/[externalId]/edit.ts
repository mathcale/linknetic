import { NextApiRequest, NextApiResponse } from 'next';

import { Page } from '../../../../services/pages/page.model';

import { supabase } from '../../../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = <string>req.headers.token;
  const { data: user, error: getUserError } = await supabase.auth.api.getUser(token);

  if (getUserError) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const { externalId } = req.query;

  if (!externalId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { data: page, error: getPageError } = await supabase
    .from<Page>('pages')
    .select('*')
    .eq('external_id', externalId as string)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(1);

  if (getPageError) {
    console.error({ getPageError });
    return res.status(500).json({ error: getPageError });
  }

  const updatePageInput = req.body;

  // FIXME: improve validation with class-validator/class-transformer
  if (!updatePageInput.title) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  if (updatePageInput.title !== page[0].title) {
    page[0].title = updatePageInput.title;
  }

  if (updatePageInput.description !== page[0].description) {
    page[0].description = updatePageInput.description;
  }

  const { status, error: updatePageError } = await supabase
    .from<Page>('pages')
    .update(page[0])
    .eq('external_id', externalId as string)
    .eq('user_id', user.id);

  if (updatePageError) {
    console.error({ updatePageError });
    return res.status(status).json({ error: updatePageError });
  }

  return res.status(200).end();
}
