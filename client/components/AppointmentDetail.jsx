import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const STATUS_COLORS = {
    'Scheduled': '#2563eb',
    'Completed': '#16a34a',
    'Cancelled': '#9ca3af',
    'No Show':   '#ea580c',
};

function formatDate(dt) {
    return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dt) {
    return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateTime(dt) {
    return new Date(dt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

export default function AppointmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appt, setAppt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/appointments/${id}`)
            .then(res => setAppt(res.data))
            .catch(err => {
                console.error(err);
                setError('Appointment not found.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleComplete = async () => {
        try {
            await axios.put(`/api/appointments/${id}`, {
                customerId: appt.customer_id,
                dateTime: appt.date_time,
                serviceType: appt.service_type,
                status: 'Completed',
                notes: appt.notes,
            });
            setAppt(prev => ({ ...prev, status: 'Completed' }));
            toast.success('Appointment marked as completed.');
        } catch {
            toast.error('Failed to update appointment.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/appointments/${id}`);
            toast.success('Appointment deleted.');
            navigate('/dashboard/appointments');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete appointment.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="appt-detail-page">
            <div className="appt-detail-topbar">
                <button className="appt-detail-back-btn" onClick={() => navigate('/dashboard/appointments')}>
                    ← Back
                </button>
                <div className="flex gap-2 sm:hidden">
                    <button className="appt-detail-edit-btn" onClick={() => navigate(`/dashboard/appointments/${id}/edit`)}>
                        Edit
                    </button>
                    <button className="appt-detail-delete-btn" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>

            <div className="appt-detail-card">
                <div className="appt-detail-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className="appt-detail-title">
                            <Link to={`/dashboard/customers/${appt.customer_id}`} className="appt-detail-customer-link">
                                {appt.first_name} {appt.last_name}
                            </Link>
                        </h2>
                        <span
                            className="appt-status-badge"
                            style={{ backgroundColor: STATUS_COLORS[appt.status] || '#9ca3af' }}
                        >
                            {appt.status}
                        </span>
                    </div>
                    <div className="hidden sm:flex" style={{ gap: '0.5rem' }}>
                        <button className="appt-detail-edit-btn" onClick={() => navigate(`/dashboard/appointments/${id}/edit`)}>
                            Edit
                        </button>
                        <button className="appt-detail-delete-btn" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="appt-detail-fields">
                    <div className="appt-detail-field">
                        <span className="appt-detail-value">{formatDate(appt.date_time)}</span>
                        <span className="appt-card-time">{formatTime(appt.date_time)}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Service Type</span>
                        <span className="appt-detail-value">{appt.service_type}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Status</span>
                        <span className="appt-detail-value">{appt.status}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Notes</span>
                        <span className="appt-detail-value">{appt.notes || '—'}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Booked</span>
                        <span className="appt-detail-value">{formatDateTime(appt.created_at)}</span>
                    </div>
                </div>
            </div>

            {appt.status !== 'Completed' && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem' }}>
                    <button className="appt-detail-complete-btn" onClick={handleComplete}>
                        Mark as Completed
                    </button>
                </div>
            )}
        </div>
    );
}
