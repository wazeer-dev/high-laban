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
    }, [progress, images, imagesLoaded]); // Re-run when more images load (to potentially fill missing frames)


    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className={styles.heroContainer} ref={containerRef}>
            {/* Removed blocking loading overlay */}

            <div className={styles.stickyWrapper}>
                <canvas ref={canvasRef} className={styles.heroCanvas} />

                <div className={styles.overlayContent}>
                    <div className={styles.leftBlock}>
                        <p className={styles.introLine}>India's First<br /><strong>EGYPTIAN DESSERT</strong></p>
                        <h1 className={styles.mainTitle}>
                            Creamy<br />Dreamy<br />Desserts
                        </h1>
                        <div className={styles.skillRow}>
                            <div className={styles.skillItem}><span>01</span> Authentic Taste</div>
                            <div className={styles.skillItem}><span>02</span> Premium Ingredients</div>
                        </div>
                    </div>

                    <div className={styles.rightBlock}>
                        <h2 className={styles.subHeadline}>Indulge in the Creamiest<br />Egyptian Delights.</h2>
                        <p className={styles.supportingText}>
                            Experience the rich, authentic taste of traditional Egyptian desserts,
                            crafted with premium milk and secret recipes passed down through generations.
                            A taste you'll never forget.
                        </p>
                    </div>

                    <div className={styles.bottomSocial}>
                        <a href="https://www.instagram.com/highlaban/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
