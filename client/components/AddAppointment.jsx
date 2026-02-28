import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const SERVICE_TYPES = ['Full', 'Quick', 'Premium'];
const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

export default function AddAppointment() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        customerId: '',
        dateTime: '',
        serviceType: '',
        status: 'Scheduled',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/customers').then(res => setCustomers(res.data)).catch(() => toast.error('Failed to load customers.'));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/appointments', form);
            toast.success('Appointment booked.');
            navigate('/dashboard/appointments');
        } catch {
            toast.error('Failed to book appointment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#111' }}>Book Appointment</h2>

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
                        onClick={() => navigate('/dashboard/appointments')}
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
                        {isSubmitting ? 'Booking…' : 'Book Appointment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
