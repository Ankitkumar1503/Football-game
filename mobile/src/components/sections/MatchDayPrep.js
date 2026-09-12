import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react-native';
import { useActiveSession } from '../../hooks/useActiveSession';
import { SectionActionBar } from '../ui/SectionActionBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_CHECKLIST = [
  { id: 'cleats', label: 'Clean Boots & Extra Studs Packed', category: 'GEAR' },
  { id: 'shinguards', label: 'Shin Guards & Grip Socks In Bag', category: 'GEAR' },
  { id: 'water', label: '2L Water & Electrolytes Bottle Ready', category: 'HYDRATION' },
  { id: 'nutrition', label: 'Pre-Match Meal 3 Hours Before Kickoff', category: 'NUTRITION' },
  { id: 'tactics', label: 'Review Team Tactics & Individual Goals', category: 'MINDSET' },
  { id: 'visualization', label: '10-Min Match Visualization & Focus', category: 'MINDSET' },
  { id: 'warmup', label: 'Dynamic Stretching & Ball Touch Activation', category: 'PHYSICAL' },
];

export function MatchDayPrep() {
  const { session } = useActiveSession();

  const [opponent, setOpponent] = useState('');
  const [kickoffTime, setKickoffTime] = useState('10:30 AM');
  const [venue, setVenue] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const [tacticalNotes, setTacticalNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const opp = await AsyncStorage.getItem('prep_opponent');
        const time = await AsyncStorage.getItem('prep_kickoffTime');
        const ven = await AsyncStorage.getItem('prep_venue');
        const checked = await AsyncStorage.getItem('prep_checkedItems');
        const notes = await AsyncStorage.getItem('prep_tacticalNotes');

        if (opp) setOpponent(opp);
        if (time) setKickoffTime(time);
        if (ven) setVenue(ven);
        if (checked) setCheckedItems(JSON.parse(checked));
        if (notes) setTacticalNotes(notes);
      } catch (e) {
        console.error('Error loading prep data:', e);
      }
    }
    loadData();
  }, []);

  const handleUpdate = async (key, val) => {
    if (key === 'opponent') {
      setOpponent(val);
      await AsyncStorage.setItem('prep_opponent', val);
    } else if (key === 'kickoffTime') {
      setKickoffTime(val);
      await AsyncStorage.setItem('prep_kickoffTime', val);
    } else if (key === 'venue') {
      setVenue(val);
      await AsyncStorage.setItem('prep_venue', val);
    } else if (key === 'tacticalNotes') {
      setTacticalNotes(val);
      await AsyncStorage.setItem('prep_tacticalNotes', val);
    }
  };

  const toggleCheck = async (id) => {
    let updated;
    if (checkedItems.includes(id)) {
      updated = checkedItems.filter((i) => i !== id);
    } else {
      updated = [...checkedItems, id];
    }
    setCheckedItems(updated);
    await AsyncStorage.setItem('prep_checkedItems', JSON.stringify(updated));
  };

  const progressPercent = Math.round(
    (checkedItems.length / DEFAULT_CHECKLIST.length) * 100
  );

  const isRightFoot = (session?.activeFooter || 'RIGHT').toUpperCase() === 'RIGHT';

  return (
    <View className="space-y-4 pb-6">
      {/* ── Title Header ── */}
      <View className="flex-row items-center justify-between py-1">
        <Text className="text-xl font-black uppercase text-white tracking-wider">
          MATCH DAY PREP
        </Text>
        <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
          <Zap size={12} color="#FACC15" />
          <Text className="text-yellow-400 text-[8.5px] font-black uppercase">
            READY TO WIN
          </Text>
        </View>
      </View>

      {/* ── HERO FIXTURE CARD ── */}
      <View className="rounded-2xl p-4 border border-yellow-500/40 bg-[#14120B] space-y-3 shadow-xl">
        <View className="flex-row items-start justify-between">
          <View className="space-y-0.5 flex-1 pr-2">
            <Text
              style={{ letterSpacing: 2 }}
              className="text-[8.5px] font-black uppercase text-yellow-400"
            >
              NEXT FIXTURE PREPARATION
            </Text>
            <Text
              className="text-xl font-black uppercase text-white"
              numberOfLines={1}
            >
              {opponent ? `VS ${opponent}` : 'OPPONENT NOT SET'}
            </Text>
            <Text className="text-xs font-semibold text-white/70">
              {session?.playerName || 'Player'} · {session?.position ? `#${session.position}` : 'Player'} ({isRightFoot ? 'Right Foot' : 'Left Foot'})
            </Text>
          </View>

          <View className="w-12 h-12 items-center justify-center">
            <Image
              source={
                isRightFoot
                  ? require('../../../assets/right_foot.png')
                  : require('../../../assets/left_foot.png')
              }
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Fixture Details Inputs */}
        <View className="space-y-2 pt-1">
          <View className="bg-black/50 border border-yellow-400/30 rounded-xl p-2.5">
            <Text className="text-[8.5px] font-black uppercase text-yellow-400 mb-0.5">
              OPPONENT
            </Text>
            <TextInput
              placeholder="e.g. Rival Academy"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={opponent}
              onChangeText={(val) => handleUpdate('opponent', val)}
              className="text-white text-xs font-bold"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View className="flex-1 bg-black/50 border border-yellow-400/30 rounded-xl p-2.5">
              <Text className="text-[8.5px] font-black uppercase text-yellow-400 mb-0.5">
                KICKOFF
              </Text>
              <TextInput
                placeholder="10:30 AM"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={kickoffTime}
                onChangeText={(val) => handleUpdate('kickoffTime', val)}
                className="text-white text-xs font-bold"
              />
            </View>

            <View className="flex-1 bg-black/50 border border-yellow-400/30 rounded-xl p-2.5">
              <Text className="text-[8.5px] font-black uppercase text-yellow-400 mb-0.5">
                VENUE
              </Text>
              <TextInput
                placeholder="Main Pitch 1"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={venue}
                onChangeText={(val) => handleUpdate('venue', val)}
                className="text-white text-xs font-bold"
              />
            </View>
          </View>
        </View>

        {/* Readiness Progress Bar */}
        <View className="space-y-1 pt-1 border-t border-white/10">
          <View className="flex-row items-center justify-between">
            <Text className="text-[9px] font-black uppercase text-yellow-400">
              PREPARATION READINESS
            </Text>
            <Text className="text-white font-black text-xs">{progressPercent}% READY</Text>
          </View>
          <View className="h-2 bg-black/60 rounded-full overflow-hidden">
            <View
              className="h-full bg-yellow-400"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>
      </View>

      {/* ── PRE-MATCH CHECKLIST ── */}
      <View className="space-y-2 pt-1">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-xs font-black uppercase text-white/70 px-0.5"
        >
          PRE-MATCH CHECKLIST
        </Text>

        <View className="space-y-2">
          {DEFAULT_CHECKLIST.map((item) => {
            const isChecked = checkedItems.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border flex-row items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-[#121A15] border-emerald-500/50'
                    : 'bg-[#12151D] border-white/10'
                }`}
              >
                <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                  <View
                    className={`w-5 h-5 rounded-md border items-center justify-center ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400'
                        : 'border-white/30 bg-black/40'
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={13} color="white" />}
                  </View>
                  <Text
                    className={`text-xs font-bold ${
                      isChecked ? 'line-through text-white/50' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>

                <View className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  <Text className="text-[8px] font-black uppercase text-white/50">
                    {item.category}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── TACTICAL FOCUS & NOTES ── */}
      <View className="p-4 rounded-2xl border border-white/10 bg-[#12151D] space-y-2">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-[9.5px] font-black uppercase text-yellow-400"
        >
          TACTICAL FOCUS & COACH INSTRUCTIONS
        </Text>
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Write your tactical role and coach instructions..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={tacticalNotes}
          onChangeText={(val) => handleUpdate('tacticalNotes', val)}
          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white text-xs font-medium"
        />
      </View>

      {/* ── INSPIRATIONAL BANNER ── */}
      <View className="p-4 rounded-2xl bg-[#10B981] space-y-1 shadow-lg border border-emerald-400/40">
        <Text className="text-base font-black italic tracking-wide text-yellow-300">
          “Preparation is the bridge to peak performance.”
        </Text>
        <Text className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
          — Footballer Athletics™
        </Text>
      </View>

      {/* Action Bar */}
      <SectionActionBar
        sectionKey="match-prep"
        data={{ opponent, kickoffTime, venue, checkedItems, tacticalNotes }}
      />
    </View>
  );
}

export default MatchDayPrep;
