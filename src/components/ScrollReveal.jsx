import React, { useRef, useEffect, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  className = '', 
  style = {}, 
  direction = 'up' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all duration-1000 ease-out`}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;