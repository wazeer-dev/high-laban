import { useEffect } from 'react';

const useScrollReveal = (dependencies = []) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        // Small delay to ensure DOM is updated
        setTimeout(() => {
            const hiddenElements = document.querySelectorAll('.reveal');
            hiddenElements.forEach((el) => observer.observe(el));
        }, 100);

        return () => {
            observer.disconnect(); // Disconnect all
        };
    }, dependencies);
};

export default useScrollReveal;
