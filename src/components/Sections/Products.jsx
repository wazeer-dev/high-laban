import React, { useState, useEffect } from 'react';
import Container from '../UI/Container';
import styles from './Products.module.css';
import db from '../../utils/db'; // Import DB

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await db.getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <section id="products" className={styles.section}>
            <Container>
                <div className={styles.header}>
                    <div className={styles.menuButton}>Our Menu</div>
                    <h2 className={styles.title}>Crush the craving.</h2>
                    <p className={styles.description}>
                        17 drops of heaven. Authentic egyptian recipes with a modern twist.
                    </p>
                </div>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.card}>
                            {product.badge && (
                                <span className={`${styles.badge} ${product.badge === 'NEW ARRIVAL' ? styles.badgeNewArrival : ''}`}>
                                    {product.badge}
                                </span>
                            )}

                            <div className={styles.imageContainer}>
                                <img src={product.img || product.image} alt={product.name} className={styles.productImage} />
                            </div>

                            <span className={styles.tag}>{product.tag}</span>

                            <h3 className={styles.productName}>{product.name}</h3>
                            <span className={styles.productTagLine}>{product.tag}</span>
                            <p className={styles.productDescription}>{product.description}</p>

                            <div className={styles.cardFooter}>
                                <div className={styles.priceContainer}>
                                    {product.originalPrice && (
                                        <span className={styles.originalPrice}>
                                            <span style={{ fontSize: '0.8em' }}>₹</span>{product.originalPrice}
                                        </span>
                                    )}
                                    <div className={styles.price}>
                                        <span className={styles.priceCurrency}>₹</span>{product.price}
                                    </div>
                                </div>
                                <button className={styles.orderButton}>Order</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.viewMoreContainer}>
                    <button className={styles.viewMoreButton}>View More</button>
                </div>
            </Container>
        </section>
    );
}
