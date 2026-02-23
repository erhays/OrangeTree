import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const STATUS_COLORS = {
    'Scheduled': '#2563eb',
    'Completed': '#16a34a',
    'Cancelled': '#9ca3af',
    'No Show': '#ea580c',
};

function formatDateTime(dt) {
    return new Date(dt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerRes, apptRes] = await Promise.all([
                    axios.get(`/api/customers/${id}`),
                    axios.get(`/api/customers/${id}/appointments`)
                ]);
                setCustomer(customerRes.data);
                setAppointments(apptRes.data);
            } catch (err) {
                setError('Customer not found.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="customer-detail-page">
            <div className="customer-detail-topbar">
                <button className="customer-detail-back-btn" onClick={() => navigate('/dashboard/customers')}>
                    ← Back
                </button>
                <button className="customer-detail-edit-btn" onClick={() => navigate(`/dashboard/customers/${id}/edit`)}>
                    Edit
                </button>
            </div>

            <div className="customer-detail-card">
                <h2 className="customer-detail-name">
                    {customer.first_name} {customer.last_name}
                </h2>
                <span className="customer-detail-id">Customer #{customer.id}</span>

                <div className="customer-detail-fields">
                    <div className="customer-detail-field">
                        <span className="customer-detail-label">Email</span>
                        <span className="customer-detail-value">{customer.email}</span>
                    </div>
                    <div className="customer-detail-field">
                        <span className="customer-detail-label">Phone</span>
                        <span className="customer-detail-value">{customer.phone || '—'}</span>
                    </div>
                </div>
            </div>

            <div className="customer-appt-history">
                <h3 className="customer-appt-history-title">Appointment History</h3>
                {appointments.length === 0 ? (
                    <p className="customer-appt-history-empty">No appointments on record.</p>
                ) : (
                    <table className="customer-appt-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appt => (
                                <tr key={appt.id}>
                                    <td>{formatDateTime(appt.date_time)}</td>
                                    <td>{appt.service_type}</td>
                                    <td>
                                        <span
                                            className="appt-status-badge"
                                            style={{ backgroundColor: STATUS_COLORS[appt.status] || '#9ca3af' }}
                                        >
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="customer-appt-notes">{appt.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
