import { Link } from '@inertiajs/react';

export default function Pagination({ meta }: { meta: any }) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{meta.from}</span> to <span className="font-medium">{meta.to}</span> of{' '}
        <span className="font-medium">{meta.total}</span> results
      </div>
      
      <div className="flex space-x-2">
        {meta.links.map((link: any, index: number) => (
          <Link
            key={index}
            href={link.url || '#'}
            className={`px-3 py-1 rounded-md ${
              link.active
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
            preserveState
          >
            <span dangerouslySetInnerHTML={{ __html: link.label }} />
          </Link>
        ))}
      </div>
    </div>
  );
}