import { fireEvent, render } from '@testing-library/react';
import routerMock from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { Session, User } from '@supabase/supabase-js';

import IndexPage from '../src/pages';

import { UserContextProvider } from '../src/hooks/auth-user.hook';

interface FixtureInputParams {
  user: boolean | User;
  session: boolean | Session;
}

const makeUserStub = (): User => ({
  id: 'any-id',
  app_metadata: {},
  user_metadata: { avatar_url: 'any-avatar-url' },
  aud: 'any-aud',
  created_at: 'any-created-at-date',
});

const makeUserSession = (): Session => ({} as Session);

const makeFixture = (
  {
    user = makeUserStub(),
    session = makeUserSession(),
  }: FixtureInputParams = {} as FixtureInputParams
) => ({
  user,
  session,
});

const makeSUT = ({ fixture = makeFixture() } = {}) => {
  return render(
    <UserContextProvider value={{ user: fixture.user, session: fixture.session }}>
      <IndexPage />
    </UserContextProvider>,
    { wrapper: MemoryRouterProvider }
  );
};

describe('IndexPage', () => {
  it('should load page with all elements without crashing', () => {
    const { getByLabelText } = makeSUT();

    expect(getByLabelText('navbar')).toBeInTheDocument();
    expect(getByLabelText('main-title')).toBeInTheDocument();
    expect(getByLabelText('start-button')).toBeInTheDocument();
  });

  describe('when user clicks on "start now" button', () => {
    it('should redirect to "/auth" if user is not authenticated', () => {
      const fixture = makeFixture({ user: false, session: false });
      const { getByLabelText } = makeSUT({ fixture });

      const button = getByLabelText('start-button');
      fireEvent.click(button);

      expect(routerMock.asPath).toEqual('/auth');
    });

    it('should redirect to "/management/dashboard" if user is authenticated', () => {
      const fixture = makeFixture();
      const { getByLabelText } = makeSUT({ fixture });

      const button = getByLabelText('start-button');
      fireEvent.click(button);

      expect(routerMock.asPath).toEqual('/management/dashboard');
    });
  });
});
