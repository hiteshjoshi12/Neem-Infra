import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-[#566078]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.url || index}>
              {index > 0 && (
                <li aria-hidden="true" className="text-[#8892A6]">
                  <ChevronRight size={12} />
                </li>
              )}
              <li className={isLast ? 'text-[#17213D] font-semibold truncate max-w-[220px] sm:max-w-xs' : ''}>
                {isLast ? (
                  <span aria-current="page">{item.name}</span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#C6A24A] transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
