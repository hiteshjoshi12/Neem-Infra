/**
 * ----------------------------------------------------------------------------
 * SAUDAGAR PROPERTIES — SEARCH & CONTENT PERFORMANCE ANALYTICS ENGINE
 * ----------------------------------------------------------------------------
 * Integrates with Google Analytics 4 (gtag), Google Tag Manager (dataLayer),
 * and an internal event dispatch system for the Admin SEO Dashboard.
 */

// Safe browser detection
const isBrowser = typeof window !== 'undefined';

/**
 * Universal Event Dispatcher
 * Sends events to gtag, dataLayer, and internal beacon
 */
export function trackEvent(eventName, params = {}) {
  if (!isBrowser) return;

  const eventPayload = {
    ...params,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    referrer: document.referrer || null
  };

  // 1. Google Analytics 4 (gtag)
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, eventPayload);
    } catch (e) {
      console.debug('[Analytics] gtag error:', e);
    }
  }

  // 2. Google Tag Manager (dataLayer)
  if (Array.isArray(window.dataLayer)) {
    try {
      window.dataLayer.push({
        event: eventName,
        ...eventPayload
      });
    } catch (e) {
      console.debug('[Analytics] dataLayer error:', e);
    }
  }

  // 3. Internal Event Beacon (Non-blocking)
  try {
    const dataString = JSON.stringify({ eventName, params: eventPayload });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/event', dataString);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataString,
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Fail silently in restricted browser environments
  }
}

/**
 * 1. Article Page View
 */
export function trackArticlePageView({ slug, title, category, author, readingTime }) {
  trackEvent('article_page_view', {
    article_slug: slug,
    article_title: title,
    article_category: category,
    article_author: author,
    reading_time: readingTime
  });
}

/**
 * 2. Scroll Depth Milestone (25%, 50%, 75%, 100%)
 */
export function trackScrollDepth({ slug, depth }) {
  trackEvent('scroll_depth', {
    article_slug: slug,
    depth_percentage: depth
  });
}

/**
 * 3. CTA Click
 */
export function trackCtaClick({ ctaText, ctaTarget, location, sourcePage }) {
  trackEvent('cta_click', {
    cta_text: ctaText,
    cta_target: ctaTarget,
    property_location: location,
    source_page: sourcePage
  });
}

/**
 * 4. Phone Click
 */
export function trackPhoneClick({ phoneNumber, sourcePage }) {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    source_page: sourcePage
  });
}

/**
 * 5. Contact Form Submission
 */
export function trackContactFormSubmission({ formId, sourcePage, status = 'success' }) {
  trackEvent('contact_form_submission', {
    form_id: formId,
    source_page: sourcePage,
    status
  });
}

/**
 * 6. Property Inquiry Click
 */
export function trackPropertyInquiryClick({ propertyId, propertyTitle, location, sourcePage }) {
  trackEvent('property_inquiry_click', {
    property_id: propertyId,
    property_title: propertyTitle,
    location,
    source_page: sourcePage
  });
}

/**
 * 7. Related Article Click
 */
export function trackRelatedArticleClick({ currentSlug, targetSlug, targetTitle }) {
  trackEvent('related_article_click', {
    current_slug: currentSlug,
    target_slug: targetSlug,
    target_title: targetTitle
  });
}

/**
 * 8. Category Click
 */
export function trackCategoryClick({ categoryName, categorySlug, sourcePage }) {
  trackEvent('category_click', {
    category_name: categoryName,
    category_slug: categorySlug,
    source_page: sourcePage
  });
}

/**
 * 9. Location Page Click
 */
export function trackLocationPageClick({ locationName, locationSlug, sourcePage }) {
  trackEvent('location_page_click', {
    location_name: locationName,
    location_slug: locationSlug,
    source_page: sourcePage
  });
}

/**
 * 10. Author Page Click
 */
export function trackAuthorPageClick({ authorName, authorSlug, sourcePage }) {
  trackEvent('author_page_click', {
    author_name: authorName,
    author_slug: authorSlug,
    source_page: sourcePage
  });
}
