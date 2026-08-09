import React, { useState } from 'react';
import { CAREERS } from '../data/careers';

export default function Career() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [applicantName, setApplicantName] = useState('');

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        
        {/* Hero Section */}
        <section className="mt-8 mb-12 text-center">
          <span className="text-[11px] tracking-[0.2em] font-bold text-secondary uppercase block mb-3">careers at questspaces</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Shape the Future of Real Estate Advisory
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Join a dynamic, growth-focused team where innovation, client satisfaction, and professional excellence drive everything we do in Bengaluru.
          </p>
        </section>

        {/* Why Work With Us */}
        <section className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm mb-16">
          <h2 className="font-headline-md text-headline-md text-primary text-center mb-8">
            Why Build Your Career With Quest Spaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <span className="material-symbols-outlined text-secondary text-[36px] mb-3">trending_up</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">High Growth</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body-md">Fast-track career progression in high-ticket luxury real estate markets.</p>
            </div>
            <div className="text-center p-4">
              <span className="material-symbols-outlined text-secondary text-[36px] mb-3">groups</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Mentorship</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body-md">Work directly alongside founder Vivek Anand and senior industry strategists.</p>
            </div>
            <div className="text-center p-4">
              <span className="material-symbols-outlined text-secondary text-[36px] mb-3">workspace_premium</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Incentives</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body-md">Industry-leading commission structures, bonuses, and performance rewards.</p>
            </div>
          </div>
        </section>

        {/* Active Openings */}
        <section className="mb-12">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            Active Job Openings ({CAREERS.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {CAREERS.map((job) => (
              <div key={job.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full font-label-sm text-label-sm text-secondary uppercase tracking-wider">{job.department}</span>
                    <span className="px-3 py-1 bg-primary text-white rounded-full font-label-sm text-label-sm uppercase tracking-wider">{job.type}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-xs font-semibold text-on-surface-variant mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {job.location}</span>
                    <span>Exp: {job.experience}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body-md mb-6">
                    {job.summary}
                  </p>
                </div>

                <button 
                  onClick={() => { setSelectedJob(job); setApplied(false); }}
                  className="w-full bg-primary text-white py-3 font-label-bold text-label-bold uppercase tracking-wider rounded-lg hover:bg-primary-container transition-colors cursor-pointer border-none"
                >
                  Apply for Position
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Application Modal */}
        {selectedJob && (
          <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedJob(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
              
              {applied ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[56px] text-green-600 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">
                    Application Submitted!
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-6">
                    Thank you, {applicantName}. Our recruitment team will review your CV for <strong>{selectedJob.title}</strong> and reach out shortly.
                  </p>
                  <button onClick={() => setSelectedJob(null)} className="w-full bg-primary text-white py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer border-none">
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">
                    Apply for {selectedJob.title}
                  </h3>
                  <p className="text-xs font-semibold text-secondary mb-6">
                    {selectedJob.department} | {selectedJob.location}
                  </p>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="applicant-name">Full Name *</label>
                      <input 
                        id="applicant-name"
                        type="text" 
                        required 
                        className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                        placeholder="e.g. Priya Nair"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="applicant-email">Email Address *</label>
                      <input 
                        id="applicant-email"
                        type="email" 
                        required 
                        className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                        placeholder="name@domain.com" 
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="applicant-phone">Phone Number *</label>
                      <input 
                        id="applicant-phone"
                        type="tel" 
                        required 
                        className="w-full bg-surface-bright border-b border-outline-variant/50 focus:border-primary-container focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors outline-none" 
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="applicant-resume">Upload Resume (PDF/DOC) *</label>
                      <input 
                        id="applicant-resume"
                        type="file" 
                        required 
                        className="w-full font-body-md text-on-surface outline-none py-2" 
                        accept=".pdf,.doc,.docx" 
                      />
                      <p className="text-[11px] text-on-surface-variant mt-1">Maximum file size: 5MB</p>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-lg font-label-bold text-label-bold uppercase tracking-widest hover:bg-primary-container transition-colors shadow-sm mt-4 cursor-pointer border-none flex justify-center items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">send</span> Submit Career Application
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
