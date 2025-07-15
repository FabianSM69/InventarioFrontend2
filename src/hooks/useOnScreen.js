// src/hooks/useOnScreen.js
import { useState, useEffect, useRef } from 'react';

export default function useOnScreen(rootMargin = '0px') {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);

  return [ref, isVisible];
}
