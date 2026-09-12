import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useActiveSession } from '../../hooks/useActiveSession';
import { SectionActionBar } from '../ui/SectionActionBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEACH_ME_TAGS = [
  'Pass', 'Shoot', 'Dribble', 'Tackle', 'Head', 'Defend',
  'Attack', 'Scan', 'Improve', 'Learn', 'Play', 'Recover',
];

const GRADE_ITEMS = [
  { key: 'coach', label: 'Coach' },
  { key: 'assistantCoach', label: 'Asst. Coach' },
  { key: 'trainer', label: 'Trainer' },
];

export function NoteToCoach() {
  const { updateReflection, reflection } = useActiveSession();

  const [formData, setFormData] = useState({
    whatILiked: '',
    whatIWouldChange: '',
    wouldLikeToDoMore: '',
    teachMeTags: [],
    grades: { coach: 10, assistantCoach: 10, trainer: 10 },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const saved = await AsyncStorage.getItem('noteToCoach');
        if (saved) {
          setFormData(JSON.parse(saved));
        } else if (reflection?.noteToCoach) {
          setFormData(reflection.noteToCoach);
        }
      } catch (e) {
        console.error('Error loading note to coach:', e);
      }
    }
    loadData();
  }, [reflection]);

  const handleChange = async (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    await AsyncStorage.setItem('noteToCoach', JSON.stringify(updated));
    updateReflection({ noteToCoach: updated });
  };

  const handleTagToggle = async (tag) => {
    const tags = formData.teachMeTags.includes(tag)
      ? formData.teachMeTags.filter((t) => t !== tag)
      : [...formData.teachMeTags, tag];
    const updated = { ...formData, teachMeTags: tags };
    setFormData(updated);
    await AsyncStorage.setItem('noteToCoach', JSON.stringify(updated));
    updateReflection({ noteToCoach: updated });
  };

  const handleGradeChange = async (key, delta) => {
    const current = formData.grades[key] ?? 10;
    const nextVal = Math.max(1, Math.min(10, current + delta));
    const updatedGrades = { ...formData.grades, [key]: nextVal };
    const updated = { ...formData, grades: updatedGrades };
    setFormData(updated);
    await AsyncStorage.setItem('noteToCoach', JSON.stringify(updated));
    updateReflection({ noteToCoach: updated });
  };

  const handleReset = () => {
    Alert.alert('Reset Feedback', 'Reset Note to Coach feedback?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          const resetData = {
            whatILiked: '',
            whatIWouldChange: '',
            wouldLikeToDoMore: '',
            teachMeTags: [],
            grades: { coach: 10, assistantCoach: 10, trainer: 10 },
          };
          setFormData(resetData);
          await AsyncStorage.setItem('noteToCoach', JSON.stringify(resetData));
          updateReflection({ noteToCoach: resetData });
        },
      },
    ]);
  };

  return (
    <View className="space-y-3.5 pb-6">
      {/* ── Title Bar ── */}
      <View className="flex-row items-center justify-between py-1">
        <Text className="text-xl font-black uppercase text-[#FF4422] tracking-wider">
          NOTE TO COACH
        </Text>
        <Text className="text-[10px] font-bold text-white/50 tracking-wider">
          FEEDBACK & REQUESTS
        </Text>
      </View>

      {/* ── Header Badge ── */}
      <View className="p-3 rounded-2xl border border-white/10 bg-[#12151D] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-xl bg-[#10B981]/20 items-center justify-center">
            <MessageSquare size={16} color="#10B981" />
          </View>
          <View>
            <Text className="text-xs font-black uppercase tracking-wider text-white">
              DIRECT COACHING FEEDBACK
            </Text>
            <Text className="text-[9px] text-white/50 font-medium">
              Recorded live for post-match analysis
            </Text>
          </View>
        </View>
      </View>

      {/* ── Feedback Textareas ── */}
      <View className="space-y-3">
        <View>
          <Text className="text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
            WHAT I LIKED ABOUT THE SESSION / GAME
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Share what went well..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={formData.whatILiked}
            onChangeText={(text) => handleChange('whatILiked', text)}
            className="w-full bg-[#12151D] text-white p-3 text-xs font-medium rounded-xl border border-white/15"
          />
        </View>

        <View>
          <Text className="text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
            WHAT I WOULD CHANGE
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Honest constructive feedback..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={formData.whatIWouldChange}
            onChangeText={(text) => handleChange('whatIWouldChange', text)}
            className="w-full bg-[#12151D] text-white p-3 text-xs font-medium rounded-xl border border-white/15"
          />
        </View>

        <View>
          <Text className="text-[9px] font-black uppercase tracking-wider text-white/70 mb-1 px-1">
            I WOULD LIKE TO DO MORE
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="More drills, games, scrimmage..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={formData.wouldLikeToDoMore}
            onChangeText={(text) => handleChange('wouldLikeToDoMore', text)}
            className="w-full bg-[#12151D] text-white p-3 text-xs font-medium rounded-xl border border-white/15"
          />
        </View>
      </View>

      {/* ── TEACH ME HOW TO Tag Chips ── */}
      <View className="space-y-2 pt-1">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-xs font-black uppercase text-white/70 px-1"
        >
          TEACH ME HOW TO:
        </Text>
        <View className="flex-row flex-wrap gap-2 p-3 rounded-2xl border border-white/10 bg-[#12151D]">
          {TEACH_ME_TAGS.map((tag) => {
            const isSelected = formData.teachMeTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected
                    ? 'bg-[#FF4422] border-[#FF4422]'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <Text
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    isSelected ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── GRADE YOUR COACHING STAFF Sliders ── */}
      <View className="space-y-2 pt-1">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-xs font-black uppercase text-white/70 px-1"
        >
          GRADE YOUR COACHING STAFF (1–10)
        </Text>

        <View className="space-y-2 p-3.5 rounded-2xl border border-white/10 bg-[#12151D]">
          {GRADE_ITEMS.map((item) => {
            const val = formData.grades[item.key] ?? 10;

            return (
              <View
                key={item.key}
                className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex-row items-center justify-between"
              >
                <Text className="text-white text-xs font-black uppercase tracking-wider">
                  {item.label}
                </Text>

                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={() => handleGradeChange(item.key, -1)}
                    className="w-7 h-7 rounded-lg bg-white/10 items-center justify-center border border-white/10"
                  >
                    <Text className="text-white font-black text-sm">-</Text>
                  </TouchableOpacity>

                  <Text className="text-[#FF4422] text-base font-black w-6 text-center">
                    {val}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleGradeChange(item.key, 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 items-center justify-center border border-white/10"
                  >
                    <Text className="text-white font-black text-sm">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={handleReset}
        onSave={() => updateReflection({ noteToCoach: formData })}
        sectionKey="note-to-coach"
        data={formData}
      />
    </View>
  );
}

export default NoteToCoach;
