import React, { useState } from 'react';

export default function HomeLoan({ onOpenVIPModal }) {
  // Calculator State
  const [loanAmount, setLoanAmount] = useState(5000000); // Default 50 Lakhs
  const [tenureYears, setTenureYears] = useState(20); // Default 20 Years
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%

  // Callback Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', email: '' });

  // EMI Formula Math: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );

  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;
  const principalPercent = Math.round((loanAmount / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased">
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden bg-primary py-16 text-white">
        <div className="absolute inset-0 opacity-35 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9shax42t9tNZx9_aQIG5IlDPx-RJKPlO2plsKUivTORJAiwZ2Vq9-9P0wNaYv3P10oRAOnemnVJMr8ucCGg37QxitPqGrwwBrkipetWqnqn5n6ayf7TjCH3BTInYn7dOwUiWi9b0nwwYEiQh_6BSDTt14-WUXaCjHaHWyZykabHFIXRHSbEAl_SSXX4t5njD--k77TL4MXgoLwckXfVHhuYXnbk-SYKMB97QdO2MWwmswVIJyKh8QyNtPsVB0ynqSz17FhvX_tbmT')` 
            }} 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-transparent z-0" />
        
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-secondary-container/90 text-on-secondary-container text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest text-gold">
              Premium Financial Advisory
            </span>
            <h1 className="font-display-lg text-[40px] md:text-[56px] font-bold mb-6 text-white leading-tight">
              Home Loan Guidance That Puts You First
            </h1>
            <p className="font-body-lg text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlock the door to your dream home with institutional-grade loan advisory. We partner with India's leading banks to bring you preferential interest rates and a paperless experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#calculator" 
                className="bg-gold text-primary px-8 py-3.5 font-label-bold text-xs uppercase tracking-widest rounded hover:bg-gold-dark transition-all active:scale-95 shadow-md font-bold"
              >
                Calculate EMI
              </a>
              <a 
                href="#enquiry" 
                className="border border-white/40 text-white px-8 py-3.5 font-label-bold text-xs uppercase tracking-widest rounded hover:bg-white/10 transition-all active:scale-95 font-bold"
              >
                Check Eligibility
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Banking Institutions Strip */}
      <section className="py-12 bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-3">
            trusted partner banking institutions
          </span>
          <h2 className="text-lg md:text-xl font-bold text-primary max-w-2xl mx-auto mb-8">
            Preferential interest rates and priority processing through top Indian banks
          </h2>
          <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
            {[
              { name: 'HDFC Bank', rate: 'From 8.35%', logo: 'https://questspaces.in/wp-content/uploads/2026/01/hdfc-300x164.png' },
              { name: 'State Bank of India', rate: 'From 8.40%', logo: 'https://questspaces.in/wp-content/uploads/2026/01/sbi-300x164.png' },
              { name: 'ICICI Bank', rate: 'From 8.45%', logo: 'https://questspaces.in/wp-content/uploads/2026/01/icici-300x164.png' },
              { name: 'Kotak Mahindra Bank', rate: 'From 8.50%', logo: 'https://questspaces.in/wp-content/uploads/2026/01/kotak-300x164.png' },
              { name: 'Axis Bank', rate: 'From 8.50%', logo: 'https://questspaces.in/wp-content/uploads/2026/01/axis-300x164.png' }
            ].map((bank, i) => (
              <div 
                key={i} 
                className="px-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-[180px] flex flex-col items-center justify-center gap-2"
              >
                <div className="h-12 w-full flex items-center justify-center mb-1">
                  <img src={bank.logo} alt={bank.name} className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity" loading="lazy" />
                </div>
                <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">{bank.rate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Quest Spaces Finance (Bento Grid) */}
      <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-2">our advantage</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-display-lg">
            Why Choose Quest Spaces Finance?
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
          {/* Card 1 */}
          <div className="p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-6 shadow-sm">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Direct Bank Portals</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body-md">
                Get direct access to exclusive preferential interest rates and priority sanctioning channels from our partner banks.
              </p>
            </div>
          </div>

          {/* Card 2 - Highlighted Dark Card */}
          <div className="p-8 bg-primary text-white rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-10 text-white pointer-events-none">
              <span className="material-symbols-outlined text-[140px]">description</span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold mb-6 shadow-sm">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <h3 className="text-xl font-bold text-gold mb-3">Paperless Workflow</h3>
              <p className="text-white/80 text-sm leading-relaxed font-body-md">
                Skip the documentation stress. Our senior mortgage advisors handle the legal vetting, property clearance, and paperwork end-to-end.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-6 shadow-sm">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Maximized Eligibility</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body-md">
                We structure your financial application strategically to ensure you receive the maximum loan approval for your profile with flexible EMIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator & Callback Form Section */}
      <section className="bg-surface-container-low py-section-gap border-t border-b border-outline-variant/30 scroll-mt-24" id="calculator">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: EMI Calculator UI (8 Cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-gold text-3xl">calculate</span>
                <div>
                  <h2 className="text-2xl font-bold text-primary">Interactive EMI Calculator</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">Adjust the sliders to estimate your monthly payments and interest structure.</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">LOAN AMOUNT (₹)</label>
                    <span className="text-primary font-bold text-xl">{formatINR(loanAmount)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500000" 
                    max="100000000" 
                    step="500000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant/75 mt-2 font-semibold">
                    <span>₹5 Lakhs</span>
                    <span>₹50 Lakhs</span>
                    <span>₹10 Crores</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">TENURE (YEARS)</label>
                    <span className="text-primary font-bold text-xl">{tenureYears} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant/75 mt-2 font-semibold">
                    <span>1 Year</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">INTEREST RATE (% P.A.)</label>
                    <span className="text-primary font-bold text-xl">{interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5.0" 
                    max="15.0" 
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant/75 mt-2 font-semibold">
                    <span>5.0%</span>
                    <span>8.5%</span>
                    <span>15.0%</span>
                  </div>
                </div>
              </div>

              {/* Calculator Summary */}
              <div className="mt-10 pt-8 border-t border-outline-variant/30 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Monthly EMI</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatINR(emi)}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Principal Amount</p>
                  <p className="text-xl font-bold text-primary">{formatINR(loanAmount)}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-amber-700">{formatINR(totalInterest)}</p>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-emerald-700">Principal ({principalPercent}%)</span>
                  <span className="text-amber-700">Interest ({interestPercent}%)</span>
                </div>
                <div className="h-3 rounded-full bg-outline-variant/30 flex overflow-hidden">
                  <div style={{ width: `${principalPercent}%` }} className="bg-emerald-600 h-full" />
                  <div style={{ width: `${interestPercent}%` }} className="bg-amber-600 h-full" />
                </div>
              </div>
            </div>

            {/* Right: Callback Form (5 Cols) */}
            <div className="lg:col-span-5 scroll-mt-24" id="enquiry">
              <div className="bg-primary p-8 md:p-10 rounded-xl text-white shadow-xl">
                <h3 className="text-2xl font-bold text-gold mb-2 font-display-lg">Get Pre-Approved</h3>
                <p className="text-xs text-white/80 mb-6 leading-relaxed">
                  Submit your details to receive a priority callback within 2 hours from our senior mortgage specialist.
                </p>

                {formSubmitted ? (
                  <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10 p-6">
                    <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <h4 className="text-lg font-bold text-white mb-2">Request Received!</h4>
                    <p className="text-xs text-white/80">
                      Thank you, <strong>{callbackForm.name}</strong>. Our senior financial advisor will call you at <strong>{callbackForm.phone}</strong> shortly.
                    </p>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="mt-6 bg-gold text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors cursor-pointer border-none"
                    >
                      New Calculation Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-white/70 block mb-1">Full Name *</label>
                      <input 
                        type="text"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors" 
                        placeholder="John Doe"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-white/70 block mb-1">Mobile Number *</label>
                      <input 
                        type="tel"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors" 
                        placeholder="+91 98765 43210"
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-white/70 block mb-1">Email Address *</label>
                      <input 
                        type="email"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors" 
                        placeholder="john@example.com"
                        value={callbackForm.email}
                        onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                      />
                    </div>

                    {/* Selected Loan Snapshot from Calculator */}
                    <div className="p-4 bg-white/10 rounded-lg border border-white/10 my-4">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gold mb-1">Selected Loan Estimate</p>
                      <p className="font-bold text-white text-sm">
                        {formatINR(loanAmount)} for {tenureYears} years @ {interestRate}%
                      </p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gold text-primary font-label-bold text-xs py-4 rounded hover:bg-gold-dark transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer border-none font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-base">sync</span> Processing...
                        </>
                      ) : (
                        <>
                          Request Priority Callback <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-white/60 pt-2">
                      No impact on credit score. 100% Secure & Confidential.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Safety & Institutional Assurance */}
      <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-10 md:p-16 text-center rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold text-primary mb-4 font-display-lg">Secure Your Home with Confidence</h2>
          <p className="max-w-2xl mx-auto text-on-surface-variant text-sm mb-10 leading-relaxed">
            Beyond just numbers, we provide end-to-end legal title vetting and door-step banker coordination to ensure your investment is safe and hassle-free.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-bold text-primary text-sm">Lowest Market Rates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-bold text-primary text-sm">ZERO Advisory Fee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-bold text-primary text-sm">Doorstep Assistance</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-bold text-primary text-sm">Legal Title Clearance</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
