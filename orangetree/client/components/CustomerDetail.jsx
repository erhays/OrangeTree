import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
                setCustomer(response.data);
            } catch (err) {
                setError('Customer not found.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
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
        </div>
    );
}
