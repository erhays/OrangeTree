import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const SERVICE_TYPES = ['Full', 'Quick', 'Premium'];
const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

function toDateTimeLocal(isoString) {
    const dt = new Date(isoString);
    const pad = n => String(n).padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export default function EditAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/appointments/${id}`),
            axios.get('/api/customers')
        ]).then(([apptRes, custRes]) => {
            const a = apptRes.data;
            setForm({
                customerId: String(a.customer_id),
                dateTime: toDateTimeLocal(a.date_time),
                serviceType: a.service_type,
                status: a.status,
                notes: a.notes || ''
            });
            setCustomers(custRes.data);
        }).catch(() => toast.error('Failed to load appointment.'))
          .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/appointments/${id}`, form);
            toast.success('Appointment updated.');
            navigate(`/dashboard/appointments/${id}`);
        } catch {
            toast.error('Failed to update appointment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading…</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#111' }}>Edit Appointment</h2>

            <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleSubmit}>
                <div className="home-contact-field">
                    <label className="home-contact-label">Customer</label>
                    <select className="home-contact-input" name="customerId" value={form.customerId} onChange={handleChange} required>
                        <option value="">Select a customer…</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                        ))}
                    </select>
                </div>

                <div className="home-contact-row">
                    <div className="home-contact-field">
                        <label className="home-contact-label">Date & Time</label>
                        <input
                            className="home-contact-input"
                            type="datetime-local"
                            name="dateTime"
                            value={form.dateTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Service Type</label>
                        <select className="home-contact-input" name="serviceType" value={form.serviceType} onChange={handleChange} required>
                            <option value="">Select…</option>
                            {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="home-contact-field">
                    <label className="home-contact-label">Status</label>
                    <select className="home-contact-input" name="status" value={form.status} onChange={handleChange}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>

                <div className="home-contact-field">
                    <label className="home-contact-label">Notes</label>
                    <textarea
                        className="home-contact-input home-contact-textarea"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any notes about the appointment…"
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/dashboard/appointments/${id}`)}
                        style={{
                            padding: '0.7rem 1.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '7px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#555',
                            background: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="home-contact-btn"
                        style={{ alignSelf: 'auto' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
