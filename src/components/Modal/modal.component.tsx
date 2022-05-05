import { MouseEvent, ReactNode } from 'react';

interface ModalButton {
  title: string | JSX.Element;
  type?: 'primary' | 'secondary' | 'info' | 'warning' | 'error';
  onClick: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

interface ModalProps {
  isVisible: boolean;
  title: string;
  buttons: [ModalButton, ModalButton?];
  children: ReactNode;
}

export default function Modal({ isVisible, title, buttons, children }: ModalProps) {
  return (
    <div className={`modal${isVisible ? ' modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>

        <div className="py-4">{children}</div>

        <div className="modal-action">
          {buttons.length > 0 &&
            buttons.map((button, i) => (
              <button
                key={i}
                onClick={button.onClick}
                className={`btn${button.type ? ` btn-${button.type}` : ''}`}
              >
                {button.title}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
