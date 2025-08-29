
import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = <T extends string>(
  ids: T[],
  options: IntersectionObserverInit = { rootMargin: '-50% 0px -50% 0px' }
): T | null => {
  const [activeId, setActiveId] = useState<T | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id as T);
        }
      });
    }, options);

    elements.forEach((el) => {
      if(el) observer.current?.observe(el)
    });

    return () => observer.current?.disconnect();
  }, [ids, options]);

  return activeId;
};
