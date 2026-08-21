'use client';

import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { VideoShowcaseSection } from './VideoShowcaseSection';
import { InteractiveLedgerTeaser } from './InteractiveLedgerTeaser';
import { FeatureGrid } from './FeatureGrid';
import { PricingSection } from './PricingSection';
import { TrustSecuritySection } from './TrustSecuritySection';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <LandingHeader />
      <main>
        <HeroSection />
        <VideoShowcaseSection />
        <InteractiveLedgerTeaser />
        <FeatureGrid />
        <PricingSection />
        <TrustSecuritySection />
      </main>
      <LandingFooter />
    </div>
  );
}
