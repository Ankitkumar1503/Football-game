import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Home,
  Timer,
  Activity,
  Bot,
  User,
  Calendar,
  Flame,
  Award,
  Users,
  Clipboard,
  MessageSquare,
  StickyNote,
  Settings,
  FileText,
  ChevronRight,
} from 'lucide-react-native';

const DRAWER_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { label: 'HOME', icon: Home, route: 'Dashboard' },
      { label: 'TOUCH COUNTER', icon: Timer, route: 'TouchCounter' },
      { label: 'PLAYER STATS', icon: Activity, route: 'Stats' },
      { label: 'AI PLAYER AGENT', icon: Bot, route: 'AiAgent' },
      { label: 'PLAYER PASSPORT', icon: User, route: 'Passport' },
    ],
  },
  {
    title: 'TRAINING & PLAYER TOOLS',
    items: [
      { label: 'MATCH DAY PREP', icon: Calendar, route: 'MatchPrep' },
      { label: '30-DAY CHALLENGE', icon: Flame, route: 'Challenge' },
      { label: 'ROSTER', icon: Award, route: 'Grade' },
      { label: 'STARTING LINEUP', icon: Users, route: 'Lineup' },
      { label: 'PLAYER EVALUATION', icon: Clipboard, route: 'Evaluation' },
      { label: 'PLAYER REFLECTION', icon: MessageSquare, route: 'Reflection' },
      { label: 'NOTE TO COACH', icon: StickyNote, route: 'NoteToCoach' },
    ],
  },
  {
    title: 'SETTINGS & INFO',
    items: [
      { label: 'SETTINGS', icon: Settings, route: 'Settings' },
      { label: 'USAGE POLICY', icon: FileText, route: 'Policy' },
    ],
  },
];

export function NavigationDrawer({ visible, onClose, currentRoute, onNavigate }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#07090E' }}>
        {/* Compact Drawer Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0C0E14',
          }}
        >
          {/* Left spacer matching close button width for exact centering */}
          <View style={{ width: 36, height: 36 }} />

          {/* Centered Brand Wordmark */}
          <Image
            source={require('../../assets/touches.png')}
            style={{ width: 110, height: 28 }}
            resizeMode="contain"
          />

          {/* Right Close Target */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 18,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Navigation List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 14,
            paddingTop: 8,
            paddingBottom: 36,
          }}
          showsVerticalScrollIndicator={false}
        >
          {DRAWER_SECTIONS.map((section) => (
            <View key={section.title} style={{ marginBottom: 6 }}>
              {/* Subtle Section Divider & Title */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 6,
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 9.5,
                    fontWeight: '900',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: '#FACC15',
                  }}
                >
                  {section.title}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    marginLeft: 10,
                  }}
                />
              </View>

              {/* Section Items */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;

                return (
                  <TouchableOpacity
                    key={item.route}
                    onPress={() => onNavigate(item.route)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      height: 48,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 4,
                      backgroundColor: isActive
                        ? 'rgba(255, 68, 34, 0.14)'
                        : 'rgba(255, 255, 255, 0.03)',
                      borderWidth: 1,
                      borderColor: isActive
                        ? 'rgba(255, 68, 34, 0.45)'
                        : 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Fixed Icon Container: Guarantees every label aligns horizontally */}
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        backgroundColor: isActive
                          ? 'rgba(255, 68, 34, 0.22)'
                          : 'rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <Icon
                        size={16}
                        color={isActive ? '#FF4422' : 'rgba(255, 255, 255, 0.7)'}
                      />
                    </View>

                    {/* Text Label */}
                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        fontSize: 11.5,
                        fontWeight: isActive ? '900' : '700',
                        letterSpacing: 0.8,
                        textTransform: 'uppercase',
                        color: isActive ? '#FF4422' : '#FFFFFF',
                      }}
                    >
                      {item.label}
                    </Text>

                    {/* Right Chevron */}
                    <ChevronRight
                      size={14}
                      color={isActive ? '#FF4422' : 'rgba(255, 255, 255, 0.2)'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Drawer Footer Branding */}
          <View style={{ alignItems: 'center', paddingTop: 18, paddingBottom: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginBottom: 3,
              }}
            >
              <Image
                source={require('../../assets/right_foot.png')}
                style={{ width: 13, height: 13 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  letterSpacing: 2,
                  fontSize: 9,
                  fontWeight: '900',
                  color: 'rgba(255, 255, 255, 0.35)',
                  textTransform: 'uppercase',
                }}
              >
                FOOTBALLER ATHLETICS™
              </Text>
            </View>
            <Text
              style={{
                letterSpacing: 1.5,
                fontSize: 7.5,
                color: 'rgba(255, 255, 255, 0.2)',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}
            >
              TRACK • REFLECT • IMPROVE
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default NavigationDrawer;
