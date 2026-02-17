import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from "nativewind";
import { Layout } from '../components/Layout';
import { BottomBar } from '../components/sections/BottomBar';

const StyledText = styled(Text);
const StyledView = styled(View);

export function PolicyScreen() {
  return (
    <Layout>
      <ScrollView className="flex-1 px-4 py-6 mb-16">
          <View className="mb-8 items-center">
            <StyledText className="text-xl font-bold uppercase tracking-wider text-white">
              FOOTBALLER <StyledText className="font-normal">ATHLETICS</StyledText>
            </StyledText>
          </View>

          <View className="gap-y-6">
              <View>
                <StyledText className="text-white font-bold uppercase mb-1">TOUCHES™ APP</StyledText>
                <StyledText className="text-xs text-gray-400">
                  © 2026 Coach Clem Murdock – Footballer Athletics™ All Rights Reserved.
                </StyledText>
              </View>

              <View>
                <StyledText className="text-white font-bold uppercase mb-2">1. PRIVACY POLICY</StyledText>
                <StyledText className="text-xs text-gray-300 mb-4">
                  Effective Date: January 1, 2026{'\n'}
                  Last Updated: January 1, 2026
                </StyledText>

                 <View className="gap-y-4">
                     <View>
                         <StyledText className="text-white font-bold text-xs mb-1">1.1 Introduction</StyledText>
                         <StyledText className="text-xs text-gray-300">
                            Touches™ (“we,” “our,” “us”) is a player development and match reflection application operated by Footballer Athletics™, founded by Coach Clem Murdock.
                         </StyledText>
                     </View>
                     
                     <View>
                         <StyledText className="text-white font-bold text-xs mb-1">1.2 Information We Collect</StyledText>
                         <StyledText className="text-xs text-gray-300 mb-2 font-bold text-white">Information You Provide Directly:</StyledText>
                         <StyledText className="text-xs text-gray-300 mb-2">
                             Player name, Age, Team, club, position, and match details. Data entered into stats and grades.
                         </StyledText>
                         <StyledText className="text-xs text-gray-300 mb-2 font-bold text-white">Automatically Collected Information:</StyledText>
                         <StyledText className="text-xs text-gray-300">
                            App usage analytics, Device type.
                         </StyledText>
                     </View>
                 </View>
              </View>

              <View>
                   <StyledText className="text-white font-bold uppercase mb-2">2. TERMS OF SERVICE</StyledText>
                   <StyledText className="text-xs text-gray-300">
                       By downloading, accessing, or using Touches™, you agree to these Terms. If you do not agree, do not use the app.
                   </StyledText>
              </View>

              <View>
                   <StyledText className="text-white font-bold uppercase mb-2">8. CONTACT INFORMATION</StyledText>
                   <StyledText className="text-xs font-bold text-white">Footballer Athletics™ TOUCHES</StyledText>
                   <StyledText className="text-xs text-gray-300">Founder: Coach Clem Murdock</StyledText>
                   <StyledText className="text-xs text-gray-300">Email: footballerathletics@gmail.com</StyledText>
              </View>

              <View className="mt-8 pt-4 border-t border-gray-800 items-center">
                  <StyledText className="text-[10px] text-gray-400 text-center">
                    © 2026 Clem Murdock - Footballer Athletics - Touches. All Rights Reserved.
                  </StyledText>
                  <StyledText className="text-[10px] font-bold text-white mt-2 uppercase">
                    FOOTBALLER ATHLETICS
                  </StyledText>
              </View>
          </View>
      </ScrollView>
      <BottomBar />
    </Layout>
  );
}
