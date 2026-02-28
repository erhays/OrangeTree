import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const statCardStyle = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
};

const cardStyle = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
};

function StatCard({ label, value }) {
    return (
        <div style={statCardStyle}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                {value ?? '—'}
            </p>
        </div>
    );
}

export default function Insights() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('/api/insights')
            .then(res => setData(res.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const s = data?.summary;
    const byMonth = data?.byMonth ?? [];

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Insights</h2>

            {error && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>Failed to load insights data.</p>
            )}

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <StatCard label="Total Customers" value={loading ? '…' : s?.total_customers} />
                <StatCard label="Total Appointments" value={loading ? '…' : s?.total_appointments} />
                <StatCard label="Upcoming" value={loading ? '…' : s?.upcoming} />
                <StatCard label="Completion Rate" value={loading ? '…' : s?.completion_rate != null ? `${s.completion_rate}%` : '—'} />
            </div>

            {/* Appointments by Month */}
            <div style={cardStyle}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1.25rem' }}>
                    Appointments by Month
                </p>
                {loading ? (
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading…</p>
                ) : byMonth.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No appointment data yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={byMonth} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.8rem' }}
                                cursor={{ fill: '#f9fafb' }}
                            />
                            <Bar dataKey="count" name="Appointments" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Revenue placeholder */}
            <div style={{ ...cardStyle, background: '#f9fafb' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                    Revenue
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Coming soon — will connect to Stripe or manual receipt data.</p>
            </div>
        </div>
    );
}
