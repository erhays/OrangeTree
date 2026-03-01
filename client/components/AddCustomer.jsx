import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddCustomer() {
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
            await axios.post('/api/customers', customer);
            toast.success('Customer added.');
            navigate('/dashboard/customers');
        } catch {
            toast.error('Failed to add customer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#111' }}>Add Customer</h2>

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
                            placeholder="Jane"
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
                            placeholder="Smith"
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
                            placeholder="jane@example.com"
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
                    <Link
                        to="/dashboard/customers"
                        style={{
                            padding: '0.7rem 1.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '7px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#555',
                            textDecoration: 'none',
                            transition: 'background 0.15s ease',
                        }}
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="home-contact-btn"
                        style={{ alignSelf: 'auto' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding…' : 'Add Customer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
