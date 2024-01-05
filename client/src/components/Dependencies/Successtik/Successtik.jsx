import React, { useEffect } from 'react';
import animationData from './Animation.json';
import lottie from 'lottie-web';

const SuccessTick = () => {
  useEffect(() => {
    const container = document.getElementById('lottie-container');

    if (container) {
      const animation = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });

      return () => {
        animation.destroy();
      };
    }
  }, []);

  return <div id="lottie-container" className="w-16 h-16"></div>;
};

export default SuccessTick;
