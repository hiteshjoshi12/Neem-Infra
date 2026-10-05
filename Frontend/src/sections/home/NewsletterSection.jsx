import { useState } from 'react';
import { Mail, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import api from '../../services/api';

export default function NewsletterSection() {
  const { sections } = useCms();
  const newsData = sections?.newsletter || {};

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);

    try {
      await api.createInquiry({
        email: email.trim(),
        type: 'newsletter',
      });
    } catch (err) {
      console.warn('Newsletter API error:', err?.message);
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="w-full bg-[#F9F7F4] py-10 md:py-12"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">

        <div className="relative overflow-hidden rounded-2xl bg-[#182345] px-6 py-7 md:px-9 md:py-8">

          {/* subtle gold accent */}
          <div className="absolute left-0 top-0 h-full w-[2px] bg-[#D09A16]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Content */}
            <div className="max-w-lg">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-[#D09A16]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D09A16]">
                  {newsData.badge || 'Market Intelligence'}
                </span>
              </div>

              <h2
                id="newsletter-heading"
                className="font-serif text-2xl leading-tight text-white sm:text-[28px]"
              >
                {newsData.titleMain || 'Stay ahead with'}{' '}
                <span className="italic font-light text-[#D09A16]">
                  {newsData.titleItalic || 'Saudagar Properties'}
                </span>
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/50 sm:text-sm">
                {newsData.description ||
                  'Curated property opportunities and Gurgaon market insights, delivered directly to your inbox.'}
              </p>
            </div>

            {/* Form */}
            <div className="w-full lg:max-w-[390px]">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>

                  <div className="flex overflow-hidden rounded-xl bg-white p-1">
                    <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                      <Mail
                        size={15}
                        className="flex-shrink-0 text-[#D09A16]"
                      />

                      <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          newsData.placeholder || 'Your email address'
                        }
                        className="min-w-0 w-full bg-transparent text-xs text-[#182345] outline-none placeholder:text-[#182345]/35"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-[#D09A16] px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[#182345] transition hover:bg-[#E0AD36] disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#182345] border-t-transparent" />
                      ) : (
                        <>
                          {newsData.buttonText || 'Subscribe'}
                          <ArrowUpRight size={12} />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 px-1">
                    <ShieldCheck size={11} className="text-[#D09A16]" />

                    <span className="text-[9px] text-white/35">
                      {newsData.disclaimer ||
                        'No spam. Unsubscribe anytime.'}
                    </span>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-[#D09A16]/20 bg-white/[0.06] px-4 py-3">
                  <CheckCircle2
                    size={22}
                    className="flex-shrink-0 text-[#D09A16]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-white">
                      {newsData.successTitle || 'You’re subscribed.'}
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/45">
                      {newsData.successMessage ||
                        'Exclusive property insights are on their way.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}