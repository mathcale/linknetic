import { fireEvent, render } from '@testing-library/react';

import ShareButton from './share-button.component';

const makeSUT = ({ url = 'any-url' } = {}) => {
  return render(<ShareButton url={url} />);
};

describe('ShareButton', () => {
  const originalClipboard = { ...global.navigator.clipboard };

  beforeEach(() => {
    const mockClipboard = {
      writeText: jest.fn(),
    };

    // @ts-ignore
    global.navigator.clipboard = mockClipboard;
  });

  afterEach(() => {
    jest.resetAllMocks();

    // @ts-ignore
    global.navigator.clipboard = originalClipboard;
  });

  it('should render correctly', () => {
    const { getByLabelText } = makeSUT();

    const testable = getByLabelText('share-button');

    expect(testable).toBeInTheDocument();
    expect(testable.textContent).toContain('Share');
  });

  it('should copy url to clipboard when clicked', () => {
    const { getByLabelText } = makeSUT();

    const button = getByLabelText('share-button');
    fireEvent.click(button);

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('any-url');
  });
});
