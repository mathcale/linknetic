import { fireEvent, render, waitFor } from '@testing-library/react';
import routerMock from 'next-router-mock';

import Navbar, { NavbarProps } from './navbar.component';

const makeUserStub = () => ({
  id: 'any-id',
  app_metadata: {},
  user_metadata: { avatar_url: 'any-avatar-url' },
  aud: 'any-aud',
  created_at: 'any-created-at-date',
});

const makeFixture = ({ title = 'any-title', user = makeUserStub() } = {}) =>
  ({
    title,
    user,
  } as unknown as NavbarProps);

const makeSUT = ({ fixture = makeFixture() } = {}) => {
  return render(<Navbar {...fixture} />);
};

describe('Navbar', () => {
  it('should render with default app title', () => {
    const fixture = makeFixture({ title: null });
    const { getByText } = makeSUT({ fixture });

    expect(getByText('Linknetic')).toBeInTheDocument();
  });

  describe('when user is logged in', () => {
    it('should render menu button', () => {
      const { getByLabelText } = makeSUT();

      expect(getByLabelText('navbar-dropdown-button')).toBeInTheDocument();
    });

    it('should render user avatar', () => {
      const { getByAltText } = makeSUT();

      expect(getByAltText('User avatar')).toBeInTheDocument();
    });

    describe('and clicks on sign out button', () => {
      it('should dispatch sign out function', async () => {
        const { getByText } = makeSUT();

        const button = getByText('Sign out');
        fireEvent.click(button);

        await waitFor(() => {
          expect(routerMock).toMatchObject({
            pathname: '/',
          });
        });
      });
    });
  });

  describe('when user is not logged in', () => {
    it('should render login button', () => {
      const fixture = makeFixture({ user: null });
      const { getByText } = makeSUT({ fixture });

      expect(getByText('Sign in')).toBeInTheDocument();
    });
  });
});
