import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function AuthorCard({ author }) {
  if (!author) return null;

  return (
    <div className="bg-brand-ivory-warm border border-brand-navy/10 rounded-3xl p-6 sm:p-8 my-10 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-gold bg-brand-navy/5">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-brand-navy">
              {author.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              <Award size={13} />
              Editorial Expert
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-navy mb-1">
            <Link 
              href={`/blog/author/${author.slug}`} 
              className="hover:text-brand-gold transition-colors"
            >
              {author.name}
            </Link>
          </h3>

          <p className="text-xs font-semibold uppercase tracking-wider text-brand-slate mb-3">
            {author.jobTitle || 'Senior Luxury Property Consultant'}
          </p>

          <p className="text-sm text-brand-slate leading-relaxed mb-4">
            {author.bio || 'Advising high-net-worth investors and families on prime real estate assets across DLF Gurugram.'}
          </p>

          {/* Expertise Pills */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {author.expertise.map((exp, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white border border-brand-navy/10 text-brand-navy"
                >
                  {exp}
                </span>
              ))}
            </div>
          )}

          {/* Social and link */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-navy/10">
            <div className="flex items-center gap-3 text-brand-slate">
              {author.socialProfiles?.linkedin && (
                <a
                  href={author.socialProfiles.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label={`${author.name} on LinkedIn`}
                >
                  <LinkedinIcon />
                </a>
              )}
              {author.socialProfiles?.twitter && (
                <a
                  href={author.socialProfiles.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label={`${author.name} on Twitter`}
                >
                  <TwitterIcon />
                </a>
              )}
            </div>

            <Link
              href={`/blog/author/${author.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
            >
              <span>All Articles</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
