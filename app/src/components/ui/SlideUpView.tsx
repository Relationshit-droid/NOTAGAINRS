import { ReactNode } from 'react';
import Animated, { 
  SlideInUp, 
  SlideOutDown,
  FadeIn,
  FadeOut,
  Layout
} from 'react-native-reanimated';
import { ANIMATIONS } from '../../theme';

type SlideUpViewProps = {
  children: ReactNode;
  duration?: number;
  exitDuration?: number;
  animation?: 'slide' | 'fade' | 'both';
};

export default function SlideUpView({ 
  children, 
  duration = ANIMATIONS.duration.normal,
  exitDuration = ANIMATIONS.duration.fast,
  animation = 'slide'
}: SlideUpViewProps) {
  const getEntering = () => {
    switch (animation) {
      case 'fade':
        return FadeIn.duration(duration);
      case 'both':
        return SlideInUp.duration(duration).combine(FadeIn.duration(duration));
      case 'slide':
      default:
        return SlideInUp.duration(duration);
    }
  };

  const getExiting = () => {
    switch (animation) {
      case 'fade':
        return FadeOut.duration(exitDuration);
      case 'both':
        return SlideOutDown.duration(exitDuration).combine(FadeOut.duration(exitDuration));
      case 'slide':
      default:
        return SlideOutDown.duration(exitDuration);
    }
  };

  return (
    <Animated.View 
      entering={getEntering()} 
      exiting={getExiting()}
      layout={Layout.springify()}
    >
      {children}
    </Animated.View>
  );
}
