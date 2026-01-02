import React, { useRef, useState, useEffect } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'zoom';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  variant = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate only once
        }
      },
      {
        threshold: 0.15, // Trigger slightly later for drama
        rootMargin: '0px 0px -80px 0px' // Wait until element is well into view
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Define base transition physics (Power Ease)
  const baseTransition = `transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]`;

  // Define transform states based on variant
  const getHiddenState = () => {
    switch (variant) {
      case 'zoom':
        return 'opacity-0 scale-50 blur-sm translate-y-12';
      case 'left':
        return 'opacity-0 -translate-x-24 blur-sm';
      case 'right':
        return 'opacity-0 translate-x-24 blur-sm';
      case 'up':
      default:
        // Strong Up: Big translation + slight scale down + blur
        return 'opacity-0 translate-y-32 scale-90 blur-[2px]';
    }
  };

  const getVisibleState = () => {
    return 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0';
  };

  return (
    <div
      ref={ref}
      className={`transform will-change-transform ${baseTransition} ${
        isVisible ? getVisibleState() : getHiddenState()
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;