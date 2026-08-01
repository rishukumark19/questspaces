import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentType: 'Residential Purchase',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased">
      
      {/* Hero Section */}
      <section className="relative h-[450px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="QuestSpaces Office Interior" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASUlSSv1niRvo_jQT1cpjOYQ2LLDY6NjwpSzMTHkv_DCldJ3nY84ZLwL6q3i8C6jj-vcUp4fwMs1S-X57x-MJT2U-x5mDOLXSyqZ-436ylIxLVApr39CP37YM5cPB8TeVe2p5izrhouhLTtvxmbcuXfAhnKZIY3J-sLJlH5_s7M_CXnIsbsHqvyJeuj_mtWpitmEHqvkO-jPMF1ip7OFmdy2iYukr-bn1jxIW1S1mEYcMASUBonT_VyPlREruyWNDrieQQrx5SVveA" 
          />
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full text-white text-center">
          <div className="max-w-2xl mx-auto">
            <span className="font-label-bold text-label-sm tracking-[0.2em] uppercase mb-4 block text-gold">
              Personalized Advisory
            </span>
            <h1 className="font-display-lg text-[40px] md:text-[56px] font-bold mb-6 leading-tight text-white">
              Get a Free Consultation
            </h1>
            <p className="font-body-lg text-body-lg opacity-90 max-w-xl mx-auto leading-relaxed text-white/90">
              Connect with our premier real estate experts to discuss your property investment goals, luxury home search, or portfolio management needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Split Layout */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Contact Details */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4 font-display-lg">
                Connect with Excellence
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Our team of dedicated advisors is ready to provide you with the insight and data required for informed real estate decisions in Bengaluru's most prestigious corridors.
              </p>
            </div>

            <div className="space-y-8">
              {/* Corporate Office */}
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h3 className="font-label-bold text-label-bold text-primary font-bold mb-1">Corporate Office</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Embassy One, 8, Ground Floor, Bellary Road, Ganganagar,<br />Bengaluru, Karnataka - 560032
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <h3 className="font-label-bold text-label-bold text-primary font-bold mb-1">Email Us</h3>
                  <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-sm" href="mailto:info@questspaces.in">
                    info@questspaces.in
                  </a>
                  <p className="text-xs text-on-surface-variant/70 mt-1 italic">Average response time: 2 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <h3 className="font-label-bold text-label-bold text-primary font-bold mb-1">Direct Line</h3>
                  <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="tel:+917411736908">
                    +91 74117 36908
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-[#25D366] shrink-0 shadow-sm group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.573-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.14 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-label-bold text-label-bold text-primary font-bold mb-1">WhatsApp Support</h3>
                  <a 
                    className="font-body-md text-on-surface-variant hover:text-primary transition-colors text-sm underline" 
                    href="https://wa.me/917411736908?text=Hello%20Questspaces%20Team%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20Bengaluru%20properties."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instant WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>

            {/* Social Follow */}
            <div className="pt-8 border-t border-outline-variant/30">
              <h3 className="font-label-bold text-label-sm text-primary mb-4 uppercase tracking-wider font-bold">Follow Our Portfolio</h3>
              <div className="flex gap-3">
                <a href="https://facebook.com/questspacespvt.ltd/" target="_blank" rel="noreferrer" aria-label="Follow QuestSpaces on Facebook" className="w-10 h-10 border border-outline-variant/50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com/questspaces/" target="_blank" rel="noreferrer" aria-label="Follow QuestSpaces on Instagram" className="w-10 h-10 border border-outline-variant/50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://linkedin.com/company/questspaces-private-limited/" target="_blank" rel="noreferrer" aria-label="Follow QuestSpaces on LinkedIn" className="w-10 h-10 border border-outline-variant/50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.262-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-low p-8 md:p-12 rounded-xl shadow-sm border border-outline-variant/30">
              <h2 className="text-2xl font-bold text-primary mb-8 font-display-lg">Send an Inquiry</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-[56px] text-green-600 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    Inquiry Sent Successfully!
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    Thank you, <strong>{formData.name}</strong>. A QuestSpaces Senior Advisor will reach out to you at <strong>{formData.email}</strong> / <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer border-none"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="contact-name">Full Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required 
                      className="w-full bg-white border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="contact-email">Email Address *</label>
                    <input 
                      id="contact-email"
                      type="email" 
                      required 
                      className="w-full bg-white border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="contact-phone">Phone Number *</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      required 
                      className="w-full bg-white border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="contact-topic">Investment Type</label>
                    <select 
                      id="contact-topic"
                      className="w-full bg-white border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                      value={formData.investmentType}
                      onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })}
                    >
                      <option value="Residential Purchase">Residential Purchase</option>
                      <option value="Commercial Leasing">Commercial Leasing</option>
                      <option value="Property Management">Property Management</option>
                      <option value="Investment Advisory">Investment Advisory</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant font-bold block" htmlFor="contact-message">Your Message *</label>
                    <textarea 
                      id="contact-message"
                      rows={5} 
                      required 
                      className="w-full bg-white border border-outline-variant/40 rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary transition-all text-sm resize-none"
                      placeholder="Tell us more about what you're looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-label-bold text-xs py-4 rounded-lg hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer border-none font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-base">sync</span> Sending...
                        </>
                      ) : (
                        <>
                          Send Message <span className="material-symbols-outlined text-base">send</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[480px] relative border-t border-b border-outline-variant/30">
        <iframe 
          title="Questspaces Headquarters Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0093859737976!2d77.58988627588665!3d13.035070213483015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17bd45c6126b%3A0xe54d9b23b5d3880!2sEmbassy%20One!5e0!3m2!1sen!2sin!4v1700000000000" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute bottom-8 left-8 bg-white p-6 rounded-xl shadow-xl max-w-sm border-l-4 border-gold z-10">
          <h4 className="font-headline-sm text-lg font-bold text-primary mb-1">Our Bengaluru Hub</h4>
          <p className="font-body-md text-xs text-on-surface-variant mb-4 leading-relaxed">
            Located at Embassy One, Bellary Road, Ganganagar - North Bangalore's technology corridor.
          </p>
          <a 
            className="inline-flex items-center gap-1.5 font-label-bold text-xs text-primary font-bold hover:text-gold transition-colors" 
            href="https://maps.google.com/?q=Embassy+One,+Bellary+Road,+Ganganagar,+Bengaluru+-+560032" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Get Directions <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
      </section>

      {/* FAQ / Quick Links Section */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3 font-display-lg">Quick Assistance</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-sm">
              Common inquiries and navigation to help you find information faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {/* Property Search */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">domain</span> Property Search
              </h3>
              <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                <li><Link className="hover:text-primary transition-colors" to="/properties">Residential Listings</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/properties">Commercial Opportunities</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/properties">New Launch Projects</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/properties">Luxury Apartments</Link></li>
              </ul>
            </div>

            {/* Client Support */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">support_agent</span> Client Support
              </h3>
              <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                <li><Link className="hover:text-primary transition-colors" to="/home-loan">Home Loan Eligibility</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/services">Documentation Guide</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/services">Tax & Legal Compliance</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/contact">Post-Sales Service</Link></li>
              </ul>
            </div>

            {/* Corporate */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">corporate_fare</span> Corporate
              </h3>
              <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                <li><Link className="hover:text-primary transition-colors" to="/contact">Become a Partner</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/career">Career Opportunities</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/about">Press & Media</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
