import React, { useState } from 'react';
import Container from '../UI/Container';
import styles from './Sections.module.css';

const faqs = [
    { q: "01 Authentic Egyptian Recipes", a: "We use traditional methods to ensure a genuinely authentic taste." },
    { q: "02 Premium Ingredients", a: "We use only the finest ingredients to create our desserts." },
    { q: "04 Elegant Presentation", a: "Visually stunning desserts crafted to look as good as they taste." },
    { q: "05 Cultural Fusion", a: "A perfect blend of Egyptian tradition and Kerala’s love for sweets." },
    { q: "06 Crafted by Experts", a: "Skillfully prepared by trained staff to ensure perfection in every detail." },
    { q: "07 A Taste & Experience", a: "More than just a dessert; a rare experience that delights the senses." },
];

function AccordionItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.accordionItem}>
            <button className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span>{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && <div className={styles.accordionBody}>{answer}</div>}
        </div>
    );
}

export default function FAQ() {
    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.sectionTitle}>Our <span className={styles.highlight}>Highlights</span></h2>
                <div className={styles.accordionWrapper}>
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
