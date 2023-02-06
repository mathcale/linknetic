import { fireEvent, render } from '@testing-library/react';

import Modal, { ModalProps } from './modal.component';

const makeFixture = ({
  isVisible = true,
  title = 'any-modal-title',
  buttons = [{ title: 'any-button', onClick: jest.fn() }] as ModalProps['buttons'],
  isLoading = false,
  children = 'any-children',
} = {}) =>
  ({
    isVisible,
    title,
    buttons,
    isLoading,
    children,
  } as unknown as ModalProps);

const makeSUT = ({ fixture = makeFixture() } = {}) => {
  return render(
    <Modal
      isVisible={fixture.isVisible}
      title={fixture.title}
      buttons={fixture.buttons}
      isLoading={fixture.isLoading}
    >
      {fixture.children}
    </Modal>
  );
};

describe('Modal', () => {
  it('should render with required props', () => {
    const { getByLabelText } = makeSUT();

    const titleTestable = getByLabelText('modal-title');
    const contentTestable = getByLabelText('modal-content');
    const buttonTestable = getByLabelText('modal-button');

    expect(titleTestable).toBeInTheDocument();
    expect(titleTestable.textContent).toEqual('any-modal-title');

    expect(contentTestable).toBeInTheDocument();
    expect(contentTestable.textContent).toEqual('any-children');

    expect(buttonTestable).toBeInTheDocument();
    expect(buttonTestable.textContent).toEqual('any-button');
  });

  it('should render with multiple action buttons', () => {
    const { getAllByLabelText } = makeSUT({
      fixture: makeFixture({
        buttons: [
          { title: 'any-button-1', onClick: jest.fn() },
          { title: 'any-button-2', type: 'secondary', onClick: jest.fn() },
        ],
      }),
    });

    const buttonsTestable = getAllByLabelText('modal-button');

    expect(buttonsTestable).toHaveLength(2);
    expect(buttonsTestable[0].textContent).toEqual('any-button-1');
    expect(buttonsTestable[1].textContent).toEqual('any-button-2');
    expect(buttonsTestable[1].classList.contains('btn-secondary')).toBeTruthy();
  });

  describe('when clicking on button', () => {
    it('should call onClick function', () => {
      const onClickSpy = jest.fn();

      const { getByLabelText } = makeSUT({
        fixture: makeFixture({
          buttons: [{ title: 'any-button', onClick: onClickSpy }],
        }),
      });

      const button = getByLabelText('modal-button');
      fireEvent.click(button);

      expect(onClickSpy).toHaveBeenCalled();
    });

    it('should not call onClick function when isLoading is true', () => {
      const onClickSpy = jest.fn();

      const { getByLabelText } = makeSUT({
        fixture: makeFixture({
          buttons: [{ title: 'any-button', onClick: onClickSpy }],
          isLoading: true,
        }),
      });

      const button = getByLabelText('modal-button');
      fireEvent.click(button);

      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });
});
