import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User,
  LogOut,
  RotateCcw,
  Trash2,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useActiveSession } from '../../hooks/useActiveSession';
import { db } from '../../lib/db';
import { generateAndSharePdf } from '../../lib/pdfGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Settings() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { session, stats, reflection, sessionId } = useActiveSession();

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is Touches™?',
      a: 'Touches™ is a player development tool designed to track match interactions, technical actions, and self-reflection metrics.',
    },
    {
      q: 'Does Touches™ track my location?',
      a: 'No. The app does not use GPS or location services.',
    },
    {
      q: 'Where is my data stored?',
      a: 'All data is stored locally on your device.',
    },
    {
      q: 'Is my data shared with third parties?',
      a: 'No. Touches™ does not sell or distribute user data.',
    },
    {
      q: 'Can I export my session results?',
      a: 'Yes. Users may generate PDFs and save reports to their device.',
    },
    {
      q: 'Who operates Touches™?',
      a: 'Touches™ is operated by Footballer Athletics™, founded by Coach Clem Murdock.',
    },
  ];

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Register');
        },
      },
    ]);
  };

  const handleResetSession = () => {
    Alert.alert(
      'Reset Session',
      'This will permanently clear all touches and reflections for today.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              if (sessionId) {
                await db.touches.where('sessionId').equals(sessionId).delete();
                await db.reflections.where('sessionId').equals(sessionId).delete();
              }
              Alert.alert('Done', 'Session data has been reset.');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Delete All Data',
      'This will delete ALL sessions, profile, and lifetime records stored on this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.sessions.clear();
              await db.touches.clear();
              await db.reflections.clear();
              await AsyncStorage.clear();
              Alert.alert('Reset Complete', 'All app data has been cleared.');
              navigation.navigate('Register');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const handleExportPdf = async () => {
    await generateAndSharePdf({ session, stats, reflection, section: 'Full Match' });
  };

  return (
    <View className="space-y-4 pb-12">
      {/* Page Title */}
      <View className="border-b-2 border-white/20 pb-2 mb-2">
        <Text className="text-2xl font-black uppercase tracking-widest text-white">
          Settings
        </Text>
      </View>

      {/* ── ACCOUNT SECTION ── */}
      <View className="space-y-1">
        <Text className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">
          Account
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="p-3 rounded-xl bg-[#12151D] border border-white/10 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <User size={16} color="white" />
            <View>
              <Text className="text-xs font-black uppercase text-white">Profile</Text>
              <Text className="text-[9px] text-white/60">
                View & manage player details
              </Text>
            </View>
          </View>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          className="p-3 rounded-xl bg-[#1F1012] border border-rose-500/30 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <LogOut size={16} color="#FB7185" />
            <View>
              <Text className="text-xs font-black uppercase text-rose-400">
                Sign Out
              </Text>
              <Text className="text-[9px] text-rose-300/70">
                Exit current session
              </Text>
            </View>
          </View>
          <ChevronRight size={14} color="#FB7185" />
        </TouchableOpacity>
      </View>

      {/* ── DATA MANAGEMENT ── */}
      <View className="space-y-1 pt-2">
        <Text className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">
          Data Management
        </Text>

        <TouchableOpacity
          onPress={handleExportPdf}
          className="p-3 rounded-xl bg-[#12151D] border border-white/10 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <FileText size={16} color="#00AEEF" />
            <View>
              <Text className="text-xs font-black uppercase text-white">Export PDF</Text>
              <Text className="text-[9px] text-white/60">
                Save match report to device
              </Text>
            </View>
          </View>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetSession}
          className="p-3 rounded-xl bg-[#12151D] border border-white/10 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <RotateCcw size={16} color="#FACC15" />
            <View>
              <Text className="text-xs font-black uppercase text-white">Reset Session</Text>
              <Text className="text-[9px] text-white/60">
                Clear touches for today
              </Text>
            </View>
          </View>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetAll}
          className="p-3 rounded-xl bg-[#1F1012] border border-rose-500/30 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <Trash2 size={16} color="#EF4444" />
            <View>
              <Text className="text-xs font-black uppercase text-rose-500">
                Delete All Data
              </Text>
              <Text className="text-[9px] text-rose-300/70">
                Erase lifetime stats & all history
              </Text>
            </View>
          </View>
          <ChevronRight size={14} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* ── FAQS ACCORDION ── */}
      <View className="space-y-2 pt-2">
        <Text className="text-[9px] font-black uppercase tracking-widest text-white/50">
          Frequently Asked Questions
        </Text>

        <View className="space-y-1.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <View
                key={idx}
                className="rounded-xl bg-[#12151D] border border-white/10 overflow-hidden"
              >
                <TouchableOpacity
                  onPress={() => setOpenFaq(isOpen ? null : idx)}
                  className="p-3 flex-row items-center justify-between"
                >
                  <Text className="text-xs font-black uppercase text-white flex-1 pr-2">
                    {faq.q}
                  </Text>
                  {isOpen ? (
                    <ChevronUp size={14} color="white" />
                  ) : (
                    <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
                  )}
                </TouchableOpacity>
                {isOpen && (
                  <View className="px-3 pb-3">
                    <Text className="text-[10px] text-white/70 leading-relaxed">
                      {faq.a}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* ── LEGAL & POLICY ── */}
      <View className="space-y-1 pt-2">
        <Text className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">
          Legal & Info
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Policy')}
          className="p-3 rounded-xl bg-[#12151D] border border-white/10 flex-row items-center justify-between"
        >
          <Text className="text-xs font-black uppercase text-white">Usage Policy</Text>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          className="p-3 rounded-xl bg-[#12151D] border border-white/10 flex-row items-center justify-between"
        >
          <Text className="text-xs font-black uppercase text-white">Privacy Policy</Text>
          <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      {/* App Version Branding */}
      <View className="items-center pt-4">
        <Text className="text-[9px] font-black uppercase tracking-widest text-white/40">
          TOUCHES™ MOBILE v1.0.0
        </Text>
        <Text className="text-[8px] text-white/30 mt-0.5">
          Footballer Athletics™ · All Rights Reserved
        </Text>
      </View>
    </View>
  );
}

export default Settings;
