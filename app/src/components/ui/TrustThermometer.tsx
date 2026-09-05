import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, ClipPath, Path, Rect, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  withRepeat,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS, GRADIENTS, TYPOGRAPHY, ANIMATIONS } from '../../theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type TrustThermometerProps = {
  width?: number;
  height?: number;
  level?: number;
  showPercentage?: boolean;
  weeklyChange?: number;
  style?: ViewStyle;
};

export default function TrustThermometer({
  width = 60,
  height = 200,
  level = 0.5,
  showPercentage = true,
  weeklyChange,
  style,
}: TrustThermometerProps) {
  const clampedLevel = Math.max(0, Math.min(1, level));
  
  const fillLevel = useSharedValue(0);
  const wavePhase = useSharedValue(0);

  useEffect(() => {
    fillLevel.value = withSpring(clampedLevel, {
      damping: 15,
      stiffness: 100,
    });
  }, [clampedLevel]);

  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedWaveProps = useAnimatedProps(() => {
    const waveHeight = 6;
    const baseY = height * (1 - fillLevel.value);
    const phase = wavePhase.value;
    
    const points: string[] = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const x = (width * i) / segments;
      const waveOffset = Math.sin((i / segments) * 3 * Math.PI + phase) * waveHeight;
      const y = baseY + waveOffset;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    points.push(`L ${width} ${height}`);
    points.push(`L 0 ${height}`);
    points.push('Z');
    
    return {
      d: points.join(' '),
    };
  });

  const bulbRadius = width / 2;
  const stemHeight = height - bulbRadius * 2;
  const stemY = bulbRadius;

  const percentage = Math.round(clampedLevel * 100);
  
  const changeText = weeklyChange !== undefined 
    ? `${weeklyChange >= 0 ? '+' : ''}${weeklyChange}%`
    : null;
  const changeColor = weeklyChange !== undefined 
    ? (weeklyChange >= 0 ? COLORS.mintGreen : COLORS.vibrantPink)
    : null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.thermometerContainer}>
        <Svg width={width} height={height}>
          <Defs>
            <ClipPath id="thermometerClip">
              <Rect
                x={width * 0.25}
                y={stemY}
                width={width * 0.5}
                height={stemHeight}
                rx={width * 0.25}
              />
              <Path
                d={`M ${width / 2} ${height} 
                    m -${bulbRadius}, 0 
                    a ${bulbRadius},${bulbRadius} 0 1,1 ${bulbRadius * 2},0 
                    a ${bulbRadius},${bulbRadius} 0 1,1 -${bulbRadius * 2},0`}
              />
            </ClipPath>
            
            <LinearGradient id="progressGradient" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={GRADIENTS.progress.colors[0]} />
              <Stop offset="0.33" stopColor={GRADIENTS.progress.colors[1]} />
              <Stop offset="0.66" stopColor={GRADIENTS.progress.colors[2]} />
              <Stop offset="1" stopColor={GRADIENTS.progress.colors[3]} />
            </LinearGradient>
          </Defs>
          
          <Rect
            x={width * 0.25}
            y={stemY}
            width={width * 0.5}
            height={stemHeight}
            rx={width * 0.25}
            fill={COLORS.backgroundSecondary}
          />
          <Path
            d={`M ${width / 2} ${height} 
                m -${bulbRadius}, 0 
                a ${bulbRadius},${bulbRadius} 0 1,1 ${bulbRadius * 2},0 
                a ${bulbRadius},${bulbRadius} 0 1,1 -${bulbRadius * 2},0`}
            fill={COLORS.backgroundSecondary}
          />
          
          <AnimatedPath
            clipPath="url(#thermometerClip)"
            animatedProps={animatedWaveProps}
            fill="url(#progressGradient)"
          />
          
          <Path
            d={`M ${width / 2} ${height} 
                m -${bulbRadius}, 0 
                a ${bulbRadius},${bulbRadius} 0 1,1 ${bulbRadius * 2},0 
                a ${bulbRadius},${bulbRadius} 0 1,1 -${bulbRadius * 2},0`}
            fill="url(#progressGradient)"
            opacity={clampedLevel}
            clipPath="url(#thermometerClip)"
          />
          
          {[0.25, 0.5, 0.75].map((tick) => (
            <Rect
              key={tick}
              x={width * 0.1}
              y={bulbRadius + stemHeight * (1 - tick)}
              width={width * 0.15}
              height={2}
              fill={COLORS.textSecondary}
              opacity={0.5}
            />
          ))}
        </Svg>
      </View>

      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          {changeText && (
            <Text style={[styles.changeText, { color: changeColor || COLORS.textSecondary }]}>
              {changeText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thermometerContainer: {
    shadowColor: COLORS.vibrantPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  percentageContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  changeText: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
