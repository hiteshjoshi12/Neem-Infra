# Website Owner Checklist — Post-Deployment SEO, AEO & Admin Verification

**Website:** `https://saudagarproperties.com`  
**Audience:** Website Owner, Executive Directors & Marketing Leads  
**Purpose:** Actionable, non-technical steps to verify search engine tokens, confirm business licensing details, and maintain search authority.

---

## 1. Google Search Console (GSC) Verification

1. **Log in to Google Search Console:**  
   Visit [https://search.google.com/search-console](https://search.google.com/search-console) using your primary Google account.
2. **Add or Select Property:**  
   Ensure the property is added as `https://saudagarproperties.com` (URL-prefix or Domain property).
3. **Verify Site Ownership (HTML Tag Method):**  
   - If prompted for HTML tag verification, copy the verification code string (e.g., `google-site-verification=abc123xyz...`).
   - Open your Saudagar Properties Admin Panel: `https://saudagarproperties.com/admin`.
   - Navigate to **SEO > Global Settings > Analytics & Verification**.
   - Paste the code into the **Google Search Console Code** field and toggle **Enable GSC** to ON.
   - Click **Save Settings**.
   - Return to Google Search Console and click **Verify**. (Verification completes immediately).
4. **Submit Canonical XML Sitemap:**  
   - In GSC, click **Sitemaps** on the left menu.
   - Enter `sitemap.xml` under "Add a new sitemap" and click **Submit**.
   - Verify that Google reports status: `Success` and discovers all URLs.

---

## 2. Bing Webmaster Tools & IndexNow Activation

Bing powers search for Microsoft Edge, Windows Copilot, and Yahoo Search, and supports instant indexing via IndexNow.

1. **Verify Bing Webmaster Tools:**  
   - Visit [https://www.bing.com/webmasters](https://www.bing.com/webmasters).
   - Sign in and add `https://saudagarproperties.com`.
   - Copy your Bing verification code (e.g., `msvalidate.01=...`).
   - In your Admin Panel, navigate to **SEO > Global Settings**.
   - Paste the code into **Bing Verification Code** and click **Save Settings**.
   - Click **Verify** in Bing Webmaster Tools.
2. **Activate IndexNow for Instant Indexing:**  
   - In Bing Webmaster Tools, open **IndexNow** under the settings tab.
   - Generate an IndexNow API Key (a 32-character string).
   - In your Admin Panel, paste this key into **SEO Settings > IndexNow Key**.
   - Whenever you publish or update a property or blog post, the system automatically pings Bing to index the new page within minutes instead of days.

---

## 3. Verify Business Profile & Licensing (Admin Panel)

Ensure your official NAP (Name, Address, Phone) and regulatory data are 100% accurate:

1. In Admin Panel, open **Business Profile** (or **SEO > Organization Schema**).
2. **Confirm Phone Numbers:**
   - Primary Advisory Line: `+91 97185 11207`
   - Secondary Advisory Line: `+91 98100 02447`
   - WhatsApp Number: `+91 97185 11207`
3. **Confirm Office Address:**  
   `38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002`
4. **Enter Official RERA Registration Number:**  
   - Enter your official Haryana Real Estate Regulatory Authority (HARERA) registration number in the **RERA Registration ID** field.
   - *Note: Search engines give substantial trust weighting to real-estate brokerages displaying valid RERA numbers.*
5. **Add Google Business Profile Link:**  
   - Paste your official Google Maps share link so the website schema links directly to your verified local business profile.

---

## 4. Custom Scripts & Marketing Pixels

If you use Meta (Facebook) Pixel, Google Tag Manager (GTM), or LinkedIn Insight Tag:

1. Go to **Admin Panel > SEO > Global Settings**.
2. **Head Scripts:**  
   - Paste your Meta Pixel `<script>` or custom tracking tag in the **Custom Head Scripts** box.
3. **Body Scripts:**  
   - Paste any `<noscript>` fallback tags in the **Custom Body Scripts** box.
4. Toggle **Enable Custom Scripts** to ON and click **Save Settings**.
5. *Your tracking tags are now live on every page without requiring developer assistance or code deployments.*

---

## 5. Reviewing 404 Errors & Setting 301 Redirects

The platform automatically logs broken or missing link requests in real time:

1. Open **Admin Panel > SEO > 404 Logs**.
2. Review any URLs hit by users or search bots with their hit counts and referring websites.
3. If an old URL has incoming traffic (e.g., `/old-dlf-floor-listing`), click **Create 301 Redirect**, choose the new destination URL (e.g., `/properties/4-bhk-independent-floor-dlf-phase1`), and save.
4. If a URL is spam or permanently removed with no replacement, mark it as **410 Gone**.

---

## 6. AI & Answer Engine Visibility (AEO & GEO)

Your website is now engineered for AI assistants (OpenAI ChatGPT, Anthropic Claude, Perplexity AI, Google Gemini):

1. **Verify AI Endpoints:**
   - Open [https://saudagarproperties.com/llms.txt](https://saudagarproperties.com/llms.txt) in your browser. Confirm it displays your clean markdown entity profile.
   - Open [https://saudagarproperties.com/llms-full.txt](https://saudagarproperties.com/llms-full.txt). Confirm it lists your micro-market guides and property portfolio.
2. **Test Search Citations:**
   - Search on Perplexity.ai: *"Who are the top real estate consultants for luxury builder floors in DLF Phase 1-5 Gurugram?"*
   - Verify that your firm and canonical links (`saudagarproperties.com`) appear as primary citations.
