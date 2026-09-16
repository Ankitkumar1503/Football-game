import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import {
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Target,
  Zap,
  Award,
  CircleDot,
  Shield,
  Flag,
  RotateCw,
  ChevronDown,
  Check,
  X,
  Mic,
} from 'lucide-react-native';
import { useActiveSession } from '../../hooks/useActiveSession';
import { db } from '../../lib/db';
import { SectionActionBar } from '../ui/SectionActionBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSITIONS = [
  'Select Position',
  'Goalkeeper (GK)',
  'Center Back (CB)',
  'Left Back (LB)',
  'Right Back (RB)',
  'Defensive Midfielder (CDM)',
  'Central Midfielder (CM)',
  'Attacking Midfielder (CAM)',
  'Left Winger (LW)',
  'Right Winger (RW)',
  'Striker / Forward (ST)',
];

const ACTIONS_CONFIG = [
  { id: 'Pass', label: 'PASS', icon: ArrowRight },
  { id: 'Dribble', label: 'DRIBBLE', icon: Zap },
  { id: 'Shot', label: 'SHOT', icon: Target },
  { id: 'Goal', label: 'GOAL', icon: Award },
  { id: 'Header', label: 'HEADER', icon: CircleDot },
  { id: 'Tackle', label: 'TACKLE', icon: Shield },
  { id: 'Free Kick', label: 'FREE KICK', icon: RotateCw },
  { id: 'Corner Kick', label: 'CORNER', icon: Flag },
  { id: 'Throw-In', label: 'THROW-IN', icon: ArrowRight },
  { id: 'Penalty', label: 'PENALTY', icon: Target },
  { id: 'Keep-Up-Feet', label: 'KEEP-LEFT', icon: Zap },
  { id: 'Keep-Up-Head', label: 'KEEP-HEAD', icon: CircleDot },
];

const MATCH_EVENTS_CONFIG = [
  { id: 'Yellow Card', label: 'YELLOW CARD', type: 'yellow-card' },
  { id: 'Red Card', label: 'RED CARD', type: 'red-card' },
  { id: 'Missed Game', label: 'MISSED GAME' },
  { id: 'Sub In', label: 'SUB IN' },
  { id: 'Sub Out', label: 'SUB OUT' },
  { id: 'Injury', label: 'INJURY' },
];

export function parseVoiceCommand(text) {
  if (!text) return null;
  const lower = text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

  // Match events (strictly independent, no positive/negative)
  if (lower.includes('yellow card') || lower === 'yellow') {
    return { type: 'event', id: 'Yellow Card' };
  }
  if (lower.includes('red card') || lower === 'red') {
    return { type: 'event', id: 'Red Card' };
  }
  if (lower.includes('missed game') || lower.includes('missed match')) {
    return { type: 'event', id: 'Missed Game' };
  }
  if (lower.includes('sub in') || lower.includes('substitution in')) {
    return { type: 'event', id: 'Sub In' };
  }
  if (lower.includes('sub out') || lower.includes('substitution out')) {
    return { type: 'event', id: 'Sub Out' };
  }
  if (lower.includes('injury') || lower.includes('injured')) {
    return { type: 'event', id: 'Injury' };
  }

  // Quality specification
  let quality = null;
  if (
    lower.includes('positive') ||
    lower.includes('good') ||
    lower.includes('plus') ||
    lower.startsWith('pos ')
  ) {
    quality = 'Positive';
  } else if (
    lower.includes('negative') ||
    lower.includes('bad') ||
    lower.includes('minus') ||
    lower.startsWith('neg ')
  ) {
    quality = 'Negative';
  }

  // Touch actions
  let actionId = null;
  if (lower.includes('pass')) actionId = 'Pass';
  else if (lower.includes('dribble')) actionId = 'Dribble';
  else if (lower.includes('shot') || lower.includes('shoot')) actionId = 'Shot';
  else if (lower.includes('goal')) actionId = 'Goal';
  else if (lower.includes('header') || lower.includes('head')) actionId = 'Header';
  else if (lower.includes('tackle')) actionId = 'Tackle';
  else if (lower.includes('free kick') || lower.includes('freekick')) actionId = 'Free Kick';
  else if (lower.includes('corner')) actionId = 'Corner Kick';
  else if (lower.includes('throw in') || lower.includes('throwin') || lower.includes('throw'))
    actionId = 'Throw-In';
  else if (lower.includes('penalty')) actionId = 'Penalty';
  else if (
    lower.includes('keep-left') ||
    lower.includes('keep left') ||
    lower.includes('keep up feet') ||
    lower.includes('keep feet')
  )
    actionId = 'Keep-Up-Feet';
  else if (
    lower.includes('keep-head') ||
    lower.includes('keep head') ||
    lower.includes('keep up head')
  )
    actionId = 'Keep-Up-Head';

  if (actionId) {
    return { type: 'touch', id: actionId, quality };
  }

  return null;
}

export function ActionWheel() {
  const { stats, sessionId, addTouch, removeTouch, updateSession } = useActiveSession();
  const [selectedQuality, setSelectedQuality] = useState('Positive');
  const [lastLoggedAction, setLastLoggedAction] = useState(null);

  // Player & Session Details
  const [playerName, setPlayerName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('Select Position');
  const [playerNumber, setPlayerNumber] = useState('');
  const [trainingLocation, setTrainingLocation] = useState('');
  const [gameLocation, setGameLocation] = useState('');
  const [timeInTraining, setTimeInTraining] = useState(60);
  const [minutesPlayed, setMinutesPlayed] = useState(120);

  const [positionModalOpen, setPositionModalOpen] = useState(false);

  // Voice Command States
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [manualVoiceInput, setManualVoiceInput] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState(null);

  useEffect(() => {
    async function loadSavedData() {
      try {
        const [
          savedName,
          savedAge,
          savedPos,
          savedNum,
          savedTrainLoc,
          savedGameLoc,
          savedTime,
          savedMin,
          rawProfile,
        ] = await Promise.all([
          AsyncStorage.getItem('touch_playerName'),
          AsyncStorage.getItem('touch_age'),
          AsyncStorage.getItem('touch_position'),
          AsyncStorage.getItem('touch_number'),
          AsyncStorage.getItem('trainingLocation'),
          AsyncStorage.getItem('gameLocation'),
          AsyncStorage.getItem('timeInTraining'),
          AsyncStorage.getItem('minutesPlayed'),
          AsyncStorage.getItem('playerProfile'),
        ]);

        let profileObj = {};
        if (rawProfile) {
          try {
            profileObj = JSON.parse(rawProfile);
          } catch (e) {}
        }

        if (savedName) setPlayerName(savedName);
        else if (profileObj.fullName || profileObj.playerName)
          setPlayerName(profileObj.fullName || profileObj.playerName);

        if (savedAge) setAge(savedAge);
        else if (profileObj.age) setAge(String(profileObj.age));

        if (savedPos) setPosition(savedPos);
        else if (profileObj.position) setPosition(profileObj.position);

        if (savedNum) setPlayerNumber(savedNum);
        else if (profileObj.number || profileObj.jerseyNumber)
          setPlayerNumber(String(profileObj.number || profileObj.jerseyNumber));

        if (savedTrainLoc) setTrainingLocation(savedTrainLoc);
        if (savedGameLoc) setGameLocation(savedGameLoc);
        if (savedTime) setTimeInTraining(Number(savedTime));
        if (savedMin) setMinutesPlayed(Number(savedMin));
      } catch (e) {
        console.error('Error loading touch session data:', e);
      }
    }
    loadSavedData();
  }, []);

  const handleUpdatePlayerName = async (text) => {
    setPlayerName(text);
    await AsyncStorage.setItem('touch_playerName', text);
  };

  const handleUpdateAge = async (text) => {
    setAge(text);
    await AsyncStorage.setItem('touch_age', text);
  };

  const handleUpdatePosition = async (pos) => {
    setPosition(pos);
    setPositionModalOpen(false);
    await AsyncStorage.setItem('touch_position', pos);
  };

  const handleUpdatePlayerNumber = async (text) => {
    setPlayerNumber(text);
    await AsyncStorage.setItem('touch_number', text);
  };

  const handleUpdateTrainingLoc = async (text) => {
    setTrainingLocation(text);
    await AsyncStorage.setItem('trainingLocation', text);
  };

  const handleUpdateGameLoc = async (text) => {
    setGameLocation(text);
    await AsyncStorage.setItem('gameLocation', text);
  };

  const handleActionTap = async (actionId, overrideQuality = null) => {
    const isIndependent = [
      'Penalty',
      'Keep-Up-Feet',
      'Keep-Up-Head',
      'Yellow Card',
      'Red Card',
      'Missed Game',
      'Sub In',
      'Sub Out',
      'Injury',
    ].includes(actionId);

    const quality = isIndependent ? 'Event' : overrideQuality || selectedQuality;
    await addTouch(actionId, quality);
    setLastLoggedAction({ action: actionId, quality });
    setTimeout(() => setLastLoggedAction(null), 1200);
  };

  const handleEventTap = async (eventId) => {
    await addTouch(eventId, 'Event');
    setLastLoggedAction({ action: eventId, quality: 'Event' });
    setTimeout(() => setLastLoggedAction(null), 1200);
  };

  const handleEventDecrement = async (eventId) => {
    if (removeTouch) {
      await removeTouch(eventId);
    }
  };

  const processVoiceCommand = async (transcript) => {
    const result = parseVoiceCommand(transcript);
    if (!result) {
      setVoiceFeedback({
        type: 'error',
        message: `Command not recognized: "${transcript}"`,
      });
      setTimeout(() => setVoiceFeedback(null), 3000);
      return;
    }

    if (result.type === 'touch') {
      const effectiveQuality = result.quality || selectedQuality;
      if (result.quality) {
        setSelectedQuality(result.quality);
      }
      await handleActionTap(result.id, effectiveQuality);
      setVoiceFeedback({
        type: 'success',
        message: `✓ Recognized: ${effectiveQuality ? `${effectiveQuality} ` : ''}${result.id}`,
      });
      setTimeout(() => setVoiceFeedback(null), 2500);
    } else if (result.type === 'event') {
      await handleEventTap(result.id);
      setVoiceFeedback({
        type: 'success',
        message: `✓ Recognized: ${result.id}`,
      });
      setTimeout(() => setVoiceFeedback(null), 2500);
    }
  };

  const handleSaveSession = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('touch_playerName', playerName),
        AsyncStorage.setItem('touch_age', age),
        AsyncStorage.setItem('touch_position', position),
        AsyncStorage.setItem('touch_number', playerNumber),
        AsyncStorage.setItem('trainingLocation', trainingLocation),
        AsyncStorage.setItem('gameLocation', gameLocation),
        AsyncStorage.setItem('timeInTraining', String(timeInTraining)),
        AsyncStorage.setItem('minutesPlayed', String(minutesPlayed)),
      ]);

      if (updateSession) {
        await updateSession({
          playerName,
          age,
          position,
          playerNumber,
          trainingLocation,
          gameLocation,
          timeInTraining,
          minutesPlayed,
        });
      }
      Alert.alert('Saved', 'Touch counter session data saved successfully.');
    } catch (e) {
      console.error('Error saving touch session:', e);
    }
  };

  const handleResetSessionTouches = () => {
    if (!sessionId) return;
    Alert.alert(
      'Reset Touches',
      'Are you sure you want to reset all touches for this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.touches.where('sessionId').equals(sessionId).delete();
            } catch (error) {
              console.error('Error resetting touches:', error);
            }
          },
        },
      ]
    );
  };

  const total = stats.total || 0;
  const positiveCount = stats.good || 0;
  const negativeCount = stats.bad || 0;

  const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negativeCount / total) * 100) : 0;

  return (
    <View className="space-y-3 pb-6">
      {/* ── 1. TOUCH COUNTER TITLE BAR & VOICE MIC BUTTON ── */}
      <View className="flex-row items-center justify-between py-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl font-black uppercase text-white tracking-wider">
            TOUCH COUNTER
          </Text>

          <View className="px-2.5 py-0.5 rounded-full border border-red-500 flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <Text className="text-red-500 text-[10px] font-black uppercase tracking-wider">
              LIVE
            </Text>
          </View>
        </View>

        {/* Compact Voice Command Button */}
        <TouchableOpacity
          onPress={() => setIsVoiceModalOpen(true)}
          className="p-2 rounded-xl border border-white/10 bg-[#12151D] flex-row items-center gap-1.5"
          activeOpacity={0.7}
        >
          <Mic size={15} color="#FFFFFF" />
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">
            VOICE
          </Text>
        </TouchableOpacity>
      </View>

      {/* Voice Feedback Notification Toast */}
      {voiceFeedback && (
        <View
          className={`px-3 py-1.5 rounded-xl flex-row items-center justify-between border ${
            voiceFeedback.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50'
              : 'bg-emerald-950/90 border-emerald-500/50'
          }`}
        >
          <Text
            className={`text-xs font-bold flex-1 ${
              voiceFeedback.type === 'error' ? 'text-rose-200' : 'text-emerald-200'
            }`}
          >
            {voiceFeedback.message}
          </Text>
          <TouchableOpacity onPress={() => setVoiceFeedback(null)}>
            <Text className="text-white/60 text-xs ml-2">✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── 2. PLAYER INFORMATION SECTION (COMPACT 4 ROWS ABOVE PITCH) ── */}
      <View className="space-y-2 p-3 rounded-2xl border border-white/10 bg-[#0E121A]">
        {/* Row 1: PLAYER NAME & AGE */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70 mb-1">
              PLAYER NAME
            </Text>
            <TextInput
              placeholder="Enter player name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={playerName}
              onChangeText={handleUpdatePlayerName}
              className="bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold"
            />
          </View>

          <View style={{ width: 85 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70 mb-1">
              AGE
            </Text>
            <TextInput
              placeholder="Age"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="numeric"
              value={age}
              onChangeText={handleUpdateAge}
              className="bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold text-center"
            />
          </View>
        </View>

        {/* Row 2: PLAYER POSITION & NUMBER */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70 mb-1">
              PLAYER POSITION
            </Text>
            <TouchableOpacity
              onPress={() => setPositionModalOpen(true)}
              className="bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 flex-row items-center justify-between"
            >
              <Text
                numberOfLines={1}
                className={`text-xs font-semibold flex-1 pr-1 ${
                  position && position !== 'Select Position'
                    ? 'text-white'
                    : 'text-white/40'
                }`}
              >
                {position}
              </Text>
              <ChevronDown size={14} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>

          <View style={{ width: 85 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70 mb-1">
              NUMBER
            </Text>
            <TextInput
              placeholder="No."
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="numeric"
              value={playerNumber}
              onChangeText={handleUpdatePlayerNumber}
              className="bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold text-center"
            />
          </View>
        </View>

        {/* Row 3: TRAINING LOCATION */}
        <View className="space-y-1">
          <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70">
            TRAINING LOCATION
          </Text>
          <TextInput
            placeholder="Enter training location"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={trainingLocation}
            onChangeText={handleUpdateTrainingLoc}
            className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold"
          />
        </View>

        {/* Row 4: GAME LOCATION */}
        <View className="space-y-1">
          <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70">
            GAME LOCATION
          </Text>
          <TextInput
            placeholder="Enter game location"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={gameLocation}
            onChangeText={handleUpdateGameLoc}
            className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold"
          />
        </View>
      </View>

      {/* ── 3. GREEN FOOTBALL PITCH (WHITE CENTRAL COUNTER & WHITE TEXT) ── */}
      <View className="relative rounded-2xl p-5 shadow-2xl overflow-hidden border border-emerald-500/30 bg-[#0F3E22] items-center justify-center min-h-[200px]">
        {/* Pitch Lines Vector Background */}
        <View className="absolute inset-0 opacity-20 items-center justify-center pointer-events-none">
          <Svg width="100%" height="100%" viewBox="0 0 400 240" fill="none">
            <Rect x="15" y="15" width="370" height="210" rx="6" stroke="#FFFFFF" strokeWidth="1.5" />
            <Line x1="200" y1="15" x2="200" y2="225" stroke="#FFFFFF" strokeWidth="1.5" />
            <Circle cx="200" cy="120" r="45" stroke="#FFFFFF" strokeWidth="1.5" />
            <Circle cx="200" cy="120" r="2" fill="#FFFFFF" />
            <Rect x="15" y="60" width="70" height="120" stroke="#FFFFFF" strokeWidth="1.5" />
            <Rect x="315" y="60" width="70" height="120" stroke="#FFFFFF" strokeWidth="1.5" />
          </Svg>
        </View>

        {/* Central White Ring Counter Gauge (White border and White text) */}
        <View className="relative z-10 w-36 h-36 rounded-full border-4 border-white bg-black/40 items-center justify-center shadow-lg">
          <Text className="text-5xl font-black text-white tracking-tight">
            {total}
          </Text>
          <Text className="text-[8px] font-black uppercase tracking-widest text-white/80">
            TOTAL TOUCHES
          </Text>
          <Text
            style={{ letterSpacing: 2 }}
            className="text-[11px] font-black uppercase text-white mt-0.5"
          >
            TOUCHES
          </Text>

          {lastLoggedAction && (
            <View className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-[#10B981] shadow">
              <Text className="text-[9px] font-black uppercase text-white">
                +{lastLoggedAction.action}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── 4. POSITIVE vs NEGATIVE SUMMARY CARDS ── */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Positive Card */}
        <View
          style={{ flex: 1 }}
          className="p-3 rounded-2xl border border-emerald-500/30 bg-[#0E1A14] space-y-1.5 shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              POSITIVE
            </Text>
            <ThumbsUp size={14} color="#34D399" />
          </View>
          <View className="flex-row items-baseline justify-between">
            <Text className="text-2xl font-black text-emerald-400">
              {positiveCount}
            </Text>
            <Text className="text-[10px] font-bold text-emerald-400/80">
              {positivePercent}%
            </Text>
          </View>
          <View className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <View
              className="bg-emerald-400 h-full"
              style={{ width: `${positivePercent}%` }}
            />
          </View>
        </View>

        {/* Negative Card */}
        <View
          style={{ flex: 1 }}
          className="p-3 rounded-2xl border border-rose-500/30 bg-[#1F1014] space-y-1.5 shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-black uppercase tracking-wider text-rose-400">
              NEGATIVE
            </Text>
            <ThumbsDown size={14} color="#F87171" />
          </View>
          <View className="flex-row items-baseline justify-between">
            <Text className="text-2xl font-black text-rose-400">
              {negativeCount}
            </Text>
            <Text className="text-[10px] font-bold text-rose-400/80">
              {negativePercent}%
            </Text>
          </View>
          <View className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <View
              className="bg-rose-400 h-full"
              style={{ width: `${negativePercent}%` }}
            />
          </View>
        </View>
      </View>

      {/* ── 5. QUALITY SELECTOR BANNER ── */}
      <View className="space-y-2 pt-1">
        <Text className="text-xs font-black uppercase tracking-wider text-white/90 text-center">
          HOW WAS THE PLAYERS FIRST TOUCH?
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedQuality('Positive')}
            style={{ flex: 1 }}
            className={`py-2.5 px-4 rounded-xl flex-row items-center justify-center gap-2 ${
              selectedQuality === 'Positive'
                ? 'bg-emerald-500 shadow-md shadow-emerald-500/30'
                : 'bg-[#141720] border border-white/10'
            }`}
          >
            <ThumbsUp size={14} color="white" />
            <Text className="text-white text-xs font-black uppercase tracking-wider">
              Positive
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedQuality('Negative')}
            style={{ flex: 1 }}
            className={`py-2.5 px-4 rounded-xl flex-row items-center justify-center gap-2 ${
              selectedQuality === 'Negative'
                ? 'bg-rose-500 shadow-md shadow-rose-500/30'
                : 'bg-[#141720] border border-white/10'
            }`}
          >
            <ThumbsDown size={14} color="white" />
            <Text className="text-white text-xs font-black uppercase tracking-wider">
              Negative
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 6. COMPACT 3-COLUMN MAIN ACTIONS GRID ── */}
      <View className="space-y-1.5 pt-1">
        <Text className="text-[10px] font-black uppercase tracking-wider text-white/60 px-0.5">
          TOUCH ACTIONS
        </Text>

        {[
          ACTIONS_CONFIG.slice(0, 3),
          ACTIONS_CONFIG.slice(3, 6),
          ACTIONS_CONFIG.slice(6, 9),
          ACTIONS_CONFIG.slice(9, 12),
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', gap: 8 }}>
            {row.map((item) => {
              const Icon = item.icon;
              const count = stats[item.id] || 0;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleActionTap(item.id)}
                  style={{ flex: 1, height: 96 }}
                  className="p-2 rounded-2xl border border-white/10 bg-[#12151D] items-center justify-between shadow-sm relative"
                  activeOpacity={0.7}
                >
                  {count > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        if (removeTouch) removeTouch(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/10 items-center justify-center z-10"
                    >
                      <Text className="text-white/80 font-black text-[10px]">-</Text>
                    </TouchableOpacity>
                  )}

                  <View className="w-8 h-8 rounded-xl bg-white/5 items-center justify-center">
                    <Icon size={16} color="rgba(255, 255, 255, 0.7)" />
                  </View>

                  <View className="items-center">
                    <Text className="text-base font-black text-white">{count}</Text>
                    <Text
                      numberOfLines={1}
                      className="text-[8px] font-black uppercase tracking-wider text-white/60 text-center"
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── 7. COMPACT 3-COLUMN MATCH EVENTS (STRICTLY INDEPENDENT) ── */}
      <View className="space-y-1.5 pt-1">
        <View className="flex-row items-center justify-between px-0.5">
          <Text className="text-[10px] font-black uppercase tracking-wider text-white/60">
            MATCH EVENTS
          </Text>
          <Text className="text-[9px] text-white/40">Events do not affect touches</Text>
        </View>

        {[
          MATCH_EVENTS_CONFIG.slice(0, 3),
          MATCH_EVENTS_CONFIG.slice(3, 6),
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', gap: 8 }}>
            {row.map((item) => {
              const count = stats[item.id] || 0;
              const isYellow = item.type === 'yellow-card';
              const isRed = item.type === 'red-card';

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleEventTap(item.id)}
                  style={{ flex: 1, height: 96 }}
                  className="p-2 rounded-2xl border border-white/10 bg-[#12151D] items-center justify-between shadow-sm relative"
                  activeOpacity={0.7}
                >
                  {count > 0 && (
                    <TouchableOpacity
                      onPress={() => handleEventDecrement(item.id)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/10 items-center justify-center z-10"
                    >
                      <Text className="text-white/80 font-black text-[10px]">-</Text>
                    </TouchableOpacity>
                  )}

                  {/* Icon Box */}
                  {isYellow ? (
                    <View className="w-5 h-5 rounded border border-yellow-400/80 bg-yellow-400/20 items-center justify-center">
                      <View className="w-2 h-2.5 bg-yellow-400 rounded-sm" />
                    </View>
                  ) : isRed ? (
                    <View className="w-5 h-5 rounded border border-red-500/80 bg-red-500/20 items-center justify-center">
                      <View className="w-2 h-2.5 bg-red-500 rounded-sm" />
                    </View>
                  ) : (
                    <View className="w-5 h-5 rounded border border-white/20 bg-white/5 items-center justify-center">
                      <View className="w-1.5 h-1.5 bg-white/60 rounded-sm" />
                    </View>
                  )}

                  <View className="items-center">
                    <Text
                      className={`text-base font-black ${
                        isYellow
                          ? 'text-yellow-400'
                          : isRed
                          ? 'text-red-400'
                          : 'text-white'
                      }`}
                    >
                      {count}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className={`text-[7.5px] font-black uppercase tracking-wider text-center ${
                        isYellow
                          ? 'text-yellow-400/90'
                          : isRed
                          ? 'text-red-400/90'
                          : 'text-white/60'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── 8. TIME IN TRAINING & MINUTES PLAYED ADJUSTERS ── */}
      <View className="space-y-2.5 pt-2 p-3 rounded-2xl border border-white/10 bg-[#0E121A]">
        {/* Time In Training Adjuster */}
        <View className="space-y-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70">
              TIME IN TRAINING
            </Text>
            <Text className="text-[#FF4422] font-black text-xs">
              {timeInTraining} Minutes
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setTimeInTraining((prev) => Math.max(0, prev - 15))}
              className="py-1.5 px-3 rounded-lg bg-white/10 border border-white/20"
            >
              <Text className="text-white font-black text-xs">-15m</Text>
            </TouchableOpacity>
            <View className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden">
              <View
                className="bg-[#FF4422] h-full"
                style={{ width: `${Math.min(100, (timeInTraining / 180) * 100)}%` }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setTimeInTraining((prev) => Math.min(240, prev + 15))}
              className="py-1.5 px-3 rounded-lg bg-white/10 border border-white/20"
            >
              <Text className="text-white font-black text-xs">+15m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Minutes Played Adjuster */}
        <View className="space-y-1 pt-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-[9.5px] font-black uppercase tracking-wider text-white/70">
              MINUTES PLAYED
            </Text>
            <Text className="text-[#FF4422] font-black text-xs">
              {minutesPlayed} Minutes
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setMinutesPlayed((prev) => Math.max(0, prev - 10))}
              className="py-1.5 px-3 rounded-lg bg-white/10 border border-white/20"
            >
              <Text className="text-white font-black text-xs">-10m</Text>
            </TouchableOpacity>
            <View className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden">
              <View
                className="bg-[#FF4422] h-full"
                style={{ width: `${Math.min(100, (minutesPlayed / 180) * 100)}%` }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setMinutesPlayed((prev) => Math.min(180, prev + 10))}
              className="py-1.5 px-3 rounded-lg bg-white/10 border border-white/20"
            >
              <Text className="text-white font-black text-xs">+10m</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 9. ACTION BUTTONS (RESET, SHARE, PDF, SAVE) ── */}
      <SectionActionBar
        onReset={handleResetSessionTouches}
        onSave={handleSaveSession}
        sectionKey="touch-counter"
      />

      {/* Position Selector Modal */}
      <Modal
        visible={positionModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPositionModalOpen(false)}
      >
        <View className="flex-1 bg-black/80 justify-center p-4">
          <View className="bg-[#111622] border border-white/20 rounded-2xl max-h-[80%] overflow-hidden">
            <View className="p-4 border-b border-white/10 flex-row justify-between items-center">
              <Text className="text-white font-black text-sm uppercase tracking-wider">
                Select Position
              </Text>
              <TouchableOpacity onPress={() => setPositionModalOpen(false)}>
                <X size={18} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-2">
              {POSITIONS.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  onPress={() => handleUpdatePosition(pos)}
                  className={`p-3 rounded-xl flex-row items-center justify-between mb-1 ${
                    position === pos ? 'bg-[#FF4422]/20 border border-[#FF4422]' : ''
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      position === pos ? 'text-[#FF4422]' : 'text-white/80'
                    }`}
                  >
                    {pos}
                  </Text>
                  {position === pos && <Check size={14} color="#FF4422" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Voice Command Dialog Modal */}
      <Modal
        visible={isVoiceModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVoiceModalOpen(false)}
      >
        <View className="flex-1 bg-black/80 justify-center p-4">
          <View className="bg-[#12151D] border border-white/20 rounded-2xl p-5 space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Mic size={18} color="#FF4422" />
                <Text className="text-sm font-black uppercase text-white tracking-wider">
                  Voice Commands
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsVoiceModalOpen(false)}>
                <X size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-white/70">
              Speak or enter a voice command:
              {'\n'}• "positive pass"
              {'\n'}• "negative shot"
              {'\n'}• "positive dribble"
              {'\n'}• "yellow card" / "red card"
              {'\n'}• "injury" / "sub in" / "sub out"
            </Text>

            <TextInput
              placeholder="e.g. positive pass"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={manualVoiceInput}
              onChangeText={setManualVoiceInput}
              className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-semibold"
            />

            <View className="flex-row gap-2 pt-1">
              <TouchableOpacity
                onPress={() => {
                  processVoiceCommand(manualVoiceInput);
                  setManualVoiceInput('');
                  setIsVoiceModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#FF4422] items-center justify-center"
              >
                <Text className="text-white text-xs font-black uppercase tracking-wider">
                  Execute Command
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsVoiceModalOpen(false)}
                className="px-3 py-2 rounded-xl bg-white/10 items-center justify-center"
              >
                <Text className="text-white/80 text-xs font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ActionWheel;
