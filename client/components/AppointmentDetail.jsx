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
                <button className="appt-detail-delete-btn" onClick={handleDelete}>
                    Delete
                </button>
            </div>

            <div className="appt-detail-card">
                <div className="appt-detail-card-header">
                    <div>
                        <h2 className="appt-detail-title">{appt.service_type} Detail</h2>
                        <span className="appt-detail-id">Appointment #{appt.id}</span>
                    </div>
                    <span
                        className="appt-status-badge"
                        style={{ backgroundColor: STATUS_COLORS[appt.status] || '#9ca3af' }}
                    >
                        {appt.status}
                    </span>
                </div>

                <div className="appt-detail-fields">
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Customer</span>
                        <Link
                            to={`/dashboard/customers/${appt.customer_id}`}
                            className="appt-detail-customer-link"
                        >
                            {appt.first_name} {appt.last_name}
                        </Link>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Date & Time</span>
                        <span className="appt-detail-value">{formatDateTime(appt.date_time)}</span>
                    </div>
                    <div className="appt-detail-field">
                        <span className="appt-detail-label">Service</span>
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
        </div>
    );
}
