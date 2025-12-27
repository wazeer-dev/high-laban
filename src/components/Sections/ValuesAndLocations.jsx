import React, { useEffect, useState } from 'react';
import styles from './ValuesAndLocations.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import db from '../../utils/db';

export default function ValuesAndLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const values = [
        { title: "100% Authentic", text: "Traditional Egyptian recipes passed down through generations." },
        { title: "Fresh Ingredients", text: "We use only the finest, freshest ingredients daily." },
        { title: "Made with Love", text: "Every dessert is crafted with passion and care." },
        { title: "Sweet Joy", text: "Guaranteed to bring a smile to your face." }
    ];

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locs = await db.getLocations();
                setLocations(locs);
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Top Section - Values */}
                <div className={styles.valuesGrid}>
                    {values.map((val, index) => (
                        <div key={index} className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>{val.title}</h3>
                            <p className={styles.valueText}>{val.text}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom Section - Locations */}
                <div className={styles.locationsWrapper}>
                    <span className={styles.smallLabel}>FIND US</span>
                    <h2 className={styles.sectionTitle}>Our Locations</h2>
                    <p className={styles.sectionSubtitle}>Find your nearest HighLaban and experience the taste of Egypt.</p>

                    <div className={styles.locationsGrid}>
                        {loading ? (
                            <p style={{ color: '#94a3b8' }}>Loading locations...</p>
                        ) : locations.length > 0 ? (
                            locations.map((loc) => (
                                <div key={loc.id} className={styles.locationCard}>
                                    <div className={styles.locationIconWrapper}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <h3 className={styles.locationName}>{loc.name}</h3>
                                    <p className={styles.locationAddress}>{loc.address}</p>

                                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '1rem 0' }}></div>

                                    <span style={{
                                        display: 'inline-block',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: loc.status === 'Open' ? '#166534' : '#f97316'
                                    }}>
                                        {loc.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            // Fallback if no locations added yet
                            <div className={styles.locationCard}>
                                <div className={styles.locationIconWrapper}>
                                    <FaMapMarkerAlt />
                                </div>
                                <h3 className={styles.locationName}>New Locations</h3>
                                <p className={styles.locationAddress}>Coming to your city soon!</p>
                                <div style={{ borderTop: '1px solid #f1f5f9', margin: '1rem 0' }}></div>
                                <span className={styles.locationStatus}>Stay Tuned</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
