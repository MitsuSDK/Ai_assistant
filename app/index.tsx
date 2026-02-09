import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/components/theme';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(0)).current;
  const arrowMotion = useRef(new Animated.Value(0)).current;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    Animated.timing(arrowMotion, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [arrowMotion, isActive]);

  const spinRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const arrowRotate = arrowMotion.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const arrowShift = arrowMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBg }]}>
      <ThemeToggle
        style={[styles.themeToggle, { top: Math.max(16, insets.top + 8) }]}
      />
      <View
        style={[
          styles.group,
          {
            backgroundColor: colors.surfaceBg,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.accent, borderColor: colors.surfaceBorder },
            pressed && [styles.buttonActive, { backgroundColor: colors.accentActive }],
          ]}
          onHoverIn={() => setIsActive(true)}
          onHoverOut={() => setIsActive(false)}
          onPressIn={() => setIsActive(true)}
          onPressOut={() => setIsActive(false)}
          onPress={() => router.push('/chat')}
        >
          <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
            <Ionicons name="help-circle-outline" size={16} color={colors.accentText} />
          </Animated.View>
          <Text style={[styles.buttonText, { color: colors.accentText }]}>
            Get Started
          </Text>
        </Pressable>

        <Animated.View
          style={[
            styles.arrowBubble,
            {
              backgroundColor: colors.arrowBubbleBg,
              borderColor: colors.arrowBubbleBorder,
              transform: [{ translateX: arrowShift }, { rotate: arrowRotate }],
            },
          ]}
        >
          <Ionicons name="arrow-forward" size={14} color={colors.icon} />
        </Animated.View>
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.22,
  shadowRadius: 16,
  elevation: 8,
} as const;

const innerShadow = {
  shadowColor: '#fff',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  themeToggle: {
    position: 'absolute',
    right: 16,
    zIndex: 5,
  },
  group: {
    height: 60,
    borderRadius: 999,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow,
    ...innerShadow,
  },
  buttonActive: {
    transform: [{ translateY: 1 }],
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrowBubble: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
