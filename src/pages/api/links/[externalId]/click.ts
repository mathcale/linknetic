import { NextApiRequest, NextApiResponse } from 'next';

import { ClickLog } from '../../../../services/click-logs/click-logs.model';
import { CreateClickLogInput } from '../../../../services/click-logs/create-click-log.input';
import { Link } from '../../../../services/links/link.model';

import { supabase } from '../../../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { externalId: linkExternalId } = req.query;

  let ip = req.headers['x-real-ip'] as string;
  const forwardedFor = req.headers['x-forwarded-for'] as string;

  if (!ip && forwardedFor) {
    ip = forwardedFor?.split(',').at(0) ?? 'unknown';
  }

  const { data: link, error: getLinkError } = await supabase
    .from<Link>('links')
    .select('*')
    .eq('external_id', linkExternalId as string)
    .is('deleted_at', null)
    .limit(1);

  if (getLinkError) {
    console.error({ getLinkError });
    return res.status(500).json({ error: getLinkError });
  }

  link[0].total_clicks += 1;

  const { status: updateLinkStatus, error: updateLinkError } = await supabase
    .from<Link>('links')
    .update(link[0])
    .eq('id', link[0].id);

  if (updateLinkError) {
    console.error({ updateLinkError });
    return res.status(updateLinkStatus).json({ error: updateLinkError });
  }

  const clickLog: CreateClickLogInput = {
    page_id: link[0].page_id,
    link_id: link[0].id,
    client_data: {
      ip,
      browser: req.headers['user-agent'] as string,
    },
  };

  const { status, error: createClickLogError } = await supabase
    .from<ClickLog>('click_logs')
    .insert(clickLog);

  if (createClickLogError) {
    console.error({ createClickLogError });
    return res.status(status).json({ error: createClickLogError });
  }

  return res.status(201).end();
}
