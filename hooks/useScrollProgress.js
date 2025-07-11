import { useEffect, useRef } from 'react';

export function useScrollProgress() {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const scrollPosition = container.scrollTop;
            const maxScroll = container.scrollHeight - container.clientHeight;

            const scrollProgress = maxScroll > 0 ? Math.min(scrollPosition / maxScroll, 1) : 0;

            const progressEvent = new CustomEvent('scrollProgress', {
                detail: { progress: scrollProgress }
            });
            window.dispatchEvent(progressEvent);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return containerRef;
}