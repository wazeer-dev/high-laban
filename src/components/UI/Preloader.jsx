import React, { useEffect, useState } from 'react';
import styles from './Preloader.module.css';
import logo from '../../assets/logo.png'; // Adjust path if needed

const Preloader = ({ loading }) => {
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 500); // Wait for transition to finish
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (!shouldRender) return null;

    return (
        <div className={`${styles.preloader} ${!loading ? styles.hidden : ''}`}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="High Laban" className={styles.logo} />
                <div className={styles.spinner}></div>
            </div>
        </div>
    );
};

export default Preloader;
