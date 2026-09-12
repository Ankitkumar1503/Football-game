import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Home,
  Pointer,
  BarChart3,
  Bot,
  Contact2,
  Calendar,
  Flame,
  Award,
  Users,
  Star,
  MessageSquare,
  StickyNote,
} from 'lucide-react-native';
import { useActiveSession } from '../hooks/useActiveSession';

export function BottomBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const { session } = useActiveSession();

  const isRightFoot = (session?.activeFooter || 'RIGHT').toUpperCase() === 'RIGHT';

  // Row 1: Exactly 6 items
  const topRow = [
    { id: 'home', label: 'Home', icon: Home, route: 'Dashboard' },
    { id: 'counter', label: 'Counter', icon: Pointer, route: 'TouchCounter' },
    { id: 'stats', label: 'Stats', icon: BarChart3, route: 'Stats' },
    { id: 'agent', label: 'Agent', icon: Bot, route: 'AiAgent' },
    { id: 'passport', label: 'Passport', icon: Contact2, route: 'Passport' },
    { id: 'match-prep', label: 'Match Prep', icon: Calendar, route: 'MatchPrep' },
  ];

  // Row 2: Exactly 6 items
  const bottomRow = [
    { id: 'challenge', label: '30-Day', icon: Flame, route: 'Challenge' },
    { id: 'roster', label: 'Roster', icon: Award, route: 'Grade' },
    { id: 'lineup', label: 'Line Up', icon: Users, route: 'Lineup' },
    { id: 'evaluation', label: 'Evaluation', icon: Star, route: 'Evaluation' },
    { id: 'reflection', label: 'Reflection', icon: MessageSquare, route: 'Reflection' },
    { id: 'note-to-coach', label: 'Coach Note', icon: StickyNote, route: 'NoteToCoach' },
  ];

  return (
    <View className="bg-[#0C0E14] border-t border-white/10 pt-2 pb-1.5 px-1 z-30 shadow-2xl">
      {/* Row 1: 6 Icon & Label Buttons */}
      <View className="flex-row items-center w-full mb-1">
        {topRow.map((item) => {
          const Icon = item.icon;
          const isActive = route.name === item.route;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate(item.route)}
              className="flex-1 items-center justify-center py-0.5"
              activeOpacity={0.7}
            >
              <Icon size={16} color={isActive ? '#FF4422' : 'rgba(255,255,255,0.45)'} />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                className={`text-[8px] font-bold mt-0.5 uppercase text-center ${
                  isActive ? 'text-[#FF4422] font-black' : 'text-white/50'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Row 2: 6 Icon & Label Buttons */}
      <View className="flex-row items-center w-full mb-1">
        {bottomRow.map((item) => {
          const Icon = item.icon;
          const isActive = route.name === item.route;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate(item.route)}
              className="flex-1 items-center justify-center py-0.5"
              activeOpacity={0.7}
            >
              <Icon size={16} color={isActive ? '#FF4422' : 'rgba(255,255,255,0.45)'} />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                className={`text-[8px] font-bold mt-0.5 uppercase text-center ${
                  isActive ? 'text-[#FF4422] font-black' : 'text-white/50'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Branding Line */}
      <View className="flex-row items-center justify-center gap-1.5 pt-1 border-t border-white/5">
        <Image
          source={
            isRightFoot
              ? require('../../assets/right_foot.png')
              : require('../../assets/left_foot.png')
          }
          className="w-3.5 h-3.5"
          resizeMode="contain"
        />
        <Text
          style={{ letterSpacing: 1.5 }}
          className="text-[7.5px] font-black uppercase text-white/40"
        >
          FOOTBALLER ATHLETICS™
        </Text>
      </View>
    </View>
  );
}

export default BottomBar;
