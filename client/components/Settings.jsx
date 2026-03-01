import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

function Settings() {
    const [me, setMe] = useState(null);
    const [name, setName] = useState('');
    const [savingName, setSavingName] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUserForm, setNewUserForm] = useState({ email: '', password: '', confirm: '' });
    const [submittingUser, setSubmittingUser] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get('/api/me').then(res => {
            setMe(res.data);
            setName(res.data.name || '');
        }).catch(() => {});
        axios.get('/api/users').then(res => setUsers(res.data)).catch(() => {});
    }, []);

    const initials = me
        ? (me.name ? me.name.trim()[0] : me.email[0]).toUpperCase()
        : '?';

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const res = await axios.post('/api/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMe(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
            toast.success('Avatar updated.');
        } catch {
            toast.error('Failed to upload avatar.');
        }
        e.target.value = '';
    };

    const handleSaveName = async (e) => {
        e.preventDefault();
        setSavingName(true);
        try {
            await axios.put('/api/me/profile', { name });
            setMe(prev => ({ ...prev, name }));
            toast.success('Name updated.');
        } catch {
            toast.error('Failed to update name.');
        } finally {
            setSavingName(false);
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserForm(prev => ({ ...prev, [name]: value }));
    };

    const handleNewUserSubmit = async (e) => {
        e.preventDefault();
        if (newUserForm.password !== newUserForm.confirm) {
            toast.error('Passwords do not match.');
            return;
        }
        setSubmittingUser(true);
        try {
            await axios.post('/api/users', { email: newUserForm.email, password: newUserForm.password });
            toast.success(`User ${newUserForm.email} created.`);
            setNewUserForm({ email: '', password: '', confirm: '' });
            setShowAddUser(false);
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create user.');
        } finally {
            setSubmittingUser(false);
        }
    };

    const cardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' };
    const headingStyle = { fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem' };

    return (
        <div style={{ padding: '2rem', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Settings</h2>

            {/* My Account */}
            <div style={cardStyle}>
                <h3 style={headingStyle}>My Account</h3>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        title="Change profile picture"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%', flexShrink: 0 }}
                    >
                        {me?.avatarUrl ? (
                            <img
                                src={me.avatarUrl}
                                alt="Avatar"
                                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
                            />
                        ) : (
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: '#2bc4ad', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 700, border: '2px solid #e5e7eb',
                            }}>
                                {initials}
                            </div>
                        )}
                    </button>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.2rem', fontWeight: 500 }}>
                            {me?.name || me?.email || '—'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                            Click avatar to upload a photo (max 2MB)
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                </div>

                {/* Display Name */}
                <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div className="home-contact-field">
                        <label className="home-contact-label">Display Name</label>
                        <input
                            className="home-contact-input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <button type="submit" className="customer-list-add-btn" disabled={savingName}>
                            {savingName ? 'Saving…' : 'Save Name'}
                        </button>
                    </div>
                </form>

            </div>

            {/* Change Password link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '0.5rem', marginTop: '-0.5rem' }}>
                <Link
                    to="/dashboard/settings/change-password"
                    style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}
                >
                    Change password →
                </Link>
            </div>

            {/* Users */}
            <div style={cardStyle}>
                <h3 style={headingStyle}>Users</h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#6b7280', fontWeight: 500 }}>Email</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#6b7280', fontWeight: 500 }}>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.6rem 0', color: '#111827' }}>{u.email}</td>
                                <td style={{ padding: '0.6rem 0', color: '#374151' }}>{u.name || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Add User link / inline form */}
            {showAddUser ? (
                <div style={{ ...cardStyle, marginTop: '-0.5rem' }}>
                    <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleNewUserSubmit}>
                        <div className="home-contact-field">
                            <label className="home-contact-label">Email</label>
                            <input
                                className="home-contact-input"
                                type="email"
                                name="email"
                                value={newUserForm.email}
                                onChange={handleNewUserChange}
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
                                value={newUserForm.password}
                                onChange={handleNewUserChange}
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
                                value={newUserForm.confirm}
                                onChange={handleNewUserChange}
                                required
                                placeholder="Repeat password"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <button type="submit" className="customer-list-add-btn" disabled={submittingUser}>
                                {submittingUser ? 'Creating…' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowAddUser(false); setNewUserForm({ email: '', password: '', confirm: '' }); }}
                                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
                    <button
                        onClick={() => setShowAddUser(true)}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                        Add User →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Settings;
