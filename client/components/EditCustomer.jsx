import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function EditCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`/api/customers/${id}`)
            .then(res => {
                const c = res.data;
                const digits = (c.phone || '').replace(/\D/g, '').slice(0, 10);
                const phone = digits.length < 4 ? digits : digits.length < 7 ? `(${digits.slice(0, 3)}) ${digits.slice(3)}` : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                setCustomer({ firstName: c.first_name, lastName: c.last_name, email: c.email, phone, address: c.address || '', city: c.city || '', state: c.state || '', zip: c.zip || '' });
            })
            .catch(() => toast.error('Failed to load customer.'))
            .finally(() => setLoading(false));
    }, [id]);

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length < 4) return digits;
        if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: name === 'phone' ? formatPhone(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/customers/${id}`, customer);
            toast.success('Customer updated.');
            navigate(`/dashboard/customers/${id}`);
        } catch {
            toast.error('Failed to update customer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading…</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#111' }}>Edit Customer</h2>

            <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleSubmit}>
                <div className="home-contact-row">
                    <div className="home-contact-field">
                        <label className="home-contact-label">First Name</label>
                        <input
                            className="home-contact-input"
                            type="text"
                            name="firstName"
                            value={customer.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Last Name</label>
                        <input
                            className="home-contact-input"
                            type="text"
                            name="lastName"
                            value={customer.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="home-contact-row">
                    <div className="home-contact-field">
                        <label className="home-contact-label">Email</label>
                        <input
                            className="home-contact-input"
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Phone</label>
                        <input
                            className="home-contact-input"
                            type="tel"
                            name="phone"
                            value={customer.phone}
                            onChange={handleChange}
                            placeholder="(555) 555-5555"
                        />
                    </div>
                </div>

                <div className="home-contact-field">
                    <label className="home-contact-label">Street Address</label>
                    <input className="home-contact-input" type="text" name="address" value={customer.address} onChange={handleChange} placeholder="123 Main St" />
                </div>

                <div className="home-contact-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                    <div className="home-contact-field">
                        <label className="home-contact-label">City</label>
                        <input className="home-contact-input" type="text" name="city" value={customer.city} onChange={handleChange} placeholder="Springfield" />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">State</label>
                        <input className="home-contact-input" type="text" name="state" value={customer.state} onChange={handleChange} placeholder="IL" />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Zip</label>
                        <input className="home-contact-input" type="text" name="zip" value={customer.zip} onChange={handleChange} placeholder="62701" />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/dashboard/customers/${id}`)}
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
