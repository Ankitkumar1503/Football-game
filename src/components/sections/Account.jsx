import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Share2, FileDown, Save, ChevronDown, ChevronUp } from "lucide-react";

// ── Shared styles ──
const sectionTitleClass =
  "text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] mt-6 mb-1";
const subHeadingClass =
  "text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)] mt-4 mb-1";
const bodyClass =
  "text-[10px] text-[var(--text-secondary)] leading-relaxed";
const accentClass =
  "text-[10px] font-black uppercase tracking-wider text-[var(--color-accent)]";

function Divider() {
  return <div className="border-t border-[var(--border-color)] my-4" />;
}

// ── Collapsible Section ──
function Section({ number, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border-color)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)]">
          {number && <span className="text-[var(--color-accent)] mr-1">{number}.</span>}
          {title}
        </p>
        {open
          ? <ChevronUp size={12} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
          : <ChevronDown size={12} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        }
      </button>
      {open && <div className="pb-4 space-y-2">{children}</div>}
    </div>
  );
}

export function Account() {
  const navigate = useNavigate();

  const handleSave = () => console.log("Save");
  const handleShare = () => console.log("Share");
  const handlePDF = () => console.log("PDF");
  const handleReset = () => console.log("Reset");

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-md mx-auto px-4 pt-6">

        {/* ── Page Header ── */}
        <div className="border-b-2 border-[var(--text-primary)] pb-2 mb-1">
          <h1 className="text-2xl font-black uppercase tracking-widest text-[var(--text-primary)]">
            Touches™ App
          </h1>
          <p className={bodyClass}>© Footballer Athletics™ All Rights Reserved.</p>
        </div>

        {/* ════════════════════════════════
            1. PRIVACY POLICY
        ════════════════════════════════ */}
        <Section number="1" title="Privacy Policy" defaultOpen>
          <p className={accentClass}>Effective Date: January 1, 2026</p>
          <p className={bodyClass}>Last Updated: January 1, 2026</p>

          <p className={subHeadingClass}>1.1 Introduction</p>
          <p className={bodyClass}>
            Touches™ ("we," "our," "us") is a player development and match reflection application
            operated by Footballer Athletics™, founded by Coach Clem Murdock. This Privacy Policy
            explains how we collect, use, store, and protect information when you use the Touches™
            mobile application. By using Touches™, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          <p className={subHeadingClass}>1.2 Information We Collect</p>
          <p className={bodyClass}>
            Information You Provide Directly: Player name or nickname, Age group (if entered),
            Team, club, position, and match details, Player reflections, evaluations, and notes.
            Data entered into stats, grades, and evaluations, PDF exports you choose to generate.
          </p>
          <p className={bodyClass}>
            Automatically Collected: App usage analytics (non-identifying), Device type and
            operating system, App performance and crash data.
          </p>

          <p className={subHeadingClass}>We do not collect</p>
          <p className={bodyClass}>
            Biometric data, GPS location tracking, Contact lists, Photos, audio, or video recordings.
          </p>

          <p className={subHeadingClass}>1.3 Children's Privacy (COPPA Compliance)</p>
          <p className={bodyClass}>
            Touches™ is designed for football development and may be used by players under 13
            only with parental or coach supervision. We do not knowingly collect personal contact
            information from children. All player data is entered manually by the user, parent, or
            coach. If you believe a child's personal information has been collected improperly,
            contact us immediately for removal.
          </p>

          <p className={subHeadingClass}>1.4 How We Use Information</p>
          <p className={bodyClass}>
            We use collected information to: Enable player stat tracking and evaluations, Generate
            PDFs and reports, Improve app functionality and performance, Provide technical support,
            Maintain app security and integrity. We do not collect sell or rent user data.
          </p>

          <p className={subHeadingClass}>1.5 Data Storage & Security</p>
          <p className={bodyClass}>
            Data is stored securely using industry-standard protections. We take reasonable measures
            to prevent unauthorised access. No system is 100% secure; use of the app is at your own risk.
          </p>

          <p className={subHeadingClass}>1.6 Data Sharing</p>
          <p className={bodyClass}>
            We do not share personal data with third parties except: When required by law, To
            protect legal rights and app security, With service providers strictly necessary to
            operate the app.
          </p>

          <p className={subHeadingClass}>1.7 Data Retention</p>
          <p className={bodyClass}>
            Data is NOT retained only what is necessary for app functionality. Users may request
            deletion at any time (see Section 5).
          </p>

          <p className={subHeadingClass}>1.8 Your Rights (GDPR / CCPA)</p>
          <p className={bodyClass}>
            You have the right to: Access your data, Request correction or deletion, Withdraw
            consent, Request a copy of stored data.
          </p>

          <p className={subHeadingClass}>1.9 Contact</p>
          <p className={bodyClass}>
            Email: footballerathleticss@gmail.com{"\n"}Subject Line: Touches App – Privacy Request
          </p>
        </Section>

        {/* ════════════════════════════════
            2. TERMS OF SERVICE
        ════════════════════════════════ */}
        <Section number="2" title="Terms of Service / Terms & Conditions">
          <p className={accentClass}>Effective Date: January 1, 2026</p>

          <p className={subHeadingClass}>2.1 Acceptance of Terms</p>
          <p className={bodyClass}>
            By downloading, accessing, or using Touches™, you agree to these Terms. If you do not
            agree, do not use the app.
          </p>

          <p className={subHeadingClass}>2.2 Purpose of the App</p>
          <p className={bodyClass}>
            Touches™ is an educational and development tool designed to support football training,
            reflection, and player development analysis.
          </p>
          <p className={bodyClass}>Touches™ is NOT: A medical tool. A scouting guarantee. A performance prediction system.</p>

          <p className={subHeadingClass}>2.3 User Responsibilities</p>
          <p className={bodyClass}>
            You agree to: Enter accurate information, Use the app lawfully, Supervise minors using
            the app. Not misuse, reverse-engineer, or copy the app.
          </p>

          <p className={subHeadingClass}>2.4 Prohibited Use</p>
          <p className={bodyClass}>
            You may not use Touches™ for unlawful purposes. Attempt to extract source code or
            data. Resell, sub license, or distribute the app. Upload harmful or offensive content.
          </p>

          <p className={subHeadingClass}>2.5 Intellectual Property</p>
          <p className={bodyClass}>
            All content, layout, logic, scoring systems, visuals, and structure are the exclusive
            property of Footballer Athletics™. Unauthorised reproduction, resale, or redistribution
            is strictly prohibited.
          </p>

          <p className={subHeadingClass}>2.6 Termination</p>
          <p className={bodyClass}>
            We reserve the right to suspend or terminate access for violations of these Terms.
          </p>

          <p className={subHeadingClass}>2.7 Disclaimer of Warranties</p>
          <p className={bodyClass}>
            Touches™ is provided "AS IS" without warranties of any kind. We do not guarantee
            uninterrupted service or error-free operation.
          </p>

          <p className={subHeadingClass}>2.8 Limitation of Liability</p>
          <p className={bodyClass}>
            Footballer Athletics™ shall not be liable for: Loss of data, Missed performance
            outcomes, Coaching or selection decisions, Injuries or training outcomes.
          </p>

          <p className={subHeadingClass}>2.9 Governing Law</p>
          <p className={bodyClass}>
            These Terms are governed by the law, without regard to conflict of law principles.
          </p>
        </Section>

        {/* ════════════════════════════════
            3. COPYRIGHT
        ════════════════════════════════ */}
        <Section number="3" title="Copyright Notice">
          <p className={bodyClass}>© 2026 Clem Murdock – Footballer Athletics™ All rights reserved.</p>
          <p className={bodyClass}>
            Touches™, Footballer Athletics™, PlayLikeU™, and all associated designs, systems, and
            terminology are protected intellectual property.
          </p>
        </Section>

        {/* ════════════════════════════════
            4. TRADEMARK
        ════════════════════════════════ */}
        <Section number="4" title="Trademark & Third-Party Disclaimer">
          <p className={bodyClass}>
            Touches™ and Footballer Athletics™ are trademarks of ClemMurdock. All third-party
            trademarks are property of their respective owners.
          </p>
          <p className={bodyClass}>
            This app is not affiliated with FIFA, UEFA, Apple, Google, or any football federation.
          </p>
        </Section>

        {/* ════════════════════════════════
            5. DATA DELETION
        ════════════════════════════════ */}
        <Section number="5" title="Data Deletion Instructions (App Store Required)">
          <p className={bodyClass}>Users may request deletion of their data at any time.</p>
          <p className={subHeadingClass}>How to Request Deletion</p>
          <div
            className="p-3 border border-[var(--border-color)]"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            {[
              "Open the Touches™ app",
              "Go to Settings → About → Data & Privacy",
              "Select: Request Data Deletion",
              "Or email: footballerathleticss@gmail.com",
            ].map((step, i) => (
              <p key={i} className={`${bodyClass} leading-loose`}>· {step}</p>
            ))}
            <p className={`${bodyClass} mt-2`}>Requests are processed within 30 days.</p>
          </div>
        </Section>

        {/* ════════════════════════════════
            6. MEDICAL DISCLAIMER
        ════════════════════════════════ */}
        <Section number="6" title="Medical & Performance Disclaimer">
          <p className={bodyClass}>
            Touches™ does not provide medical, fitness, or professional coaching advice. Always
            consult qualified professionals for: Medical concerns, Injury management, Training
            load decisions.
          </p>
        </Section>

        {/* ════════════════════════════════
            7. UPDATES
        ════════════════════════════════ */}
        <Section number="7" title="Updates to This Policy">
          <p className={bodyClass}>
            We may update these terms from time to time. Continued use of the app means acceptance
            of updates.
          </p>
        </Section>

        {/* ════════════════════════════════
            8. CONTACT
        ════════════════════════════════ */}
        <Section number="8" title="Contact Information">
          <p className={bodyClass}>Footballer Athletics™ TOUCHES</p>
          <p className={bodyClass}>Email: footballerathleticss@gmail.com</p>
        </Section>

      </div>

      {/* ════════════════════════════════
          BOTTOM ACTION BAR
      ════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-color)]"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-3">

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-70 transition-opacity"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-color)]"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <RotateCcw size={16} style={{ color: "var(--text-primary)" }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Reset
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-70 transition-opacity"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-color)]"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <Share2 size={16} style={{ color: "var(--text-primary)" }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Share
              </span>
            </button>

            {/* PDF */}
            <button
              onClick={handlePDF}
              className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-70 transition-opacity"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-color)]"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <FileDown size={16} style={{ color: "var(--text-primary)" }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                PDF
              </span>
            </button>

            {/* Save — accent highlighted */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1 min-w-[56px] hover:opacity-70 transition-opacity"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <Save size={16} style={{ color: "#fff" }} />
              </div>
              <span
                className="text-[9px] font-black uppercase tracking-wider"
                style={{ color: "var(--color-accent)" }}
              >
                Save
              </span>
            </button>

          </div>

          {/* Footer brand */}
          <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] pb-3">
            Footballer Athletics
          </p>
        </div>
      </div>
    </div>
  );
}