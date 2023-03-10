import { supabase } from '../../utils/supabase.util';

import { CreateLinkInput } from './create-link.input';
import { Link } from './link.model';

class LinkService {
  async create(pageExternalId: string, createLinkInput: CreateLinkInput): Promise<Link | never> {
    const link = await supabase.from<Link>('links').insert({
      ...createLinkInput,
      // page_id:
    });

    return link.body[0];
  }
}

export default new LinkService();
