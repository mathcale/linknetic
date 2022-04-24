import { supabase } from '../../utils/supabase.util';

export default function handler(req, res) {
  supabase.auth.api.setAuthCookie(req, res);
}
