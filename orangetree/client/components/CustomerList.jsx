import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                setCustomers(response.data);
            } catch (err) {
                setError('Error fetching customers');
                console.error(err);
            } finally {
                setLoading(false);}
            };

        fetchCustomers();
    }, []);

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
            </div>

            <div className="customer-list-rows">
                {customers.map(customer => (
                    <div key={customer.id} className="customer-list-row">
                        <span className="customer-list-name">
                            {customer.first_name} {customer.last_name}
                        </span>
                        <span className="customer-list-phone">{customer.phone}</span>
                        <span className="customer-list-email">{customer.email}</span>
                        <span className="customer-list-id">#{customer.id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

