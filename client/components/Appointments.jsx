import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const PAGE_SIZE = 12;

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

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('/api/appointments');
                setAppointments(response.data);
            } catch (err) {
                setError('Error fetching appointments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/appointments/${id}`);
            setAppointments(prev => prev.filter(a => a.id !== id));
            toast.success('Appointment deleted.');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete appointment.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
    const paginated = appointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="appt-page">
            <h1 className="customer-list-title">Appointments</h1>

            <div className="customer-list-toolbar">
                <span className="customer-list-count">{appointments.length} Appointments</span>
                <button className="customer-list-add-btn" onClick={() => navigate('/dashboard/appointments/add')}>
                    + Book Appointment
                </button>
            </div>

            {appointments.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '2rem' }}>No appointments yet.</p>
            ) : (
                <>
                    <div className="appt-grid">
                        {paginated.map(appt => (
                            <div key={appt.id} className="appt-card">
                                <div className="appt-card-header">
                                    <span className="appt-customer-name">
                                        {appt.first_name} {appt.last_name}
                                    </span>
                                    <span
                                        className="appt-status-badge"
                                        style={{ backgroundColor: STATUS_COLORS[appt.status] || '#9ca3af' }}
                                    >
                                        {appt.status}
                                    </span>
                                </div>
                                <div className="appt-card-field">
                                    <span className="appt-card-label">Date & Time</span>
                                    <span className="appt-card-value">{formatDateTime(appt.date_time)}</span>
                                </div>
                                <div className="appt-card-field">
                                    <span className="appt-card-label">Service</span>
                                    <span className="appt-card-value">{appt.service_type}</span>
                                </div>
                                {appt.notes && (
                                    <div className="appt-card-field">
                                        <span className="appt-card-label">Notes</span>
                                        <span className="appt-card-value appt-notes">{appt.notes}</span>
                                    </div>
                                )}
                                <button
                                    className="customer-list-delete-btn appt-delete-btn"
                                    onClick={() => handleDelete(appt.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="appt-pagination">
                            <button
                                className="appt-page-btn"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Prev
                            </button>
                            <span className="appt-page-info">{page} / {totalPages}</span>
                            <button
                                className="appt-page-btn"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
