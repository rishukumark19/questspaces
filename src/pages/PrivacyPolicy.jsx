import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-[850px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        <h1 className="font-display-lg text-display-lg-mobile md:text-[44px] text-primary leading-tight mb-2">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs text-on-surface-variant font-semibold mb-8">
          Last Updated: August 2026 | Quest Spaces Pvt. Ltd.
        </p>

        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm space-y-8 text-on-surface-variant leading-relaxed font-body-md text-sm">
          
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
              1. Data Collection & Usage
            </h2>
            <p>
              Quest Spaces Pvt. Ltd. collects contact information (including name, mobile number, email address, and property preferences) submitted voluntarily through our digital portals and inquiry forms. This data is strictly used for providing property advisory services, scheduling site visits, and coordinating home loan assistance.
            </p>
          </div>

          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
              2. Non-Disclosure & Privacy Guarantee
            </h2>
            <p>
              We uphold strict client confidentiality. Quest Spaces Pvt. Ltd. does not sell, rent, trade, or distribute client contact information to third-party telemarketers or external agencies.
            </p>
          </div>

          <div id="rera">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
              3. RERA Advisory Disclaimer
            </h2>
            <p>
              Quest Spaces Pvt. Ltd. is an independent real estate advisory firm operating as an authorized channel partner and strategic mandate advisor for RERA-registered real estate developers across Karnataka. All property images, floor plans, pricing estimates, and project specifications displayed on this platform are provided for informational and preliminary guidance purposes based on developer-provided data and are subject to change.
            </p>
          </div>

          <div id="terms">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
              4. Corporate Identity & Registered Office
            </h2>
            <p>
              <strong>Quest Spaces Pvt. Ltd.</strong><br />
              Embassy One, 8, Ground Floor, Bellary Road, Ganganagar, Bengaluru - 560032, Karnataka, India.<br />
              Email: info@questspaces.in | Phone: +91 74117 36908
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}
