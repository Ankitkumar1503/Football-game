import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Share } from 'react-native';
import { RotateCcw, Share2, FileText, Save, Check, X, Layers, FileCode } from 'lucide-react-native';
import { useActiveSession } from '../../hooks/useActiveSession';
import { generateAndSharePdf } from '../../lib/pdfGenerator';

const SECTION_LABELS = {
  dashboard: 'Dashboard',
  stats: 'Player Stats',
  'touch-counter': 'Touch Counter',
  reflection: 'Player Reflection',
  evaluation: 'Player Evaluation',
  roster: 'Roster',
  lineup: 'Starting Lineup',
  'note-to-coach': 'Note to Coach',
  policy: 'Usage Policy',
  passport: 'Player Passport',
  challenge: '30-Day Challenge',
  'ai-agent': 'AI Player Agent',
  'match-prep': 'Match Day Prep',
};

export function SectionActionBar({ onReset, onSave, sectionKey = 'dashboard', data }) {
  const { session, stats, reflection } = useActiveSession();
  const [savedToast, setSavedToast] = useState(false);
  const [activeModalAction, setActiveModalAction] = useState(null); // 'pdf' | 'share' | null

  const sectionLabel = SECTION_LABELS[sectionKey] || 'Current Section';

  const handleSaveClick = () => {
    if (onSave) onSave();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleExecuteOption = async (scope) => {
    setActiveModalAction(null);
    if (activeModalAction === 'pdf') {
      await generateAndSharePdf({
        session,
        stats,
        reflection,
        sectionKey,
        section: scope === 'current' ? sectionLabel : 'Full Match',
        scope,
        data,
      });
    } else if (activeModalAction === 'share') {
      try {
        const playerName = session?.playerName || 'Player';
        const total = stats?.total || 0;
        await Share.share({
          title: `TOUCHES - ${sectionLabel}`,
          message: `Check out ${playerName}'s football session data on TOUCHES! Total touches: ${total}. Tracked on Footballer Athletics.`,
        });
      } catch (e) {
        console.log('Share canceled/error:', e);
      }
    }
  };

  return (
    <View className="pt-2 pb-1 border-t border-white/10 mt-3">
      {savedToast && (
        <View className="mb-2 py-1.5 px-3 rounded-lg bg-emerald-500 flex-row items-center justify-center gap-1 shadow-md">
          <Check size={14} color="white" />
          <Text className="text-white font-black text-xs uppercase tracking-wider">
            Session Saved!
          </Text>
        </View>
      )}

      <View className="flex-row justify-between gap-1.5">
        {/* Reset */}
        <TouchableOpacity
          onPress={onReset}
          className="flex-1 py-2 px-1 rounded-xl bg-[#141720] border border-white/15 flex-row items-center justify-center gap-1 active:scale-95"
        >
          <RotateCcw size={13} color="#D1D5DB" />
          <Text className="text-gray-300 font-black text-[10px] uppercase tracking-wider">
            RESET
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          onPress={() => setActiveModalAction('share')}
          className="flex-1 py-2 px-1 rounded-xl bg-[#141720] border border-white/15 flex-row items-center justify-center gap-1 active:scale-95"
        >
          <Share2 size={13} color="#D1D5DB" />
          <Text className="text-gray-300 font-black text-[10px] uppercase tracking-wider">
            SHARE
          </Text>
        </TouchableOpacity>

        {/* PDF */}
        <TouchableOpacity
          onPress={() => setActiveModalAction('pdf')}
          className="flex-1 py-2 px-1 rounded-xl bg-[#141720] border border-white/15 flex-row items-center justify-center gap-1 active:scale-95"
        >
          <FileText size={13} color="#D1D5DB" />
          <Text className="text-gray-300 font-black text-[10px] uppercase tracking-wider">
            PDF
          </Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSaveClick}
          className="flex-1 py-2 px-1 rounded-xl bg-[#FF4422] shadow-md shadow-[#FF4422]/20 flex-row items-center justify-center gap-1 active:scale-95"
        >
          <Save size={13} color="white" />
          <Text className="text-white font-black text-[10px] uppercase tracking-wider">
            SAVE
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scope Selection Modal */}
      <Modal
        visible={activeModalAction !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModalAction(null)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-5">
          <View className="w-full max-w-sm bg-[#1A1E2E] border-2 border-white/20 rounded-2xl p-5 shadow-2xl">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-white/10 pb-3 mb-3">
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-8 h-8 rounded-lg items-center justify-center ${
                    activeModalAction === 'pdf' ? 'bg-[#FF4422]/20' : 'bg-[#00AEEF]/20'
                  }`}
                >
                  {activeModalAction === 'pdf' ? (
                    <FileText size={18} color="#FF4422" />
                  ) : (
                    <Share2 size={18} color="#00AEEF" />
                  )}
                </View>
                <View>
                  <Text className="text-xs font-black uppercase tracking-wider text-white">
                    {activeModalAction === 'pdf' ? 'Export PDF Report' : 'Share Session Data'}
                  </Text>
                  <Text className="text-[9px] text-white/60 uppercase font-bold">
                    Choose Export Scope
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setActiveModalAction(null)} className="p-1">
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-white/80 font-medium mb-4">
              What would you like to {activeModalAction === 'pdf' ? 'export as PDF' : 'share'}?
            </Text>

            {/* Current Section Button */}
            <TouchableOpacity
              onPress={() => handleExecuteOption('current')}
              className="w-full py-3 px-4 rounded-xl bg-[#00AEEF] flex-row items-center justify-between mb-2.5 active:scale-98"
            >
              <View className="flex-row items-center gap-2">
                <FileCode size={16} color="white" />
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  Current Section Only
                </Text>
              </View>
              <View className="bg-black/20 px-2 py-0.5 rounded">
                <Text className="text-[9px] text-white font-bold">{sectionLabel}</Text>
              </View>
            </TouchableOpacity>

            {/* All Sections Button */}
            <TouchableOpacity
              onPress={() => handleExecuteOption('all')}
              className="w-full py-3 px-4 rounded-xl bg-[#FF4422] flex-row items-center justify-between mb-4 active:scale-98"
            >
              <View className="flex-row items-center gap-2">
                <Layers size={16} color="white" />
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  All Sections
                </Text>
              </View>
              <View className="bg-black/20 px-2 py-0.5 rounded">
                <Text className="text-[9px] text-white font-bold">Full Report</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveModalAction(null)} className="py-1">
              <Text className="text-center text-[11px] font-black text-white/40 uppercase tracking-wider">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default SectionActionBar;
