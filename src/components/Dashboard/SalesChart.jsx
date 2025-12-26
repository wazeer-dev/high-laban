import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ orders }) => {
    // Process orders to get daily revenue
    const data = useMemo(() => {
        const last7Days = new Map();

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            last7Days.set(dateStr, 0);
        }

        // Aggregate order totals
        orders.forEach(order => {
            const orderDate = new Date(order.date);
            // Simple check if order date is valid
            if (!isNaN(orderDate.getTime())) {
                const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (last7Days.has(dateStr)) {
                    last7Days.set(dateStr, last7Days.get(dateStr) + order.total);
                }
            }
        });

        // Convert to array
        return Array.from(last7Days, ([name, revenue]) => ({ name, revenue }));
    }, [orders]);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
