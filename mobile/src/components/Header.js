import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Settings, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export function Header({ onOpenMenu }) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-3 h-14 bg-[#07090E] border-b border-white/10 z-40">
      {/* Left: Menu button + TOUCHES Icon & Logo (White) */}
      <View className="flex-row items-center gap-2 flex-shrink-0">
        {onOpenMenu && (
          <TouchableOpacity
            onPress={onOpenMenu}
            className="p-1 rounded-lg"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Menu size={22} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          className="flex-row items-center gap-1.5"
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/touches_icon.png')}
            className="w-7 h-7"
            style={{ tintColor: '#FFFFFF' }}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/touches_logo.png')}
            className="w-24 h-6"
            style={{ tintColor: '#FFFFFF' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Right: Settings Gear (Foot icon & Profile button removed cleanly) */}
      <View className="flex-row items-center gap-2.5 flex-shrink-0">
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
