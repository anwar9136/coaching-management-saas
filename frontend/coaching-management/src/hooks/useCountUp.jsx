import { useEffect, useState, useRef } from 'react';

export const useCountUp = (target, duration = 1500, start = 0) => {
  const [count, setCount] = useState(start);
  const ref = useRef(null);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (target - start) + start));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration, start]);

  return count;
};
