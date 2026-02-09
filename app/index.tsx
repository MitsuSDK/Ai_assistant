import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
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
    outputRange: ["0deg", "360deg"],
  });

  const arrowRotate = arrowMotion.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const arrowShift = arrowMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonActive,
          ]}
          onHoverIn={() => setIsActive(true)}
          onHoverOut={() => setIsActive(false)}
          onPressIn={() => setIsActive(true)}
          onPressOut={() => setIsActive(false)}
          onPress={() => router.push("/chat")}
        >
          <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
            <Ionicons name="help-circle-outline" size={16} color="#fff" />
          </Animated.View>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Animated.View
          style={[
            styles.arrowBubble,
            {
              transform: [{ translateX: arrowShift }, { rotate: arrowRotate }],
            },
          ]}
        >
          <Ionicons name="arrow-forward" size={14} color="#111827" />
        </Animated.View>
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.22,
  shadowRadius: 16,
  elevation: 8,
} as const;

const innerShadow = {
  shadowColor: "#fff",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f5f7",
  },
  group: {
    height: 60,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#a1a1aa",
    backgroundColor: "#e4e4e7",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: "#6336f7",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadow,
    ...innerShadow,
  },
  buttonActive: {
    transform: [{ translateY: 1 }],
    backgroundColor: "#7348ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  arrowBubble: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#a1a1aa",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f5",
  },
});
