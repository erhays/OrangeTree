import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

function formatDate(dt) {
    return new Date(dt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(dt) {
    return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/contact/${id}`)
            .then(res => setMsg(res.data))
            .catch(() => setError('Message not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    const markRead = async () => {
        try {
            await axios.patch(`/api/contact/${id}/read`);
            setMsg(prev => ({ ...prev, read: true }));
            toast.success('Marked as read.');
        } catch {
            toast.error('Failed to mark as read.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="appt-detail-page">
            <div className="appt-detail-topbar">
                <button className="appt-detail-back-btn" onClick={() => navigate('/dashboard/messages')}>
                    ← Messages
                </button>
                {!msg.read && (
                    <button className="appt-detail-complete-btn" onClick={markRead}>
                        Mark as Read
                    </button>
                )}
            </div>

            <div className="appt-detail-card w-full md:max-w-[50vw]">
                <div className="appt-detail-card-header">
                    <h2 className="appt-detail-title">{msg.name}</h2>
                    {msg.read && (
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Read
                        </span>
                    )}
                </div>

                <div className="appt-detail-fields">
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Email</span>
                        <a href={`mailto:${msg.email}`} className="appt-detail-value" style={{ color: '#00bcd4' }}>
                            {msg.email}
                        </a>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Received</span>
                        <span className="appt-detail-value">{formatDate(msg.created_at)} at {formatTime(msg.created_at)}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Message</span>
                        <p className="appt-detail-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: '0.25rem' }}>
                            {msg.message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
