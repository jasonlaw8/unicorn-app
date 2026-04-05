import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface GlowWrapperProps {
  active: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  color?: string;
}

const GlowWrapper: React.FC<GlowWrapperProps> = ({
  active,
  children,
  style,
  color = '#FFD700',
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(0);
    }
  }, [active, pulseAnim]);

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.9],
  });

  const glowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  if (!active) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: glowScale }],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowOpacity as unknown as number,
          shadowRadius: 15,
          elevation: 10,
        },
        styles.glowBorder,
        { borderColor: color },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glowBorder: {
    borderWidth: 2,
    borderRadius: 12,
  },
});

export default GlowWrapper;
