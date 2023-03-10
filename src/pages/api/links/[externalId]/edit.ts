import { NextApiRequest, NextApiResponse } from 'next';

import { Link } from '../../../../modules/link/link.model';

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

  const { externalId: linkExternalId } = req.query;

  const { data: link, error: getLinkError } = await supabase
    .from<Link>('links')
    .select('*')
    .eq('external_id', linkExternalId as string)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(1);

  if (getLinkError) {
    console.error({ getLinkError });
    return res.status(500).json({ error: getLinkError });
  }

  const updateLinkInput = req.body;

  // FIXME: improve validation with class-validator/class-transformer
  if (!updateLinkInput.title || !updateLinkInput.url) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  if (updateLinkInput.title !== link[0].title) {
    link[0].title = updateLinkInput.title;
  }

  if (updateLinkInput.url !== link[0].url) {
    link[0].url = updateLinkInput.url;
  }

  const { status, error: updateLinkError } = await supabase
    .from<Link>('links')
    .update(link[0])
    .eq('external_id', linkExternalId as string)
    .eq('user_id', user.id);

  if (updateLinkError) {
    console.error({ updateLinkError });
    return res.status(status).json({ error: updateLinkError });
  }

  return res.status(200).end();
}
