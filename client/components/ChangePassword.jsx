import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirm) {
            toast.error('New passwords do not match.');
            return;
        }
        setSaving(true);
        try {
            await axios.put('/api/me/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            toast.success('Password updated.');
            navigate('/dashboard/settings');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update password.');
        } finally {
            setSaving(false);
        }
    };

    const cardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' };

    return (
        <div style={{ padding: '2rem', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                    onClick={() => navigate('/dashboard/settings')}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#6b7280', fontSize: '0.875rem' }}
                >
                    ← Settings
                </button>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Change Password</h2>
            <div style={cardStyle}>
                <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleSubmit}>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Current Password</label>
                        <input
                            className="home-contact-input"
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">New Password</label>
                        <input
                            className="home-contact-input"
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            placeholder="Min. 8 characters"
                        />
                    </div>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Confirm New Password</label>
                        <input
                            className="home-contact-input"
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            required
                            placeholder="Repeat new password"
                        />
                    </div>
                    <button type="submit" className="customer-list-add-btn" disabled={saving}>
                        {saving ? 'Saving…' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
