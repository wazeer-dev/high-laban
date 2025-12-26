import React, { useState, useEffect } from 'react';
import Container from '../UI/Container';
import styles from './Products.module.css';
import db from '../../utils/db'; // Import db

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await db.getProducts();
            setProducts(data);
        };

        // Initial fetch
        fetchProducts();

        // Polling
        const interval = setInterval(() => {
            fetchProducts();
        }, 3000); // Slightly longer interval for cloud

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="products" className={styles.section}>
            <Container>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Products</h2>
                    <p className={styles.subtitle}>You are going to like our desserts for sure.</p>
                    <p className={styles.description}>
                        Perfect for sharing or savoring solo, it's the ultimate treat to satisfy your sweet cravings.
                        One taste and you will never forget its rich & unforgettable flavour.
                    </p>
                </div>

                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardHeader}>
                                {product.name}
                            </div>
                            <div className={styles.cardBody}>
                                {product.img && (product.img.includes('video') || product.img.match(/\.(mp4|webm|ogg|mov)$/i)) ? (
                                    <video
                                        src={product.img}
                                        className={styles.productImage}
                                        controls
                                        muted
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img src={product.img} alt={product.name} className={styles.productImage} />
                                )}
                                <span className={styles.productFlavor}>{product.flavor}</span>
                                <div className={styles.arrows}>
                                    <span>←</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
