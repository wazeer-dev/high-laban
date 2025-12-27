import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './Hero.module.css';

const TOTAL_FRAMES = 264;
const FRAME_PATH = '/webp-sequence/frame_'; // e.g., frame_000_delay... or frame_000.webp depending on download
// Ideally I should rename them to frame_000.webp in the download script for sanity.
// I will check the download script output later, but assume standard index.

export default function Hero() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // const [isLoading, setIsLoading] = useState(true); // No longer blocking

    // Progress determines the frame
    const progress = useScrollProgress(containerRef);

    // Preload Images
    const images = useMemo(() => {
        const imgs = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.webp`;
            // We'll track loading separately to avoid re-renders during loop
            img.onload = () => setImagesLoaded(prev => prev + 1);
            imgs.push(img);
        }
        return imgs;
    }, []);

    // Effect to handle initial load (optional, if we want to wait for just frame 0)
    // But immediate render is better.

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                setDimensions({ width: window.innerWidth, height: window.innerHeight });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Render Frame to Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
        const currentImage = images[frameIndex];

        // Progressive Fallback:
        // If current frame isn't loaded, try to find the nearest loaded frame?
        // Or just don't draw anything (transparent) which might flicker.
        // Better: Draw the nearest loaded frame.
        // For simplicity: If currentImage.complete is true, draw it.
        // If not, maybe we keep the previous drawing (which is handled by not clearing if we don't draw).
        // But scroll might have jumped.

        // Simple progressive:
        if (currentImage && currentImage.complete) {
            // Draw Image Cover Mode
            const { width, height } = canvas;
            const imgRatio = currentImage.width / currentImage.height;
            const canvasRatio = width / height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = height;
                drawWidth = height * imgRatio;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(currentImage, offsetX, offsetY, drawWidth, drawHeight);
        }
    }, [progress, images, imagesLoaded, dimensions]); // Re-run when size changes


    return (
        <div className={styles.heroContainer} ref={containerRef}>
            <div className={styles.stickyWrapper}>
                <canvas ref={canvasRef} className={styles.heroCanvas} />

                <div className={styles.overlayContent}>
                    <div className={styles.topBadge}>
                        Premium Egyptian Desserts in India
                    </div>

                    <h1 className={styles.mainTitle}>
                        GET HIGH <span className={styles.highlight}>ON BITE</span>
                    </h1>

                    <p className={styles.subHeadline}>
                        Experience Egypt's Finest Creamy Desserts
                    </p>

                    <div className={styles.buttonGroup}>
                        <button className={styles.btnPrimary}>Our Flavors</button>
                        <button className={styles.btnSecondary}>Our Story</button>
                        <div className={styles.playWrapper} onClick={() => document.getElementById('nature')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                            <div className={styles.rotatingText}>
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                    </defs>
                                    <text>
                                        <textPath xlinkHref="#circle">
                                            PLAY VIDEO • PLAY VIDEO •
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                            <div className={styles.playCenter}>
                                <span className={styles.playIcon}>▶</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
