import { useState, useEffect } from 'react';
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
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        axios.get('/api/contact')
            .then(res => setMessages(res.data))
            .catch(() => setError('Failed to load messages.'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/contact/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (expanded === id) setExpanded(null);
            toast.success('Message dismissed.');
        } catch {
            toast.error('Failed to dismiss message.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="appt-page">
            <h2 className="customer-list-title">Messages</h2>
            <div className="customer-list-toolbar">
                <span className="customer-list-count">{messages.length} Message{messages.length !== 1 ? 's' : ''}</span>
            </div>

            {messages.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '2rem' }}>No messages yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} className="appt-card" style={{ cursor: 'default' }}>
                            <div className="appt-card-header">
                                <span className="appt-customer-name">{msg.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                    {formatDate(msg.created_at)} · {formatTime(msg.created_at)}
                                </span>
                            </div>
                            <div className="appt-card-field">
                                <span className="appt-card-label">Email</span>
                                <a href={`mailto:${msg.email}`} className="appt-card-value" style={{ color: '#00bcd4' }}>
                                    {msg.email}
                                </a>
                            </div>
                            <div className="appt-card-field" style={{ alignItems: 'flex-start' }}>
                                <span className="appt-card-label">Message</span>
                                <span
                                    className="appt-card-value"
                                    style={{
                                        whiteSpace: expanded === msg.id ? 'pre-wrap' : 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: expanded === msg.id ? 'unset' : 'ellipsis',
                                        cursor: 'pointer',
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                    onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                                    title={expanded === msg.id ? 'Click to collapse' : 'Click to expand'}
                                >
                                    {msg.message}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                <button
                                    className="appt-detail-back-btn"
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
                                    onClick={() => handleDelete(msg.id)}
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
