import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const PAGE_SIZE = 12;

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

const STATUSES = ['All', 'Scheduled', 'Completed', 'Cancelled', 'No Show'];

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('All');
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

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    const filtered = statusFilter === 'All' ? appointments : appointments.filter(a => a.status === statusFilter);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="appt-page">
            <h1 className="customer-list-title">Appointments</h1>

            <div className="customer-list-toolbar">
                <span className="customer-list-count">{filtered.length} Appointments</span>
                <div className="appt-toolbar-right">
                    <select
                        className="appt-filter-select"
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="customer-list-add-btn" onClick={() => navigate('/dashboard/appointments/add')}>
                        <span className="hidden sm:inline">+ Book Appointment</span>
                        <span className="sm:hidden">+ Book</span>
                    </button>
                </div>
            </div>

            {appointments.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '2rem' }}>No appointments yet.</p>
            ) : (
                <>
                    <div className="appt-grid">
                        {paginated.map(appt => (
                            <div key={appt.id} className="appt-card" onClick={() => navigate(`/dashboard/appointments/${appt.id}`)}>
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
                                <div className="appt-card-datetime">
                                    <span className="appt-card-date">{formatDate(appt.date_time)}</span>
                                    <span className="appt-card-time">{formatTime(appt.date_time)}</span>
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
