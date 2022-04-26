import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

interface LinkCardProps {
  link: any; // FIXME: use correct type
  editable: boolean;
}

export default function LinkCard({ link, editable }: LinkCardProps) {
  return (
    <div className="flex flex-row items-center mb-4">
      <div className="card bg-primary text-primary-content shadow-xl flex-auto">
        <div className="card-body p-5 text-center">
          <p className="m-0">{link.title}</p>
        </div>
      </div>

      {editable && (
        <>
          <a href="#editLinkModal" className="btn btn-circle ml-3">
            <PencilIcon width={18} />
          </a>
          <a href="#deleteLinkModal" className="btn btn-error btn-circle bg-danger ml-3">
            <TrashIcon width={18} />
          </a>
        </>
      )}
    </div>
  );
}
