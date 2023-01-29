import { NextApiRequest, NextApiResponse } from 'next';

import { ClickLog } from '../../services/click-logs/click-logs.model';
import { Link } from '../../services/links/link.model';
import { Page } from '../../services/pages/page.model';

import { supabase } from '../../utils/supabase.util';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = <string>req.headers.token;
  const { data: user, error: getUserError } = await supabase.auth.api.getUser(token);

  if (getUserError) {
    return res.status(401).json({ error: getUserError.message });
  }

  const { data: page, error: getPageError } = await supabase
    .from<Page>('pages')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(1);

  if (getPageError) {
    console.error({ getPageError });
    return res.status(500).json({ error: getPageError });
  }

  if (page.length === 0) {
    return res.status(200).json({
      total: 0,
      links: [],
    });
  }

  const { data: links, error: getLinksError } = await supabase
    .from<Link>('links')
    .select(
      `
      title,
      url,
      total_clicks
  `
    )
    .eq('page_id', page[0].id)
    .is('deleted_at', null)
    .order('total_clicks', { ascending: false });

  if (getLinksError) {
    console.error({ getLinksError });
    return res.status(500).json({ error: getLinksError });
  }

  const { count: totalClicksCount, error: getTotalClicksCountError } = await supabase
    .from<ClickLog>('click_logs')
    .select('*', { count: 'exact' })
    .eq('page_id', page[0].id);

  if (getTotalClicksCountError) {
    console.error({ getTotalClicksCountError });
    return res.status(500).json({ error: getTotalClicksCountError });
  }

  return res.status(200).json({
    total: totalClicksCount,
    links,
  });
}
