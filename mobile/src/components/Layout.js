import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Keyboard,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from './Header';
import { BottomBar } from './BottomBar';
import { NavigationDrawer } from './NavigationDrawer';

export function Layout({
  children,
  hideHeader = false,
  hideBottomBar = false,
  scrollable = true,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Global Keyboard Handling
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const keyboardHeightRef = useRef(0);
  const isKeyboardVisibleRef = useRef(false);

  const scrollToInputNode = (inputNode, kbHeight) => {
    if (!inputNode || !scrollViewRef.current || !scrollable) return;

    try {
      const effectiveKbHeight = kbHeight || keyboardHeightRef.current || 280;
      const windowHeight = Dimensions.get('window').height;
      const keyboardTop = windowHeight - effectiveKbHeight;

      if (typeof inputNode.measureInWindow === 'function') {
        inputNode.measureInWindow((x, y, width, height) => {
          if (height <= 0 && width <= 0) return;

          const inputBottom = y + height;
          const targetBottomMargin = 40; // comfortable breathing room above keyboard
          const cutoff = keyboardTop - targetBottomMargin;

          if (inputBottom > cutoff) {
            const neededScroll = inputBottom - cutoff;
            const targetY = (scrollOffsetRef.current || 0) + neededScroll;
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, targetY),
              animated: true,
            });
          } else if (y < 60) {
            // If input is scrolled partially behind the top header
            const neededScroll = 60 - y;
            const targetY = Math.max(0, (scrollOffsetRef.current || 0) - neededScroll);
            scrollViewRef.current?.scrollTo({
              y: targetY,
              animated: true,
            });
          }
        });
      } else {
        const scrollResponder = scrollViewRef.current?.getScrollResponder?.();
        if (scrollResponder?.scrollNativeHandleToKeyboard) {
          scrollResponder.scrollNativeHandleToKeyboard(inputNode, 60, true);
        }
      }
    } catch (err) {
      console.warn('Error auto-scrolling to input:', err);
    }
  };

  useEffect(() => {
    const onKeyboardShow = (e) => {
      const height = e?.endCoordinates?.height || 280;
      setKeyboardHeight(height);
      keyboardHeightRef.current = height;
      setIsKeyboardVisible(true);
      isKeyboardVisibleRef.current = true;

      if (scrollable) {
        setTimeout(() => {
          const input = TextInput.State?.currentlyFocusedInput
            ? TextInput.State.currentlyFocusedInput()
            : null;
          if (input) {
            scrollToInputNode(input, height);
          }
        }, 80);
      }
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
      keyboardHeightRef.current = 0;
      setIsKeyboardVisible(false);
      isKeyboardVisibleRef.current = false;
    };

    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardHide
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollable]);

  // Track focused input changes while keyboard is open
  useEffect(() => {
    if (!isKeyboardVisible || !scrollable) return;

    let lastFocused = TextInput.State?.currentlyFocusedInput
      ? TextInput.State.currentlyFocusedInput()
      : null;

    const interval = setInterval(() => {
      if (!isKeyboardVisibleRef.current) return;
      const current = TextInput.State?.currentlyFocusedInput
        ? TextInput.State.currentlyFocusedInput()
        : null;
      if (current && current !== lastFocused) {
        lastFocused = current;
        scrollToInputNode(current, keyboardHeightRef.current);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isKeyboardVisible, scrollable]);

  const handleNavigate = (routeName) => {
    setIsMenuOpen(false);
    navigation.navigate(routeName);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[#07090E]">
      {/* Top Header */}
      {!hideHeader && <Header onOpenMenu={() => setIsMenuOpen(true)} />}

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {scrollable ? (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-3 py-2"
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: isKeyboardVisible ? Math.max(keyboardHeight, 280) + 40 : 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
            }}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 px-3 py-2">{children}</View>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Navigation: hidden when keyboard is open to prevent obstructing inputs */}
      {!hideBottomBar && !isKeyboardVisible && <BottomBar />}

      {/* Modern Navigation Drawer */}
      <NavigationDrawer
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentRoute={route.name}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}

export default Layout;
