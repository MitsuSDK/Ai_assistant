import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '@/components/theme';

type ThemeToggleProps = {
  style?: StyleProp<ViewStyle>;
};

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { mode, toggleMode } = useAppTheme();
  const anim = useRef(new Animated.Value(mode === 'somber' ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: mode === 'somber' ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [anim, mode]);

  const knobTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const backgroundColor = mode === 'somber' ? '#522ba7' : '#28096b';

  return (
    <Pressable style={[styles.switch, { backgroundColor }, style]} onPress={toggleMode}>
      <Animated.View
        style={[
          styles.knob,
          { backgroundColor, transform: [{ translateX: knobTranslate }] },
        ]}
      >
        <Animated.View style={styles.knobGlow} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#28096b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  knobGlow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff000',
  },
});
