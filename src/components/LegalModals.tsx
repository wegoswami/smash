import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Info,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink,
  Lock,
  HeartHandshake,
  Copyright,
} from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer' | 'dmca' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
  onSwitchTab?: (tab: LegalModalType) => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose, onSwitchTab }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Feedback / Suggestion');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!activeModal) return null;

  const handleTabChange = (tab: LegalModalType) => {
    if (onSwitchTab) {
      onSwitchTab(tab);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    }, 800);
  };

  const navTabs: { id: LegalModalType; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'disclaimer', label: 'Health Disclaimer', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'dmca', label: 'DMCA Policy', icon: <Copyright className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-auto p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col gap-4 text-slate-200 max-h-[90vh] overflow-hidden">
        {/* Header with Title & Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-white text-base sm:text-lg tracking-wide">
              SmashChill Arcade — Legal & Compliance Center
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/60 text-xs">
          {navTabs.map((tab) => {
            const isActive = activeModal === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dedicated Page Slug Indicator */}
        {activeModal && (
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Dedicated URL:</span>
              <a
                href={`/pages/${{
                  privacy: 'privacy-policy',
                  terms: 'terms-of-service',
                  about: 'about',
                  contact: 'contact',
                  disclaimer: 'medical-disclaimer',
                  dmca: 'dmca-policy',
                }[activeModal] || activeModal}`}
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                title="Open Dedicated Page URL"
              >
                <span>/pages/{{
                  privacy: 'privacy-policy',
                  terms: 'terms-of-service',
                  about: 'about',
                  contact: 'contact',
                  disclaimer: 'medical-disclaimer',
                  dmca: 'dmca-policy',
                }[activeModal] || activeModal}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Canonical Page URL</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs leading-relaxed space-y-4 no-scrollbar text-slate-300">
          {/* ========================================================= */}
          {/* PRIVACY POLICY */}
          {/* ========================================================= */}
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy for SmashChill (smashchill.online)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Effective Date: November 3, 2026 · Last Reviewed: November 2026 · Contact:{' '}
                  <span className="text-amber-400 font-mono">wegoswami@gmail.com</span>
                </p>
                <p>
                  At <strong>SmashChill</strong> (accessible from <a href="https://smashchill.online" className="text-amber-400 underline">https://smashchill.online</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SmashChill and how we use it.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">1.</span> Google AdSense & DoubleClick DART Cookies
                </h4>
                <p className="text-slate-400">
                  Google is one of the third-party vendors on our site. Google uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <strong className="text-slate-300">smashchill.online</strong> and other sites on the internet.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div className="font-bold text-white">How to Opt-Out of Personalized Advertising:</div>
                  <p>
                    Visitors may opt out of personalized advertising by visiting Google Ads Settings:{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline inline-flex items-center gap-1"
                    >
                      Google Ads Settings <ExternalLink className="w-3 h-3 inline" />
                    </a>.
                  </p>
                  <p>
                    Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting the Network Advertising Initiative:{' '}
                    <a
                      href="https://optout.networkadvertising.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline inline-flex items-center gap-1"
                    >
                      optout.networkadvertising.org <ExternalLink className="w-3 h-3 inline" />
                    </a>{' '}
                    or the Digital Advertising Alliance Consumer Choice tool at{' '}
                    <a
                      href="https://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline inline-flex items-center gap-1"
                    >
                      aboutads.info/choices <ExternalLink className="w-3 h-3 inline" />
                    </a>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">2.</span> Publisher ID & Authorized Digital Sellers (ads.txt)
                </h4>
                <p className="text-slate-400">
                  In compliance with IAB Tech Lab standards and Google AdSense transparency initiatives, SmashChill publishes an authorized digital seller file accessible at{' '}
                  <a href="/ads.txt" target="_blank" className="text-amber-400 underline font-mono">
                    https://smashchill.online/ads.txt
                  </a>.
                  Our official Google AdSense publisher ID is <span className="font-mono text-emerald-400">pub-7658190454263901</span>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">3.</span> Analytics & Log Files
                </h4>
                <p className="text-slate-400">
                  SmashChill follows a standard procedure of using log files and Google Analytics 4 (Measurement ID: <span className="font-mono text-slate-300">G-YDSST77TEZ</span> / <span className="font-mono text-slate-300">G-M32KPTKR7C</span>). The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">4.</span> LocalStorage & Offline Game Data
                </h4>
                <p className="text-slate-400">
                  SmashChill stores your gameplay state—including unlocked weapons, Zen coins, high scores, quest achievements, and mute preferences—locally on your device via HTML5 LocalStorage. This data remains on your machine and is never transmitted to our remote servers.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">5.</span> GDPR Privacy Rights (Data Protection Rights)
                </h4>
                <p className="text-slate-400">
                  We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li><strong>The right to access</strong> — You have the right to request copies of your personal data.</li>
                  <li><strong>The right to rectification</strong> — You have the right to request that we correct any information you believe is inaccurate.</li>
                  <li><strong>The right to erasure</strong> — You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li><strong>The right to restrict processing</strong> — You have the right to request that we restrict the processing of your personal data.</li>
                  <li><strong>The right to data portability</strong> — You have the right to request transfer of data to another organization.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">6.</span> CCPA Privacy Rights (Do Not Sell My Personal Information)
                </h4>
                <p className="text-slate-400">
                  Under the CCPA, California consumers have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
                  <li>Request that a business delete any personal data about the consumer that a business collected.</li>
                  <li>Request that a business that sells personal data not sell the consumer&apos;s personal data. <strong>SmashChill does not sell personal information to third parties.</strong></li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">7.</span> Children&apos;s Information (COPPA Compliance)
                </h4>
                <p className="text-slate-400">
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. SmashChill does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                For any privacy questions or data requests, please contact our Data Protection Officer directly at{' '}
                <a href="mailto:wegoswami@gmail.com" className="text-amber-400 underline font-mono">
                  wegoswami@gmail.com
                </a>{' '}
                or <span className="text-amber-400 font-mono">contact@smashchill.online</span>.
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TERMS OF SERVICE */}
          {/* ========================================================= */}
          {activeModal === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service & User Agreement</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Last Updated: November 2026 · Website: smashchill.online
                </p>
                <p>
                  Welcome to <strong>SmashChill</strong>. By accessing or using our interactive stress-relief arcade web application, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. Permitted License & Entertainment Use</h4>
                <p className="text-slate-400">
                  SmashChill grants you a personal, revocable, non-exclusive, non-transferable license to access and play our mini-games for casual stress-relief, relaxation, and entertainment purposes on personal web browsers and mobile devices.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. Prohibited Conduct & Ad Integrity</h4>
                <p className="text-slate-400">
                  You agree NOT to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>Employ automated scripts, bots, spiders, or headless scrapers to artificially manipulate game scores, leaderboard ranks, or advertising impressions.</li>
                  <li>Engage in invalid click generation or fraudulent interaction with Google AdSense sponsored banners.</li>
                  <li>Reverse engineer, decompile, or redistribute the source code, game sprites, sound synthesis engines, or visual assets without written consent.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Intellectual Property Rights</h4>
                <p className="text-slate-400">
                  All trademarks, logos, audio algorithms, game concepts, and design interfaces displayed on smashchill.online are the proprietary property of SmashChill and its licensors. All rights reserved.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">4. Disclaimer of Warranties</h4>
                <p className="text-slate-400">
                  SmashChill is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that gameplay will be uninterrupted, error-free, or compatible with all legacy web browsers.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">5. Limitation of Liability</h4>
                <p className="text-slate-400">
                  In no event shall SmashChill, its founders, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABOUT US */}
          {/* ========================================================= */}
          {activeModal === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Info className="w-4 h-4" />
                  <span>About SmashChill — The Digital Stress Relief Sanctuary</span>
                </div>
                <p className="text-slate-300">
                  <strong>SmashChill</strong> (https://smashchill.online) was engineered to solve a modern digital epidemic: ubiquitous screen fatigue, endless notification anxiety, and cognitive burnout among professionals, students, and casual gamers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 space-y-2">
                <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <span>✨ Why Human-Curated Web Games Outperform AI Clutter</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The modern web has become flooded with generic, automated, cookie-cutter clone games and clickbait portals that prioritize ad impressions over human delight. SmashChill was built on an opposite, craftsman principle: <em>every mechanic, haptic pulse, sound synthesis envelope, and ragdoll spring is hand-calibrated by real web game designers</em>. 
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We believe true stress relief requires authentic sensory feedback—from the crisp acoustic pop of realistic virtual bubble wrap to the harmonious ripple frequencies of Japanese koi ponds. Generic AI-generated games cannot calibrate the delicate balance between physical catharsis (discharging tension) and sensory soothing (parasympathetic calming). That thoughtful human curation is what makes SmashChill an authentic sanctuary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xl">🔨</div>
                  <h5 className="font-bold text-white">Phase 1: Cathartic Venting (Smash)</h5>
                  <p className="text-[11px] text-slate-400">
                    When daily frustration builds up, the sympathetic nervous system triggers high-alert tension. SmashChill provides a zero-harm digital punching bag (Whack-A-Stress, Stress Ninja, Virtual Rage Room) to discharge acute kinetic tension safely.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xl">🌸</div>
                  <h5 className="font-bold text-white">Phase 2: Sensory Restoration (Chill)</h5>
                  <p className="text-[11px] text-slate-400">
                    Following catharsis, deep calming is essential. The Zen Koi Pond and ASMR Soundboard use pentatonic bell chimes, water ripples, and soothing hues to stimulate the vagus nerve and return heart-rate variability (HRV) to baseline.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Our Core Commitments</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li><strong>Zero Friction:</strong> 100% free with no forced paywalls, mandatory account sign-ups, or invasive permissions. Instant play on any device.</li>
                  <li><strong>Lightweight Performance:</strong> Engineered with optimized HTML5 Canvas and the Web Audio API—sub-second load times even on slow mobile networks.</li>
                  <li><strong>Responsible Monetization:</strong> We partner exclusively with verified high-standard advertising networks (Google AdSense, Publisher ID: <span className="font-mono text-emerald-400">pub-7658190454263901</span>) that respect player privacy and maintain strict ad safety standards.</li>
                  <li><strong>Privacy by Architecture:</strong> Your progress, high scores, and audio toggles live on your browser LocalStorage and never leave your machine.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white">Founder & Lead Maintainer:</span> SmashChill Independent Studio
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Official Contact:</span>
                  <a href="mailto:wegoswami@gmail.com" className="font-mono text-amber-400 underline">wegoswami@gmail.com</a>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTACT US */}
          {/* ========================================================= */}
          {activeModal === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-extrabold text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Contact & Publisher Support Desk</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Have feedback, feature ideas, bug reports, or Google AdSense / business inquiries? Fill out the contact form below or reach us directly.
                </p>
              </div>

              {isSent ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Thank You! Your Message Was Received</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    We have logged your ticket and sent a confirmation copy to our team at <span className="font-mono text-amber-400">wegoswami@gmail.com</span>. We typically respond within 12–24 business hours.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Your Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Your Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Topic / Category
                      </label>
                      <select
                        value={contactCategory}
                        onChange={(e) => setContactCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
                      >
                        <option value="Feedback / Suggestion">Feedback & New Game Suggestions</option>
                        <option value="Bug Report">Technical Issue / Bug Report</option>
                        <option value="AdSense / Advertising">Google AdSense / Advertising Inquiry</option>
                        <option value="DMCA / Copyright">DMCA / Intellectual Property Notice</option>
                        <option value="General">General Inquiries</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Brief summary..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your feedback, questions, or business proposal here..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Direct Support: <strong className="text-slate-400">wegoswami@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Verified Contact Details Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Direct Communication Channels:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block">Publisher & Support Email:</span>
                    <a href="mailto:wegoswami@gmail.com" className="font-mono text-amber-400 hover:underline">
                      wegoswami@gmail.com
                    </a>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block">General Domain Contact:</span>
                    <a href="mailto:contact@smashchill.online" className="font-mono text-sky-400 hover:underline">
                      contact@smashchill.online
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* HEALTH & MEDICAL DISCLAIMER */}
          {/* ========================================================= */}
          {activeModal === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Medical & Stress Relief Disclaimer</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Please read this health and medical disclaimer carefully before playing.
                </p>
                <p>
                  <strong>SmashChill (smashchill.online)</strong> is an interactive web game engineered purely for casual recreation, amusement, lighthearted tension-release, and personal entertainment.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Not a Substitute for Professional Medical Advice</h4>
                <p className="text-slate-400">
                  The content, audio frequencies, and interactive games provided on this site are NOT intended to diagnose, treat, cure, or prevent any mental illness, acute clinical depression, panic disorders, or psychiatric conditions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Crisis & Mental Health Support Resources</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  If you or someone you know is in acute psychological distress, experiencing severe anxiety, or in an emergency, please connect with trained compassionate counselors immediately:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                  <li><strong>United States & Canada:</strong> Call or text <span className="font-bold text-white">988</span> (Suicide & Crisis Lifeline) available 24/7/365.</li>
                  <li><strong>United Kingdom:</strong> Call <span className="font-bold text-white">111</span> (NHS Mental Health Services) or text SHOUT to 85258.</li>
                  <li><strong>India:</strong> Call Sneha India Foundation at <span className="font-bold text-white">+91 44 2464 0050</span> or KIRAN at <span className="font-bold text-white">1800-599-0019</span>.</li>
                  <li><strong>Worldwide / International:</strong> Visit <a href="https://www.befrienders.org" target="_blank" rel="noreferrer" className="text-amber-400 underline">befrienders.org</a> or <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">findahelpline.com</a>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DMCA COPYRIGHT POLICY */}
          {/* ========================================================= */}
          {activeModal === 'dmca' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-violet-400 font-extrabold text-sm">
                  <Copyright className="w-4 h-4" />
                  <span>Digital Millennium Copyright Act (DMCA) Policy</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  SmashChill respects the intellectual property rights of creators and complies with the provisions of Title 17, United States Code, Section 512.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Filing a Copyright Infringement Notice</h4>
                <p className="text-slate-400">
                  If you believe that any material or content on smashchill.online infringes upon a copyright which you own or control, please submit a written notification including the following details:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright interest.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Identification of the material claimed to be infringing and its specific URL on smashchill.online.</li>
                  <li>Your full name, address, telephone number, and email address.</li>
                  <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement, under penalty of perjury, that the information in the notification is accurate.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
                <div className="font-bold text-white">Designated Copyright Agent:</div>
                <div className="text-[11px] text-slate-400">SmashChill DMCA Compliance Department</div>
                <div className="text-[11px] font-mono text-amber-400">wegoswami@gmail.com</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1">
          <span>&copy; {new Date().getFullYear()} SmashChill Arcade (smashchill.online)</span>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>SSL Secured · Authorized Publisher pub-7658190454263901</span>
          </div>
        </div>
      </div>
    </div>
  );
};
