import { supabase } from '../../../utils/supabase.util';

export default async function handler(req, res) {
  const token = req.headers.token;
  const { data: user, error } = await supabase.auth.api.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const { data: getPageResult, error: getPageError } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(10);

  if (getPageError) {
    console.error({ getPageError });
    return res.status(500).json({ error: getPageError });
  }

  const { data: getLinksResult, error: getLinksError } = await supabase
    .from('links')
    .select(
      `
      external_id,
      title,
      url,
      created_at,
      updated_at
  `
    )
    .eq('page_id', getPageResult[0].id)
    .is('deleted_at', null);

  if (getLinksError) {
    console.error({ getLinksError });
    return res.status(500).json({ error: getLinksError });
  }

  delete getPageResult[0].id;
  delete getPageResult[0].user_id;

  return res.status(200).json({
    page: getPageResult[0],
    links: getLinksResult,
  });
}
