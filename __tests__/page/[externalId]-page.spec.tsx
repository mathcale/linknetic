import { render } from '@testing-library/react';

import UserLinksPage, { UserLinksPageProps } from '../../src/pages/page/[externalId]';

import type { Link } from '../../src/services/links/link.model';
import type { Page } from '../../src/services/pages/page.model';

const makePageStub = (
  {
    id = 1,
    external_id = 'any-external-id',
    title = 'any-page-title',
    description = 'any-page-description',
    allowed_link_quantity = 1,
    user_id = 'any-user-id',
    created_at = 'any-created-at-date',
    updated_at = 'any-updated-at-date',
    ...rest
  }: Partial<Page> = {} as Partial<Page>
): Page => ({
  id,
  external_id,
  title,
  description,
  allowed_link_quantity,
  user_id,
  created_at,
  updated_at,
  ...rest,
});

const makeLinkStub = (
  {
    id = 1,
    external_id = 'any-external-id',
    title = 'any-link-title',
    url = 'any-link-url',
    index = 0,
    total_clicks = 0,
    page_id = 1,
    user_id = 'any-user-id',
    created_at = 'any-created-at-date',
    updated_at = 'any-updated-at-date',
    deleted_at = null,
    ...rest
  }: Partial<Link> = {} as Partial<Link>
): Link => ({
  id,
  external_id,
  title,
  url,
  index,
  total_clicks,
  page_id,
  user_id,
  created_at,
  updated_at,
  deleted_at,
  ...rest,
});

const makeStub = ({ page = makePageStub(), links = [makeLinkStub()] } = {}) => ({
  page,
  links,
});

const makeFixture = ({
  data = makeStub(),
  error = null,
  baseUrl = 'any-base-url',
  externalId = 'any-external-id',
} = {}): UserLinksPageProps => ({
  data,
  error,
  baseUrl,
  externalId,
});

const makeSUT = ({ fixture = makeFixture() } = {}) => {
  return render(<UserLinksPage {...fixture} />);
};

describe('UserLinksPage', () => {
  it('should load page with all elements without crashing', () => {
    const { getByLabelText } = makeSUT();

    expect(getByLabelText('page-title')).toBeInTheDocument();
    expect(getByLabelText('page-description')).toBeInTheDocument();
  });

  it('should load page without description', () => {
    const fixture = makeFixture({
      data: makeStub({ page: makePageStub({ description: null }) }),
    });

    const { queryByLabelText } = makeSUT({ fixture });

    expect(queryByLabelText('page-description')).not.toBeInTheDocument();
  });
});
