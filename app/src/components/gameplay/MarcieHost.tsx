
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

const animations = {
  idle: require('../../../assets/lottie/marcie_idle.json'),
  talking: require('../../../assets/lottie/marcie_talking.json'),
  judging: require('../../../assets/lottie/marcie_judging.json'),
};

type MarcieHostState = keyof typeof animations;

const MarcieHost = ({ state = 'idle' }: { state?: MarcieHostState }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, [state]);

  return (
    <LottieView
      ref={animationRef}
      source={animations[state]}
      loop={state === 'idle'} // Loop only when idle
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MarcieHost;
