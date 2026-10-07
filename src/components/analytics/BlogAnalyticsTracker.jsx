"use client";

import { useEffect, useRef } from 'react';
import { 
  trackArticlePageView, 
  trackScrollDepth, 
  trackPhoneClick, 
  trackCtaClick,
  trackCategoryClick,
  trackLocationPageClick,
  trackAuthorPageClick,
  trackRelatedArticleClick,
  trackPropertyInquiryClick
} from '@/lib/analytics/analytics';

/**
 * BlogAnalyticsTracker
 * ============================================================================
 * Invisible client-side performance observer for blog articles.
 * Listens for scroll milestones (25%, 50%, 75%, 100%) and delegates interactions
 * for telephone calls, related reads, category/locality exploration, and inquiry CTAs.
 */
export default function BlogAnalyticsTracker({ post }) {
  const scrollMilestones = useRef(new Set());

  useEffect(() => {
    if (!post) return;

    // 1. Fire Article Page View Event on Mount
    trackArticlePageView({
      slug: post.slug,
      title: post.title,
      category: post.category?.name || post.categorySlug || 'Uncategorized',
      author: post.author?.name || 'Saudagar Advisory Desk',
      readingTime: post.readingTime || 5
    });

    // 2. Track Scroll Depth Milestones (25%, 50%, 75%, 100%)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) {
            ticking = false;
            return;
          }
          const scrollPos = window.scrollY;
          const percentage = Math.round((scrollPos / docHeight) * 100);

          [25, 50, 75, 100].forEach((threshold) => {
            if (percentage >= threshold && !scrollMilestones.current.has(threshold)) {
              scrollMilestones.current.add(threshold);
              trackScrollDepth({
                slug: post.slug,
                depth: threshold
              });
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. Delegate Click Handlers across Article Interactions
    const handleClick = (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = target.innerText?.trim() || target.getAttribute('aria-label') || '';

      // Phone Click
      if (href.startsWith('tel:')) {
        trackPhoneClick({
          phoneNumber: href.replace('tel:', ''),
          sourcePage: `/blog/${post.slug}`
        });
        return;
      }

      // Category Click
      if (href.includes('/blog/category/')) {
        const catSlug = href.split('/blog/category/')[1]?.split('?')[0];
        trackCategoryClick({
          categoryName: text,
          categorySlug: catSlug,
          sourcePage: `/blog/${post.slug}`
        });
        return;
      }

      // Location Page Click
      if (href.includes('/blog/location/')) {
        const locSlug = href.split('/blog/location/')[1]?.split('?')[0];
        trackLocationPageClick({
          locationName: text,
          locationSlug: locSlug,
          sourcePage: `/blog/${post.slug}`
        });
        return;
      }

      // Author Page Click
      if (href.includes('/blog/author/')) {
        const authSlug = href.split('/blog/author/')[1]?.split('?')[0];
        trackAuthorPageClick({
          authorName: text,
          authorSlug: authSlug,
          sourcePage: `/blog/${post.slug}`
        });
        return;
      }

      // Related Article Click
      if (href.startsWith('/blog/') && !href.includes('/category/') && !href.includes('/location/') && !href.includes('/author/')) {
        const targetSlug = href.replace('/blog/', '').split('?')[0];
        if (targetSlug && targetSlug !== post.slug) {
          trackRelatedArticleClick({
            currentSlug: post.slug,
            targetSlug,
            targetTitle: text
          });
        }
        return;
      }

      // Property Inquiry Click
      if (href.startsWith('/properties/') || target.getAttribute('data-action') === 'inquire') {
        trackPropertyInquiryClick({
          propertyId: target.getAttribute('data-property-id') || null,
          propertyTitle: text,
          location: post.location?.[0]?.name || 'Gurugram',
          sourcePage: `/blog/${post.slug}`
        });
        return;
      }

      // General CTA Click (e.g. contact buttons, services buttons)
      if (href.includes('/contact') || href.includes('/services') || target.getAttribute('data-analytics') === 'cta') {
        trackCtaClick({
          ctaText: text,
          ctaTarget: href,
          location: post.location?.[0]?.name || 'DLF Gurugram',
          sourcePage: `/blog/${post.slug}`
        });
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, [post]);

  return null;
}
