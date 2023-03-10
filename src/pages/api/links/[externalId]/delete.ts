import { NextApiRequest, NextApiResponse } from 'next';

import { Link } from '../../../../modules/link/link.model';

import { supabase } from '../../../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = <string>req.headers.token;
  const { data: user, error: getUserError } = await supabase.auth.api.getUser(token);

  if (getUserError) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const { externalId: linkExternalId } = req.query;

  const { status, error: deleteLinkError } = await supabase
    .from<Link>('links')
    .delete()
    .eq('external_id', linkExternalId as string)
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (deleteLinkError) {
    console.error({ deleteLinkError });
    return res.status(status).json({ error: deleteLinkError });
  }

  return res.status(200).end();
}
