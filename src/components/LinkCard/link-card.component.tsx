import { MouseEventHandler } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

import { Link } from '../../services/links/link.model';

interface LinkCardProps {
  link: Link;
  editable: boolean;
  clickable?: boolean;
  animated?: boolean;
  onEditButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onDeleteButtonClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function LinkCard({
  link,
  editable,
  clickable,
  animated,
  onEditButtonClick,
  onDeleteButtonClick,
}: LinkCardProps) {
  const onCardClick = async (): Promise<void | never> => {
    if (!clickable) {
      return;
    }

    await fetch(`/api/links/${link.external_id}/click`, {
      method: 'POST',
    });

    window.open(link.url, '_blank');
  };

  return (
    <motion.div
      className="flex flex-row items-center mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: link.index * 0.03 }}
      whileHover={
        animated && {
          scale: 1.02,
          transition: { duration: 0.3 },
        }
      }
    >
      <div
        className={`card bg-primary text-primary-content shadow-xl flex-auto${
          clickable ? ' cursor-pointer' : ''
        }`}
        onClick={onCardClick}
      >
        <div className="card-body p-5 text-center">
          <p className="m-0">{link.title}</p>
        </div>
      </div>

      {editable && (
        <>
          <button onClick={onEditButtonClick} className="btn btn-circle ml-3">
            <PencilIcon width={18} />
          </button>

          <button onClick={onDeleteButtonClick} className="btn btn-error btn-circle bg-danger ml-3">
            <TrashIcon width={18} />
          </button>
        </>
      )}
    </motion.div>
  );
}
