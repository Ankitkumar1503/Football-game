import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { SectionActionBar } from '../ui/SectionActionBar';

function CollapsibleSection({ number, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View className="border-b border-white/10">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between py-3"
      >
        <Text className="text-xs font-black uppercase tracking-wider text-white">
          {number && <Text className="text-white/60 mr-1">{number}. </Text>}
          {title}
        </Text>
        {open ? (
          <ChevronUp size={14} color="white" />
        ) : (
          <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
        )}
      </TouchableOpacity>

      {open && <View className="pb-4 space-y-2">{children}</View>}
    </View>
  );
}

export function Account() {
  return (
    <View className="space-y-4 pb-12">
      {/* ── Page Header ── */}
      <View className="border-b-2 border-white/20 pb-2">
        <Text className="text-2xl font-black uppercase tracking-widest text-white">
          Touches™ App
        </Text>
        <Text className="text-[10px] text-white/60 mt-0.5">
          © Footballer Athletics™ All Rights Reserved.
        </Text>
      </View>

      {/* ── 1. PRIVACY POLICY ── */}
      <CollapsibleSection number="1" title="Privacy Policy" defaultOpen>
        <Text className="text-[10px] font-black uppercase text-yellow-400">
          Effective Date: January 1, 2026
        </Text>

        <Text className="text-[10px] font-black uppercase text-white mt-2">
          1.1 Introduction
        </Text>
        <Text className="text-[10px] text-white/80 leading-relaxed">
          Touches™ is a player development and match reflection application operated by Footballer Athletics™, founded by Coach Clem Murdock. This Privacy Policy explains how we collect, use, store, and protect information on your mobile device.
        </Text>

        <Text className="text-[10px] font-black uppercase text-white mt-2">
          1.2 Information We Collect
        </Text>
        <Text className="text-[10px] text-white/80 leading-relaxed">
          • Player name or nickname, age, club, team, position{'\n'}
          • Touches and match action logs{'\n'}
          • Reflections, evaluations, and notes to coach{'\n'}
          We do not collect GPS location, contacts, photos, audio, or video recordings.
        </Text>

        <Text className="text-[10px] font-black uppercase text-white mt-2">
          1.3 Children's Privacy (COPPA Compliance)
        </Text>
        <Text className="text-[10px] text-white/80 leading-relaxed">
          Touches™ is designed for football development and may be used by players under 13 with parental or coach supervision. We do not sell or distribute personal data of minors.
        </Text>

        <Text className="text-[10px] font-black uppercase text-white mt-2">
          1.4 Contact Information
        </Text>
        <Text className="text-[10px] text-white/80 leading-relaxed">
          Email: footballerathleticss@gmail.com{'\n'}
          Subject: Touches Mobile – Privacy Inquiry
        </Text>
      </CollapsibleSection>

      {/* ── 2. DATA RETENTION & SECURITY ── */}
      <CollapsibleSection number="2" title="Data Storage & Security">
        <Text className="text-[10px] text-white/80 leading-relaxed">
          All match logs, notes, evaluations, and player profiles are stored in device-encrypted storage. No unencrypted third-party trackers are used.
        </Text>
      </CollapsibleSection>

      {/* ── 3. USER RIGHTS ── */}
      <CollapsibleSection number="3" title="Your Rights (GDPR & CCPA)">
        <Text className="text-[10px] text-white/80 leading-relaxed">
          You have full ownership of your athletic data. You may export PDF copies or completely erase your records anytime from Settings.
        </Text>
      </CollapsibleSection>

      {/* Action Bar */}
      <SectionActionBar sectionKey="account" />
    </View>
  );
}

export default Account;
