import { NextResponse } from 'next/server';

// In-memory aggregates for analytics events
const eventAggregates = {
  articleViews: {},
  scrollDepths: { '25': 0, '50': 0, '75': 0, '100': 0 },
  ctaClicks: 0,
  phoneClicks: 0,
  contactSubmissions: 0,
  propertyInquiries: 0,
  relatedArticleClicks: 0,
  categoryClicks: 0,
  locationClicks: 0,
  authorClicks: 0,
  recentEvents: []
};

/**
 * POST /api/analytics/event
 * Ingests client-side performance events
 */
export async function POST(request) {
  try {
    let body;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    const { eventName, params = {} } = body || {};

    if (!eventName) {
      return NextResponse.json({ error: 'Missing eventName' }, { status: 400 });
    }

    // Process event
    switch (eventName) {
      case 'article_page_view': {
        const slug = params.article_slug || 'unknown';
        eventAggregates.articleViews[slug] = (eventAggregates.articleViews[slug] || 0) + 1;
        break;
      }
      case 'scroll_depth': {
        const depth = String(params.depth_percentage);
        if (eventAggregates.scrollDepths[depth] !== undefined) {
          eventAggregates.scrollDepths[depth] += 1;
        }
        break;
      }
      case 'cta_click':
        eventAggregates.ctaClicks += 1;
        break;
      case 'phone_click':
        eventAggregates.phoneClicks += 1;
        break;
      case 'contact_form_submission':
        eventAggregates.contactSubmissions += 1;
        break;
      case 'property_inquiry_click':
        eventAggregates.propertyInquiries += 1;
        break;
      case 'related_article_click':
        eventAggregates.relatedArticleClicks += 1;
        break;
      case 'category_click':
        eventAggregates.categoryClicks += 1;
        break;
      case 'location_page_click':
        eventAggregates.locationClicks += 1;
        break;
      case 'author_page_click':
        eventAggregates.authorClicks += 1;
        break;
      default:
        break;
    }

    // Keep circular buffer of last 30 events
    eventAggregates.recentEvents.unshift({
      eventName,
      params,
      timestamp: new Date().toISOString()
    });
    if (eventAggregates.recentEvents.length > 30) {
      eventAggregates.recentEvents.pop();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

/**
 * GET /api/analytics/event
 * Returns aggregated stats for Admin Performance Dashboard
 */
export async function GET() {
  const totalViews = Object.values(eventAggregates.articleViews).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    success: true,
    data: {
      totalViews,
      viewsByArticle: eventAggregates.articleViews,
      scrollDepths: eventAggregates.scrollDepths,
      interactions: {
        ctaClicks: eventAggregates.ctaClicks,
        phoneClicks: eventAggregates.phoneClicks,
        contactSubmissions: eventAggregates.contactSubmissions,
        propertyInquiries: eventAggregates.propertyInquiries,
        relatedArticleClicks: eventAggregates.relatedArticleClicks,
        categoryClicks: eventAggregates.categoryClicks,
        locationClicks: eventAggregates.locationClicks,
        authorClicks: eventAggregates.authorClicks
      },
      recentEvents: eventAggregates.recentEvents
    }
  });
}
