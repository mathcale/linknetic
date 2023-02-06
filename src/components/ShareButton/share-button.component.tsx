import toast from 'react-hot-toast';
import { ShareIcon } from '@heroicons/react/outline';

interface ShareButtonProps {
  url: string;
}

export default function ShareButton({ url }: ShareButtonProps) {
  const onShareButtonPress = (): void => {
    navigator.clipboard.writeText(url);
    toast.success('Page link copied to clipboard!');
  };

  return (
    <button
      className="btn gap-2 fixed z-90 bottom-5 right-5 sm:bottom-10 sm:right-10"
      onClick={onShareButtonPress}
      aria-label="share-button"
    >
      <ShareIcon width={24} /> Share
    </button>
  );
}
