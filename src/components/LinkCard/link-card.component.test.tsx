import { render, fireEvent } from '@testing-library/react';

import LinkCard from './link-card.component';

import { Link } from '../../modules/link/link.model';

const makeLinkStub = (): Link => ({
  id: 1,
  external_id: 'any-external-id',
  title: 'any-title',
  url: 'any-url',
  index: 0,
  total_clicks: 1,
  page_id: 1,
  user_id: 'any-user-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
});

const makeSUT = ({
  link = makeLinkStub(),
  editable = false,
  clickable = true,
  animated = true,
  onEditButtonClick = jest.fn(),
  onDeleteButtonClick = jest.fn(),
} = {}) => {
  return render(
    <LinkCard
      link={link}
      editable={editable}
      clickable={clickable}
      animated={animated}
      onEditButtonClick={onEditButtonClick}
      onDeleteButtonClick={onDeleteButtonClick}
    />
  );
};

describe('LinkCard', () => {
  let windowOpenSpy;

  beforeEach(() => {
    // @ts-ignore
    fetch.resetMocks();

    windowOpenSpy = jest.spyOn(window, 'open');
    windowOpenSpy.mockImplementation(jest.fn());
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should render with title', () => {
    const { getByLabelText } = makeSUT();
    const testable = getByLabelText('link-title');

    expect(testable).toBeInTheDocument();
    expect(testable.textContent).toEqual('any-title');
  });

  it('should render with action buttons', () => {
    const { getByLabelText } = makeSUT({ editable: true });

    expect(getByLabelText('edit-link-button')).toBeInTheDocument();
    expect(getByLabelText('delete-link-button')).toBeInTheDocument();
  });

  describe('"clickable" prop...', () => {
    it('should open link in new tab when true', () => {
      const { getByLabelText } = makeSUT();

      const linkButton = getByLabelText('link-button');
      fireEvent.click(linkButton);

      expect(windowOpenSpy).toHaveBeenCalledWith('any-url', '_blank');
    });

    it('should not open link in new tab when false', () => {
      const { getByLabelText } = makeSUT({ clickable: false });

      const linkButton = getByLabelText('link-button');
      fireEvent.click(linkButton);

      expect(windowOpenSpy).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should dispatch http request for "click" endpoint with correct params', () => {
      const { getByLabelText } = makeSUT();

      const linkButton = getByLabelText('link-button');
      fireEvent.click(linkButton);

      expect(fetch).toHaveBeenCalledWith('/api/links/any-external-id/click', {
        method: 'POST',
      });
    });
  });
});
