import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('/api/customers');
                setCustomers(response.data);
            } catch (err) {
                setError('Error fetching customers');
                console.error(err);
            } finally {
                setLoading(false);}
            };

        fetchCustomers();
    }, []);

    const handleDelete = async (id, name) => {
        try {
            await axios.delete(`/api/customers/${id}`);
            setCustomers(prev => prev.filter(c => c.id !== id));
            toast.success(`${name} deleted.`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete customer.');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    const sorted = [...customers].sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at) : new Date(0);
        const bTime = b.created_at ? new Date(b.created_at) : new Date(0);
        return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return (
        <div className="customer-list-page">
            <h1 className="customer-list-title">Customers</h1>

            <div className="customer-list-toolbar">
                <span className="customer-list-count">{customers.length} Customers</span>
                <div className="appt-toolbar-right">
                    <select
                        className="appt-filter-select"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    <Link to="/dashboard/customers/add">
                        <button className="customer-list-add-btn">
                            <span className="hidden sm:inline">+ Add Customer</span>
                            <span className="sm:hidden">+ Add</span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="customer-list-header">
                <span>Name</span>
                <span>Email</span>
                <span></span>
            </div>

            <div className="customer-list-rows">
                {sorted.map(customer => (
                    <div key={customer.id} className="customer-list-row" onClick={() => navigate(`/dashboard/customers/${customer.id}`)}>
                        <span className="customer-list-name">
                            {customer.first_name} {customer.last_name}
                        </span>
                        <span className="customer-list-email">{customer.email}</span>
                        <button
                            className="customer-list-delete-btn"
                            onClick={(e) => { e.stopPropagation(); handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`); }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

