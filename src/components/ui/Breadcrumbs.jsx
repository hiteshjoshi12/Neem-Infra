import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-semibold uppercase tracking-[0.2em]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.url || index}>
              {index > 0 && (
                <li aria-hidden="true" className="text-slate-400 select-none">
                  /
                </li>
              )}
              <li className={isLast ? 'text-[#D09A16]' : 'text-slate-500'}>
                {isLast ? (
                  <span aria-current="page" className="flex items-center gap-1.5 truncate max-w-[260px] sm:max-w-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16] shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#D09A16] transition-colors"
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
