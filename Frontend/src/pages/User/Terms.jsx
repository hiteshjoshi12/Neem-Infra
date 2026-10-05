import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import BreadcrumbJsonLd from '../../components/seo/BreadcrumbJsonLd';
import { PAGE_SEO, BREADCRUMBS } from '../../lib/seo/seoConfig';

export default function Terms() {
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
            Terms of Service
          </h1>
          <div className="w-16 h-1 bg-[#D09A16] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E8E4DA] text-[#475569] space-y-8 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">1. Terms</h2>
            <p>
              By accessing this Website, accessible from https://saudagarproperties.com/, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to temporarily download one copy of the materials on Saudagarproperties's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on Saudagarproperties's Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>
              This will let Saudagarproperties to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">3. Disclaimer</h2>
            <p>
              All the materials on Saudagarproperties's Website are provided "as is". Saudagarproperties makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Saudagarproperties does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">4. Limitations</h2>
            <p>
              Saudagarproperties or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Saudagarproperties's Website, even if Saudagarproperties or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">5. Revisions and Errata</h2>
            <p>
              The materials appearing on Saudagarproperties's Website may include technical, typographical, or photographic errors. Saudagarproperties will not promise that any of the materials in this Website are accurate, complete, or current. Saudagarproperties may change the materials contained on its Website at any time without notice. Saudagarproperties does not make any commitment to update the materials.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">6. Links</h2>
            <p>
              Saudagarproperties has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Saudagarproperties of the site. The use of any linked website is at the user's own risk.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">7. Site Terms of Use Modifications</h2>
            <p>
              Saudagarproperties may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">8. Your Privacy</h2>
            <p>
              Please read our Privacy Policy.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-serif font-bold text-[#1D263B] mb-3">9. Governing Law</h2>
            <p>
              Any claim related to Saudagarproperties's Website shall be governed by the laws of in without regards to its conflict of law provisions.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
