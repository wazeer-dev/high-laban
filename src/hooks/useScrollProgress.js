import { useState, useEffect } from 'react';

/**
 * useScrollProgress
 * Returns the scroll progress (0 to 1) of a container.
 * @param {React.RefObject} containerRef - Ref to the container element (should have a height > 100vh)
 * @returns {number} progress - 0 to 1
 */
export function useScrollProgress(containerRef) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the container has been scrolled past
            // Start counting when container top is at 0 (sticky behavior usually implies this)
            // Actually, if it's sticky, the parent is the one scrolling.
            // Let's assume standard "ScrollTrigger" like behavior:
            // The progress is: how far have we scrolled relative to the track height?

            const scrollDist = -top; // Distance from top of viewport
            const totalScrollable = height - windowHeight;

            let p = scrollDist / totalScrollable;
            p = Math.min(1, Math.max(0, p));

            setProgress(p);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init

        return () => window.removeEventListener('scroll', handleScroll);
    }, [containerRef]);

    return progress;
}
