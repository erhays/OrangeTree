import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function Settings() {
    const [form, setForm] = useState({ email: '', password: '', confirm: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            toast.error('Passwords do not match.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post('/api/users', { email: form.email, password: form.password });
            toast.success(`User ${form.email} created.`);
            setForm({ email: '', password: '', confirm: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create user.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1.75rem' }}>Settings</h2>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem' }}>Add User</h3>
                <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleSubmit}>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Email</label>
                        <input
                            className="home-contact-input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Password</label>
                        <input
                            className="home-contact-input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Min. 8 characters"
                            minLength={8}
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Confirm Password</label>
                        <input
                            className="home-contact-input"
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            required
                            placeholder="Repeat password"
                        />
                    </div>
                    <button type="submit" className="home-contact-btn" style={{ alignSelf: 'auto' }} disabled={submitting}>
                        {submitting ? 'Creating…' : 'Create User'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
