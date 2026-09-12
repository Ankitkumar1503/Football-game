import React from 'react';
import { View, Text } from 'react-native';
import { Layout } from '../components/Layout';
import { SectionActionBar } from '../components/ui/SectionActionBar';

export function PolicyScreen() {
  return (
    <Layout>
      <View className="space-y-6 pb-6">
        <View className="items-center mb-2">
          <Text className="text-xl font-black uppercase tracking-wider text-white">
            FOOTBALLER <Text className="font-normal text-yellow-400">ATHLETICS</Text>
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-white font-bold uppercase mb-1">TOUCHES™ APP</Text>
            <Text className="text-xs text-gray-400">
              © 2026 Coach Clem Murdock – Footballer Athletics™ All Rights Reserved.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="text-white font-black uppercase text-sm">1. PRIVACY POLICY</Text>
            <Text className="text-[11px] text-gray-300">
              Effective Date: January 1, 2026 · Last Updated: January 1, 2026
            </Text>
            <Text className="text-xs text-gray-300 leading-relaxed">
              Touches™ is a player development and match reflection application operated by Footballer Athletics™, founded by Coach Clem Murdock.
            </Text>
            <Text className="text-xs text-gray-300 leading-relaxed">
              All player names, actions, touches, and evaluation records are stored privately on your local device. We do not sell or distribute personal data to third parties.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="text-white font-black uppercase text-sm">2. TERMS OF SERVICE</Text>
            <Text className="text-xs text-gray-300 leading-relaxed">
              By using Touches™, you agree to these Terms. The application is designed solely for athletic training, match logging, self-reflection, and coaching feedback.
            </Text>
          </View>

          <View className="space-y-1">
            <Text className="text-white font-black uppercase text-sm">3. CONTACT INFORMATION</Text>
            <Text className="text-xs font-bold text-white">Footballer Athletics™ TOUCHES</Text>
            <Text className="text-xs text-gray-300">Founder: Coach Clem Murdock</Text>
            <Text className="text-xs text-gray-300">Email: footballerathletics@gmail.com</Text>
          </View>
        </View>

        <SectionActionBar sectionKey="policy" />
      </View>
    </Layout>
  );
}

export default PolicyScreen;
