import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

function formatDate(dt) {
    return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dt) {
    return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/contact')
            .then(res => setMessages(res.data))
            .catch(() => setError('Failed to load messages.'))
            .finally(() => setLoading(false));
    }, []);

    const markRead = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.patch(`/api/contact/${id}/read`);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
        } catch {
            toast.error('Failed to mark as read.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    const unread = messages.filter(m => !m.read);
    const read = messages.filter(m => m.read);

    return (
        <div className="appt-page">
            <h2 className="customer-list-title">Messages</h2>
            <div className="w-full md:max-w-[50vw]">

                {/* Unread */}
                {unread.length === 0 && read.length === 0 && (
                    <p style={{ color: '#aaa', marginTop: '2rem' }}>No messages yet.</p>
                )}

                {unread.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                            Unread · {unread.length}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {unread.map(msg => (
                                <div
                                    key={msg.id}
                                    className="appt-card"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/dashboard/messages/${msg.id}`)}
                                >
                                    <div className="appt-card-header">
                                        <span className="appt-customer-name" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.name}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            {formatDate(msg.created_at)} · {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {msg.email}
                                    </div>
                                    <p style={{
                                        margin: '0.5rem 0 0.75rem',
                                        fontSize: '0.9rem',
                                        color: '#4b5563',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {msg.message}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            className="appt-detail-back-btn"
                                            style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
                                            onClick={(e) => markRead(e, msg.id)}
                                        >
                                            Mark as Read
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Read */}
                {read.length > 0 && (
                    <div>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                            Read · {read.length}
                        </h3>
                        <div className="customer-list-rows">
                            {read.map(msg => (
                                <div
                                    key={msg.id}
                                    className="customer-list-row"
                                    style={{ gridTemplateColumns: '1fr auto', gap: '1rem' }}
                                    onClick={() => navigate(`/dashboard/messages/${msg.id}`)}
                                >
                                    <span className="customer-list-name" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {msg.name}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                        {formatDate(msg.created_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
