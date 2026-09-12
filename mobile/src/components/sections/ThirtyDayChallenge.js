import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Check, Flame, CircleDot, Trophy } from 'lucide-react-native';
import { SectionActionBar } from '../ui/SectionActionBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRILLS_CONFIG = [
  { day: 1, title: 'Toe Taps', reps: '100 REPS · both feet', description: 'Alternate feet fast. Stay on your toes.' },
  { day: 2, title: 'Inside Foot Passes', reps: '100 REPS · alternate feet', description: 'Firm pass against a wall, cushion back control.' },
  { day: 3, title: 'Juggles (Low & High)', reps: '50 REPS · keep ball up', description: 'Focus on soft ankle touch and soft drops.' },
  { day: 4, title: 'Sole Rolls', reps: '80 REPS · left to right', description: 'Roll ball across body with sole of shoe.' },
  { day: 5, title: 'Figure 8 Dribble', reps: '10 LAPS · tight spaces', description: 'Weave around two cones using inside/outside foot.' },
  { day: 6, title: 'Cruyff Turn Practice', reps: '30 REPS · fake shot & turn', description: 'Sell the shot fake, drag ball behind standing leg.' },
  { day: 7, title: 'Stepover Mastery', reps: '40 REPS · explosive exit', description: 'Step over ball with outside foot, push into space.' },
  { day: 8, title: 'Wall Rebounds (1-Touch)', reps: '100 REPS · quick reaction', description: 'Stay light on feet, quick 1-touch pass return.' },
  { day: 9, title: 'Header Control', reps: '30 REPS · forehead touch', description: 'Keep eyes on ball, power through with forehead.' },
  { day: 10, title: 'Outside Foot Push', reps: '60 REPS · change direction', description: 'Quick sharp cut using outside of foot.' },
  { day: 11, title: 'L-Drag Turn', reps: '40 REPS · drag & push', description: 'Drag back with sole, push behind standing leg.' },
  { day: 12, title: 'Aerial Touch Drop', reps: '30 REPS · high toss', description: 'Toss high, deaden ball on first touch with laces.' },
  { day: 13, title: 'Elastic / Scissors', reps: '40 REPS · trick move', description: 'Push outside then snap inside quickly.' },
  { day: 14, title: 'Thigh to Foot Juggle', reps: '40 REPS · combo touch', description: 'Bump with thigh, control on foot, alternate sides.' },
  { day: 15, title: 'Half-Way Sprint Touch', reps: '20 REPS · speed dribble', description: 'Dribble at full sprint, stop dead on line.' },
  { day: 16, title: 'Double Stepover', reps: '30 REPS · double fake', description: 'Right foot stepover, left foot stepover, explode.' },
  { day: 17, title: 'Wall Volley Cushion', reps: '50 REPS · air control', description: 'Volley into wall, cushion on foot before ground.' },
  { day: 18, title: 'Maradona Roulette', reps: '25 REPS · 360 spin', description: 'Sole drag onto ball, spin body around defender.' },
  { day: 19, title: 'Cone Slalom Fast', reps: '15 LAPS · speed agility', description: 'Sprint through 5 cones as fast as possible.' },
  { day: 20, title: 'Weak Foot Only Passes', reps: '100 REPS · non-dominant', description: 'Pure non-dominant foot wall passing.' },
  { day: 21, title: 'Corner Flicks', reps: '30 REPS · heel flick', description: 'Flick ball up with heel over defender.' },
  { day: 22, title: 'Chest Control to Volley', reps: '30 REPS · chest & shoot', description: 'Cushion on chest, hit half-volley before bounce.' },
  { day: 23, title: 'V-Cut Feint', reps: '40 REPS · pull & push', description: 'Pull back with sole, push diagonally opposite.' },
  { day: 24, title: 'Speed Dribble Zig-Zag', reps: '12 LAPS · agility burst', description: 'Sharp 45-degree angle cuts at max speed.' },
  { day: 25, title: 'Rabona Pass Drill', reps: '20 REPS · cross-leg pass', description: 'Wrap kicking leg behind standing leg for pass.' },
  { day: 26, title: 'First Touch Turn', reps: '50 REPS · turn on receive', description: 'Receive ball facing back, turn on first touch.' },
  { day: 27, title: 'Juggle Challenge (100)', reps: '100 JUGGLES · uninterrupted', description: 'Reach 100 juggles without ball hitting ground.' },
  { day: 28, title: 'Chip Shot Touch', reps: '30 REPS · lofted touch', description: 'Get toe under ball, chip softly over obstacle.' },
  { day: 29, title: 'Pro Combination Drill', reps: '50 REPS · 3-move combo', description: 'Toe tap -> L-drag -> Stepover -> Explode.' },
  { day: 30, title: 'Mastery Test (All Moves)', reps: 'FINAL TEST · complete set', description: 'Run full 10-minute skill circuit at 100% effort.' },
];

export function ThirtyDayChallenge() {
  const [activeDay, setActiveDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [reflections, setReflections] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const cDays = await AsyncStorage.getItem('completedDays');
        const refs = await AsyncStorage.getItem('reflections');
        if (cDays) setCompletedDays(JSON.parse(cDays));
        if (refs) setReflections(JSON.parse(refs));
      } catch (e) {
        console.error('Error loading challenge data:', e);
      }
    }
    loadData();
  }, []);

  const toggleCompleteDay = async () => {
    let updated;
    if (completedDays.includes(activeDay)) {
      updated = completedDays.filter((d) => d !== activeDay);
    } else {
      updated = [...completedDays, activeDay];
    }
    setCompletedDays(updated);
    await AsyncStorage.setItem('completedDays', JSON.stringify(updated));
  };

  const handleReflectionChange = async (text) => {
    const updated = { ...reflections, [activeDay]: text };
    setReflections(updated);
    await AsyncStorage.setItem('reflections', JSON.stringify(updated));
  };

  const currentDrill = DRILLS_CONFIG.find((d) => d.day === activeDay) || DRILLS_CONFIG[0];
  const isCompleted = completedDays.includes(activeDay);
  const completedCount = completedDays.length;

  const calculateStreak = () => {
    let streak = 0;
    for (let i = 1; i <= 30; i++) {
      if (completedDays.includes(i)) streak++;
      else break;
    }
    return streak;
  };
  const streakCount = calculateStreak();

  return (
    <View className="space-y-3.5 pb-6">
      {/* ── Page Header Bar ── */}
      <View className="flex-row items-center justify-between py-1">
        <Text className="text-xl font-black uppercase text-white tracking-wider">
          30-DAY CHALLENGE
        </Text>
        <View className="px-3 py-1 rounded-full bg-[#FF4422]">
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">
            DAY {activeDay}
          </Text>
        </View>
      </View>

      {/* ── SOCCER SKILLS CHALLENGE HEADER CARD ── */}
      <View className="p-4 rounded-2xl border border-white/10 bg-[#12151D] flex-row items-center justify-between shadow-lg">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center border border-emerald-500/30">
            <CircleDot size={20} color="#34D399" />
          </View>
          <View>
            <Text className="text-sm font-black uppercase tracking-wider text-white">
              SOCCER SKILLS CHALLENGE
            </Text>
            <Text className="text-[10px] font-semibold text-white/60">Player Track</Text>
          </View>
        </View>

        <View className="p-2 rounded-lg bg-black/40">
          <Trophy size={18} color="rgba(255,255,255,0.4)" />
        </View>
      </View>

      {/* ── DAY COUNTER & STREAK ── */}
      <View className="items-center space-y-1.5 py-1">
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-2xl">⚽</Text>
          <Text className="text-4xl font-black text-[#00AEEF]">{activeDay}</Text>
          <Text className="text-xs font-black text-white/60 uppercase">
            of 30 · {currentDrill.title}
          </Text>
        </View>

        {/* Streak Pill */}
        <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4422]/15 border border-[#FF4422]/30">
          <Flame size={12} color="#FF4422" />
          <Text className="text-[#FF4422] text-[9.5px] font-black uppercase">
            {streakCount}-DAY STREAK · {completedCount}/30 DONE
          </Text>
        </View>
      </View>

      {/* ── TODAY'S DRILL CARD ── */}
      <View className="p-4 rounded-2xl border border-[#FF4422]/40 bg-[#141012] space-y-2.5 shadow-xl">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-[9.5px] font-black uppercase text-[#FF4422]"
        >
          TODAY'S DRILL
        </Text>

        <View>
          <Text className="text-xl font-black text-white">{currentDrill.title}</Text>
          <Text className="text-xs font-bold text-white/70 mt-0.5">
            {currentDrill.reps}
          </Text>
        </View>

        <Text className="text-xs text-white/80 leading-relaxed font-medium">
          {currentDrill.description}
        </Text>

        <TouchableOpacity
          onPress={toggleCompleteDay}
          className={`w-full py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg active:scale-98 ${
            isCompleted ? 'bg-[#10B981]' : 'bg-[#FF4422]'
          }`}
        >
          <Check size={16} color="white" />
          <Text className="text-white font-black text-xs uppercase tracking-wider">
            {isCompleted ? `DAY ${activeDay} COMPLETED!` : `MARK DAY ${activeDay} COMPLETE`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── REFLECT CARD ── */}
      <View className="p-4 rounded-2xl border border-white/10 bg-[#12151D] space-y-1.5">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-[9.5px] font-black uppercase text-white/70"
        >
          REFLECT
        </Text>
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Write your answer here..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={reflections[activeDay] || ''}
          onChangeText={handleReflectionChange}
          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white text-xs font-medium"
        />
      </View>

      {/* ── INSPIRATIONAL QUOTE CARD ── */}
      <View className="p-4 rounded-2xl bg-[#10B981] space-y-1 shadow-lg border border-emerald-400/40">
        <Text className="text-lg font-black italic tracking-wide text-yellow-300">
          “Play like you always have the ball”
        </Text>
        <Text className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-100">
          — Coach Clem Murdock · Footballer Athletics™
        </Text>
      </View>

      {/* ── YOUR 30-DAY PROGRESS GRID (5 Rows of 6 with flex: 1) ── */}
      <View className="space-y-2 pt-1">
        <Text
          style={{ letterSpacing: 2 }}
          className="text-[11px] font-black uppercase text-white/70 px-0.5"
        >
          YOUR 30-DAY PROGRESS
        </Text>

        <View className="space-y-1.5">
          {[0, 1, 2, 3, 4].map((rowIndex) => {
            const rowDays = DRILLS_CONFIG.slice(rowIndex * 6, (rowIndex + 1) * 6);
            return (
              <View key={rowIndex} style={{ flexDirection: 'row', gap: 6 }}>
                {rowDays.map((item) => {
                  const isDone = completedDays.includes(item.day);
                  const isActive = activeDay === item.day;

                  return (
                    <TouchableOpacity
                      key={item.day}
                      activeOpacity={0.7}
                      onPress={() => setActiveDay(item.day)}
                      style={{ flex: 1, height: 44 }}
                      className={`rounded-xl items-center justify-center border ${
                        isDone
                          ? 'bg-[#10B981] border-emerald-400'
                          : isActive
                          ? 'bg-[#12151D] border-2 border-[#FF4422]'
                          : 'bg-[#12151D] border-white/10'
                      }`}
                    >
                      <Text
                        className={`font-black text-xs ${
                          isDone
                            ? 'text-white'
                            : isActive
                            ? 'text-[#FF4422]'
                            : 'text-white/60'
                        }`}
                      >
                        {item.day}
                      </Text>
                      {isDone && <Check size={10} color="white" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>

      {/* Action Bar */}
      <SectionActionBar
        sectionKey="challenge"
        data={{ activeDay, completedDays, reflections }}
      />
    </View>
  );
}

export default ThirtyDayChallenge;
