import { useEffect, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useAppStore } from '../../state/store';

type ConfettiBurstProps = {
  count?: number;
  colors?: string[];
  duration?: number;
  onEnd?: () => void;
};

type Particle = {
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
};

export default function ConfettiBurst({ count = 60, colors = ['#FA1F63', '#BE1980', '#33DEA5', '#E4E831'], duration = 2000, onEnd }: ConfettiBurstProps) {
  const { width } = Dimensions.get('window');
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  if (reducedMotion) {
    useEffect(() => { const t = setTimeout(() => onEnd && onEnd(), 500); return () => clearTimeout(t); }, [onEnd]);
    return null as any;
  }
  const particles: Particle[] = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        left: Math.random() * width - width / 2,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 300,
        duration: 2000 + Math.random() * 3000,
        rotation: Math.random() * 360,
      })),
    [count, colors, width]
  );

  useEffect(() => {
    const maxDur = Math.max(duration, ...particles.map((p) => p.duration));
    const t = setTimeout(() => onEnd && onEnd(), maxDur + 500);
    return () => clearTimeout(t);
  }, [duration, onEnd, particles]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      {particles.map((p, i) => (
        <ParticleView key={i} particle={p} />
      ))}
    </View>
  );
}

function ParticleView({ particle }: { particle: Particle }) {
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const x = useSharedValue(particle.left);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${r.value}deg` }],
    opacity: 1 - y.value / 500,
  }));

  useEffect(() => {
    setTimeout(() => {
      const easing = Easing.bezier(0.25, 0.46, 0.45, 0.94);
      y.value = withTiming(500, { duration: particle.duration, easing });
      r.value = withTiming(particle.rotation, { duration: particle.duration });
      x.value = withTiming(particle.left + (Math.random() * 160 - 80), { duration: particle.duration, easing });
    }, particle.delay);
  }, []);

  return <Animated.View style={[{ position: 'absolute', top: 0, left: '50%', width: particle.size, height: particle.size, backgroundColor: particle.color }, style]} />;
}
