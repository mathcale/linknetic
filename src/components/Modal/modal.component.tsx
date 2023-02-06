import { MouseEvent, ReactNode } from 'react';

export interface ModalButton {
  title: string | JSX.Element;
  type?: 'primary' | 'secondary' | 'info' | 'warning' | 'error';
  onClick: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export interface ModalProps {
  isVisible: boolean;
  title: string;
  buttons: [ModalButton, ModalButton?];
  isLoading: boolean;
  children: ReactNode;
}

export default function Modal({ isVisible, title, buttons, isLoading, children }: ModalProps) {
  return (
    <div className={`modal${isVisible ? ' modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg" aria-label="modal-title">
          {title}
        </h3>

        <div className="py-4" aria-label="modal-content">
          {children}
        </div>

        <div className="modal-action">
          {buttons.length > 0 &&
            buttons.map((button, i) => (
              <button
                key={i}
                onClick={!isLoading ? button.onClick : null}
                className={`btn${button.type ? ` btn-${button.type}` : ''}${
                  isLoading ? ' loading btn-disabled' : ''
                }`}
                aria-label="modal-button"
              >
                {button.title}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
