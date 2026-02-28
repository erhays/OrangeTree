import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddCustomer() {
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
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
                            placeholder="(555) 000-0000"
                        />
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
