import { render } from '@testing-library/react';

import AuthPage from '../src/pages/auth';

describe('AuthPage', () => {
  it('should load page with all elements without crashing', () => {
    const { getByLabelText } = render(<AuthPage />);

    expect(getByLabelText('navbar')).toBeInTheDocument();
    expect(getByLabelText('facebook-signin-button')).toBeInTheDocument();
    expect(getByLabelText('google-signin-button')).toBeInTheDocument();
  });
});
