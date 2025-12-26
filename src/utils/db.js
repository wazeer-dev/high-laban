import { db as firestore, COLLECTIONS, isConfigured as isCloudConfigured } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

// --- LocalStorage Helpers (Fallback) ---
const LOCAL_KEYS = {
    PRODUCTS: 'highlaban_products',
    ORDERS: 'highlaban_orders',
    CUSTOMERS: 'highlaban_customers'
};

const getLocal = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const generateId = () => Math.random().toString(36).substr(2, 9);

// Check configuration once
const useCloud = isCloudConfigured();
if (!useCloud) {
    console.warn("⚠️ Firebase keys missing. Running in OFFLINE MODE (LocalStorage). Data will not sync across devices.");
}

const db = {
    // --- Products ---
    getProducts: async () => {
        if (useCloud) {
            try {
                const querySnapshot = await getDocs(collection(firestore, COLLECTIONS.PRODUCTS));
                const products = [];
                querySnapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));
                return products;
            } catch (error) {
                console.error("Cloud Error:", error);
                return getLocal(LOCAL_KEYS.PRODUCTS);
            }
        }
        return getLocal(LOCAL_KEYS.PRODUCTS);
    },

    addProduct: async (product) => {
        if (useCloud) {
            try {
                const docRef = await addDoc(collection(firestore, COLLECTIONS.PRODUCTS), product);
                return { id: docRef.id, ...product };
            } catch (error) {
                console.error("Cloud Error:", error);
            }
        }
        // Fallback
        const products = getLocal(LOCAL_KEYS.PRODUCTS);
        const newProduct = { id: generateId(), ...product };
        products.push(newProduct);
        setLocal(LOCAL_KEYS.PRODUCTS, products);
        return newProduct;
    },

    updateProduct: async (id, updatedProduct) => {
        if (useCloud) {
            try {
                const productRef = doc(firestore, COLLECTIONS.PRODUCTS, id);
                await updateDoc(productRef, updatedProduct);
                return { id, ...updatedProduct };
            } catch (error) { console.error(error); }
        }
        // Fallback
        const products = getLocal(LOCAL_KEYS.PRODUCTS);
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            setLocal(LOCAL_KEYS.PRODUCTS, products);
        }
        return { id, ...updatedProduct };
    },

    deleteProduct: async (id) => {
        if (useCloud) {
            try {
                await deleteDoc(doc(firestore, COLLECTIONS.PRODUCTS, id));
                return id;
            } catch (error) { console.error(error); }
        }
        // Fallback
        const products = getLocal(LOCAL_KEYS.PRODUCTS);
        const newProducts = products.filter(p => p.id !== id);
        setLocal(LOCAL_KEYS.PRODUCTS, newProducts);
        return id;
    },

    // --- Orders ---
    getOrders: async () => {
        if (useCloud) {
            try {
                const q = query(collection(firestore, COLLECTIONS.ORDERS), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const orders = [];
                querySnapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
                return orders;
            } catch (error) { }
        }
        return getLocal(LOCAL_KEYS.ORDERS);
    },

    createOrder: async (orderData) => {
        const finalOrder = {
            ...orderData,
            date: new Date().toISOString(),
            status: orderData.status || 'completed'
        };

        if (useCloud) {
            try {
                const docRef = await addDoc(collection(firestore, COLLECTIONS.ORDERS), finalOrder);
                return { id: docRef.id, ...finalOrder };
            } catch (error) { }
        }
        // Fallback
        const orders = getLocal(LOCAL_KEYS.ORDERS);
        const newOrder = { id: generateId(), ...finalOrder };
        orders.unshift(newOrder); // Add to top
        setLocal(LOCAL_KEYS.ORDERS, orders);
        return newOrder;
    },

    resetOrders: async () => {
        if (useCloud) {
            alert("Reset All is disabled for Cloud Database safety.");
            return;
        }
        setLocal(LOCAL_KEYS.ORDERS, []);
    },

    // --- Customers ---
    getCustomers: async () => {
        if (useCloud) {
            try {
                const querySnapshot = await getDocs(collection(firestore, COLLECTIONS.CUSTOMERS));
                const customers = [];
                querySnapshot.forEach((doc) => customers.push({ id: doc.id, ...doc.data() }));
                return customers;
            } catch (error) { }
        }
        return getLocal(LOCAL_KEYS.CUSTOMERS);
    },

    saveCustomer: async (customer) => {
        if (useCloud) {
            // Find logic skipped for brevity, implementing simple add
            await addDoc(collection(firestore, COLLECTIONS.CUSTOMERS), customer);
            return;
        }
        // Fallback
        const customers = getLocal(LOCAL_KEYS.CUSTOMERS);
        const existingIndex = customers.findIndex(c => c.phone === customer.phone);
        if (existingIndex >= 0) {
            customers[existingIndex] = { ...customers[existingIndex], ...customer };
        } else {
            customers.push({ id: 'CUST-' + generateId(), ...customer });
        }
        setLocal(LOCAL_KEYS.CUSTOMERS, customers);
    },

    // --- Stats ---
    getStats: async () => {
        const orders = await db.getOrders();
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.status === 'completed')
            .reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0);
        const activeUsers = new Set(orders.map(o => o.customerPhone || o.customer)).size;

        return {
            totalOrders: { value: totalOrders.toLocaleString(), change: '+0%' },
            totalRevenue: { value: '₹' + totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 }), change: '+0%' },
            activeUsers: { value: activeUsers.toLocaleString(), change: '+0%' },
            pendingReview: { value: '0', change: '0%' }
        };
    },

    // --- Auth ---
    login: async (email, password) => {
        if (email === 'wazeert13@gmail.com' && password === '1234566') {
            const user = { email, name: 'Admin', role: 'admin' };
            localStorage.setItem('highlaban_user', JSON.stringify(user));
            return user;
        } else {
            throw new Error('Invalid email or password');
        }
    },
    logout: () => localStorage.removeItem('highlaban_user'),
    getUser: () => {
        try { return JSON.parse(localStorage.getItem('highlaban_user')); } catch (e) { return null; }
    }
};

export default db;
