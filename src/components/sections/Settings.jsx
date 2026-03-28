import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  HardDrive,
  RotateCcw,
  Trash2,
  Trash,
  Shield,
  FileText,
  Copyright,
  Tag,
  AlertTriangle,
  Lock,
  Bell,
  Database,
  Info,
  Mail,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

// ── Shared label style matching PlayerProfile ──
const sectionHeaderClass =
  "text-[9px] font-black uppercase tracking-widest text-football-text/60 mb-2 mt-6 first:mt-0";

const itemTitleClass =
  "text-xs font-black uppercase tracking-wide text-football-text";
const itemDescClass =
  "text-[10px] text-football-text/70 mt-0.5 leading-relaxed";

// ── Reusable setting row ──
function SettingRow({
  icon: Icon,
  title,
  description,
  onClick,
  danger = false,
  rightEl,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 py-3 px-0 text-left transition-opacity hover:opacity-70 active:opacity-50"
    >
      <div className="mt-0.5 flex-shrink-0">
        <Icon
          size={14}
          style={{
            color: danger ? "#dc2626" : "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${itemTitleClass} ${danger ? "text-red-600" : ""}`}>
          {title}
        </p>
        {description && <p className={itemDescClass}>{description}</p>}
      </div>
      {rightEl || (
        <ChevronRight
          size={12}
          style={{ color: "var(--text-primary)", marginTop: 2 }}
        />
      )}
    </button>
  );
}

// ── Divider ──
function Divider() {
  return <div className="border-t border-football-text/10" />;
}

// ── Confirm Modal ──
function ConfirmModal({ open, title, message, warning, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-[24px] border border-football-subtle p-6 space-y-4 bg-football-card shadow-2xl">
        <div className="flex items-start justify-between">
          <p className="text-sm font-black uppercase tracking-widest text-football-text">
            {title}
          </p>
          <button onClick={onCancel}>
            <X size={16} style={{ color: "var(--text-primary)" }} />
          </button>
        </div>
        <p className={itemDescClass}>{message}</p>
        {warning && (
          <div className="border border-red-600 p-3">
            <p className="text-[10px] font-black uppercase text-red-600 leading-relaxed">
              ⚠ {warning}
            </p>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-football-subtle text-football-text rounded-xl hover:bg-football-text/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Item ──
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-football-text/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-3 gap-3 text-left"
      >
        <p className={itemTitleClass}>{question}</p>
        {open ? (
          <ChevronUp
            size={12}
            style={{
              color: "var(--text-primary)",
              flexShrink: 0,
              marginTop: 2,
            }}
          />
        ) : (
          <ChevronDown
            size={12}
            style={{
              color: "var(--text-primary)",
              flexShrink: 0,
              marginTop: 2,
            }}
          />
        )}
      </button>
      {open && <p className={`${itemDescClass} pb-3`}>{answer}</p>}
    </div>
  );
}

// ── Main Settings Page ──
export function Settings() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // { type: 'page' | 'all' }
  const [showFaq, setShowFaq] = useState(false);

  const handleResetPage = () => setModal("page");
  const handleResetAll = () => setModal("all");

  const confirmAction = () => {
    if (modal === "page") {
      // TODO: wire to your reset page logic
      console.log("Reset page data");
    } else if (modal === "all") {
      // TODO: wire to your reset all logic
      console.log("Reset all app data");
    }
    setModal(null);
  };

  const faqs = [
    {
      q: "What is Touches™?",
      a: "Touches™ is a player development tool designed to track match interactions, technical actions, and self-reflection metrics.",
    },
    {
      q: "Does Touches™ track my location?",
      a: "No. The app does not use GPS or location services.",
    },
    {
      q: "Does the app record video or audio?",
      a: "No. Touches™ does not access the camera or microphone.",
    },
    {
      q: "Where is my data stored?",
      a: "All data is stored locally on your device.",
    },
    {
      q: "Is my data shared with third parties?",
      a: "No. Touches™ does not sell or distribute user data.",
    },
    {
      q: "Can I export my session results?",
      a: "Yes. Users may generate PDFs and save reports to their device.",
    },
    {
      q: "Can I delete my data?",
      a: "Yes. You may reset data directly within the app or submit a deletion request.",
    },
    {
      q: "Does Touches™ evaluate player ability?",
      a: "Touches™ provides structured tracking and reflection tools. It does not guarantee performance outcomes or selection decisions.",
    },
    {
      q: "Is Touches™ a scouting platform?",
      a: "No. The app is strictly an educational and tracking utility.",
    },
    {
      q: "Why are permissions not required?",
      a: "Touches™ is designed to function without accessing sensitive device features.",
    },
    {
      q: "What happens if I reset data accidentally?",
      a: "Reset actions are permanent. The app displays confirmation warnings before deletion.",
    },
    {
      q: "Is Touches™ suitable for young players?",
      a: "Yes. The app may be used under parental or coach supervision.",
    },
    {
      q: "Who operates Touches™?",
      a: "Touches™ is operated by Footballer Athletics™, developed by Clem Murdock.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-4 pb-20 pt-6">
        {/* ── Page Title ── */}
        <h1 className="text-2xl font-black uppercase tracking-widest text-football-text border-b-2 border-football-text pb-2 mb-2">
          Settings
        </h1>

        {/* ════════════════════════════════
            ACCOUNT
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Account</p>
        <SettingRow
          icon={User}
          title="Profile"
          description="View and manage player-related information stored on this device."
          onClick={() => navigate("/register")}
        />
        <Divider />
        <SettingRow
          icon={LogOut}
          title="Sign Out"
          description="Exit the current user session."
          onClick={() => navigate("/register")}
          danger
        />

        {/* ════════════════════════════════
            DATA MANAGEMENT
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Data Management</p>
        {/* <SettingRow
          icon={HardDrive}
          title="Local Data Storage"
          description="Touches™ stores session data locally on your device. No centralised user database is maintained."
          onClick={() => {}}
          rightEl={<span />}
        /> */}
        {/* <Divider />
        <SettingRow
          icon={RotateCcw}
          title="Undo Last Action"
          description="Reverses only the most recent touch entry or counter action."
          onClick={() => {}}
        /> */}
        {/* <Divider />
        <SettingRow
          icon={Trash2}
          title="Reset Page Data"
          description="Clears all visible fields and counters on the current screen."
          onClick={handleResetPage}
          danger
        /> */}
        <Divider />
        <SettingRow
          icon={Trash}
          title="Reset All App Data"
          description="Permanently deletes all Touches™ data stored on this device, including stats, reflections, evaluations, grades, and counters."
          onClick={handleResetAll}
          danger
        />

        {/* ════════════════════════════════
            PRIVACY & LEGAL
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Privacy & Legal</p>
        <SettingRow
          icon={Shield}
          title="Privacy Policy"
          description="View how Touches™ handles user-entered information and device data."
          onClick={() => navigate("/policy")}
        />
        {/* <Divider />
        <SettingRow
          icon={FileText}
          title="Terms & Conditions"
          description="Rules governing acceptable use of the application."
          onClick={() => navigate("/terms")}
        />
        <Divider />
        <SettingRow
          icon={Copyright}
          title="Copyright Notice"
          description="Ownership and intellectual property protection details."
          onClick={() => navigate("/copyright")}
        />
        <Divider /> */}
        {/* <SettingRow
          icon={Tag}
          title="Trademark Notice"
          description="Touches™ and Footballer Athletics™ brand protections."
          onClick={() => navigate("/trademark")}
        /> */}
        {/* <Divider />
        <SettingRow
          icon={AlertTriangle}
          title="Disclaimer"
          description="Limitations of functionality, liability, and usage scope."
          onClick={() => navigate("/disclaimer")}
        /> */}

        {/* ════════════════════════════════
            PERMISSIONS & ACCESS
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Permissions & Access</p>
        <div className="p-4 border border-football-text/10 bg-football-card rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-football-text mb-2">
            Touches™ does NOT require or request access to:
          </p>
          {[
            "Location Services",
            "Camera",
            "Microphone",
            "Contacts",
            "Photos / Media",
            "Background Tracking",
          ].map((item) => (
            <p
              key={item}
              className="text-[10px] text-football-text/80 leading-relaxed"
            >
              · {item}
            </p>
          ))}
          <p className="text-[10px] font-black uppercase tracking-widest text-football-text mt-3">
            All data is manually entered by the user.
          </p>
        </div>

        {/* ════════════════════════════════
            NOTIFICATIONS
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Notifications</p>
        <div className="p-4 border border-football-text/10 bg-football-card rounded-2xl">
          <p className="text-[10px] text-football-text/80 leading-relaxed">
            Touches™ does not send push notifications or background alerts.
          </p>
        </div>

        {/* ════════════════════════════════
            STORAGE & PERFORMANCE
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Storage & Performance</p>
        <SettingRow
          icon={Database}
          title="Clear Temporary Cache"
          description="Removes temporary session values without deleting saved reports or PDFs."
          onClick={() => {}}
        />

        {/* ════════════════════════════════
            APP INFORMATION
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>App Information</p>
        <div className="p-4 border border-football-text/10 bg-football-card rounded-2xl">
          <p className="text-[10px] text-football-text/80">
            Touches™ Version 1.0 (Build 001)
          </p>
        </div>

        {/* ════════════════════════════════
            CONTACT & SUPPORT
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Contact & Support</p>
        <SettingRow
          icon={Mail}
          title="Support / Privacy Requests"
          description="footballerathleticss@gmail.com"
          onClick={() => window.open("mailto:footballerathleticss@gmail.com")}
        />

        {/* ════════════════════════════════
            DATA & PRIVACY
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Data & Privacy</p>
        <SettingRow
          icon={Lock}
          title="Data Control & Deletion"
          description="Submit a request to have your data reviewed or permanently deleted."
          onClick={() => {}}
        />

        {/* ════════════════════════════════
            TRADEMARK / LEGAL BLOCK
        ════════════════════════════════ */}
        <p className={sectionHeaderClass}>Trademark</p>
        <div className="p-4 border border-football-text/10 space-y-2 bg-football-card rounded-2xl">
          <p className="text-[10px] text-football-text/80 leading-relaxed">
            © 2026 ClemMurdock – Footballer Athletics™. All Rights Reserved.
          </p>
          <p className="text-[10px] text-football-text/80 leading-relaxed">
            Touches™, Footballer Athletics™, and PlayLikeU™ are protected
            trademarks by Clem Murdock.
          </p>
          <p className="text-[10px] text-football-text/80 leading-relaxed">
            Touches™ is not affiliated with FIFA, UEFA, Apple, Google, or any
            governing body.
          </p>
        </div>

        {/* ════════════════════════════════
            FAQ SECTION
        ════════════════════════════════ */}
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between mt-6 pb-2 border-b-2 border-football-text"
        >
          <div className="text-left">
            <p className="text-2xl font-black uppercase tracking-widest text-football-text">
              FAQ
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-football-text/60">
              — Touches™
            </p>
          </div>
          {showFaq ? (
            <ChevronUp size={18} style={{ color: "var(--text-primary)" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "var(--text-primary)" }} />
          )}
        </button>

        {showFaq && (
          <div className="mt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-football-text/60 mb-3">
              Frequently Asked Questions
            </p>
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm Modals ── */}
      <ConfirmModal
        open={modal === "page"}
        title="Reset Page Data"
        message="Are you sure you want to clear all values on this screen? This action cannot be undone."
        onConfirm={confirmAction}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal === "all"}
        title="Reset All App Data"
        message="This will permanently delete ALL Touches™ data stored on this device."
        warning="Deleted items include: Stats · Counters · Reflections · Evaluations · Grades · Reports. This action cannot be reversed."
        onConfirm={confirmAction}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
