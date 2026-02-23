import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    return (
        <div className="customer-list-page">
            <h1 className="customer-list-title">Customers</h1>

            <div className="customer-list-toolbar">
                <span className="customer-list-count">{customers.length} Customers</span>
                <Link to="/dashboard/customers/add">
                    <button className="customer-list-add-btn">+ Add Customer</button>
                </Link>
            </div>

            <div className="customer-list-header">
                <span>Name</span>
                <span>Phone</span>
                <span>Email</span>
                <span>Customer ID</span>
                <span></span>
            </div>

            <div className="customer-list-rows">
                {customers.map(customer => (
                    <div key={customer.id} className="customer-list-row" onClick={() => navigate(`/dashboard/customers/${customer.id}`)}>
                        <span className="customer-list-name">
                            {customer.first_name} {customer.last_name}
                        </span>
                        <span className="customer-list-phone">{customer.phone}</span>
                        <span className="customer-list-email">{customer.email}</span>
                        <span className="customer-list-id">#{customer.id}</span>
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

