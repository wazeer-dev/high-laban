import React from 'react';
import styles from './Highlights.module.css';
import { FaCheckCircle } from 'react-icons/fa';

export default function FAQ() {
    const features = [
        "Authentic Recipes",
        "Premium Ingredients",
        "Freshly Made Daily",
        "Zero Preservatives",
        "Innovative Fusions",
        "Pure Passion"
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.splitLayout}>
                    {/* Left Side - Our Story Card */}
                    <div className={styles.storyCard}>
                        <div className={styles.storyCardTitle}>
                            Our Story
                            <div className={styles.hlLogo}>HL</div>
                        </div>
                        <p className={styles.storyCardText}>
                            Rooted in time-honored Egyptian recipes and crafted with only the finest ingredients, our
                            signature desserts are rich, creamy and irresistibly delicious. HIGHLABAN brings you
                            authentic Egyptian desserts that celebrate tradition while creating unforgettable flavor
                            experiences.
                        </p>
                        <p className={styles.storyCardText} style={{ marginBottom: 0 }}>
                            Every bite is a journey through tradition and indulgence, made with love by our passionate,
                            expertly trained team.
                        </p>
                    </div>

                    {/* Right Side - Feature Grid */}
                    <div className={styles.storyRight}>
                        <span className={styles.labelSmall}>ABOUT US</span>
                        <h2 className={styles.storyHeadline}>Where Tradition Meets <br /> Innovation</h2>
                        <p className={styles.storyDescription}>
                            We are proud to be India's first dedicated Egyptian dessert brand. From
                            our signature Lou'a to the viral Pistachio Kunafa Bomb, we craft happiness
                            in every droplet.
                        </p>

                        <div className={styles.storyGrid}>
                            {features.map((item, index) => (
                                <div key={index} className={styles.featureItem}>
                                    <span className={styles.featureIcon}><FaCheckCircle /></span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
