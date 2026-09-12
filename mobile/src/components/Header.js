import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Settings, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useActiveSession } from '../hooks/useActiveSession';
import { useAuth } from '../contexts/AuthContext';

export function Header({ onOpenMenu }) {
  const navigation = useNavigation();
  const { session } = useActiveSession();
  const { user } = useAuth();

  const playerName =
    user?.name ||
    user?.fullName ||
    user?.playerName ||
    session?.playerName ||
    'Player';

  const activeFoot = (
    session?.activeFooter ||
    user?.footer ||
    user?.activeFooter ||
    'RIGHT'
  ).toUpperCase();

  const isRightFoot = activeFoot === 'RIGHT';

  const playerInitial =
    playerName && playerName.trim().length > 0
      ? playerName.trim().charAt(0).toUpperCase()
      : 'P';

  return (
    <View className="flex-row items-center justify-between px-3 h-14 bg-[#07090E] border-b border-white/10 z-40">
      {/* Left: Menu button + Yellow Ü Icon & Logo */}
      <View className="flex-row items-center gap-2 flex-shrink-0">
        <TouchableOpacity
          onPress={onOpenMenu}
          className="p-1 rounded-lg"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Menu size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          className="flex-row items-center gap-1.5"
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/touches_icon.png')}
            className="w-7 h-7"
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/touches_logo.png')}
            className="w-24 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Right: Foot Icon + Settings Gear + User Initial Badge */}
      <View className="flex-row items-center gap-2.5 flex-shrink-0">
        {/* Foot Icon */}
        <View className="w-7 h-7 items-center justify-center">
          <Image
            source={
              isRightFoot
                ? require('../../assets/right_foot.png')
                : require('../../assets/left_foot.png')
            }
            className="w-7 h-7"
            resizeMode="contain"
          />
        </View>

        {/* Settings Gear */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings size={20} color="white" />
        </TouchableOpacity>

        {/* Profile Initial Badge */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          className="w-7 h-7 rounded-full bg-[#FF4422] items-center justify-center border border-white/20 shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white font-black text-xs">{playerInitial}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
