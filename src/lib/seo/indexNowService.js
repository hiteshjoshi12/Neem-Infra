import { getGlobalSettings } from '@/lib/dal';

/**
 * Submits updated URLs to the IndexNow protocol (supported by Bing, Yandex, Naver, Seznam)
 * for instant indexing within minutes instead of waiting for crawler discovery.
 *
 * @param {string[]} urlList - List of absolute URLs to ping
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitToIndexNow(urlList = []) {
  if (!Array.isArray(urlList) || urlList.length === 0) {
    return { success: false, message: 'No URLs provided for IndexNow submission' };
  }

  try {
    const settings = await getGlobalSettings();
    const key = settings?.indexNowKey?.trim();
    const host = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com')
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');

    if (!key) {
      return {
        success: false,
        message: 'IndexNow key is not configured in Admin > SEO Settings',
      };
    }

    const payload = {
      host,
      key,
      keyLocation: settings?.indexNowKeyLocation || `https://${host}/${key}.txt`,
      urlList,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      return {
        success: true,
        message: `Successfully submitted ${urlList.length} URL(s) to IndexNow (${response.status})`,
      };
    }

    const resText = await response.text();
    return {
      success: false,
      message: `IndexNow responded with status ${response.status}: ${resText}`,
    };
  } catch (error) {
    console.error('[IndexNow] Submission error:', error.message);
    return { success: false, message: error.message };
  }
}
