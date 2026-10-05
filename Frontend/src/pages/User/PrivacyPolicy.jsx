import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '../../lib/seo/seoConfig';

export default function PrivacyPolicy() {
  const location = useLocation();
  const currentPath = location.pathname;
  const seoData = PAGE_SEO[currentPath] || PAGE_SEO['/'];
  const breadcrumbs = BREADCRUMBS[currentPath] || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF8F5] pt-28 pb-16">
      <SEOHead {...seoData} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D263B] mb-4">
            Privacy Policy
          </h1>
          <div className="w-16 h-1 bg-[#D09A16] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E8E4DA] text-[#475569] space-y-8 leading-relaxed">
          
          <section>
            <p>
              At Saudagarproperties, accessible from https://saudagarproperties.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Saudagarproperties and how we use it.
            </p>
            <p className="mt-3">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>
            <p className="mt-3">
              This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Saudagarproperties. This policy is not applicable to any information collected offline or via channels other than this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Information we collect</h2>
            <p className="mb-3">
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <p className="mb-3">
              If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>
            <p>
              When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">How we use your information</h2>
            <p className="mb-3">We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Log Files</h2>
            <p>
              Saudagarproperties follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Cookies and Web Beacons</h2>
            <p className="mb-3">
              Like any other website, Saudagarproperties uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Our Advertising Partners</h2>
            <p className="mb-3">
              Some of advertisers on our site may use cookies and web beacons. Each of our advertising partners has their own Privacy Policy for their policies on user data.
            </p>
            <p className="mb-3">
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Saudagarproperties, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p>
              Note that Saudagarproperties has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Third Party Privacy Policies</h2>
            <p className="mb-3">
              Saudagarproperties's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
            <p>
              You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p className="mb-3">Under the CCPA, among other rights, California consumers have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
              <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
            </ul>
            <p>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">GDPR Data Protection Rights</h2>
            <p className="mb-3">We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
              <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
              <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
              <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
            <p>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">Children's Information</h2>
            <p className="mb-3">
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p>
              Saudagarproperties does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
