import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

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

    if (loading) return <div>Loading customers...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            </div>
            <ul> 
                {customers.map(customer => (
                    <li key={customer.id}>
                       {customer.id} : {customer.first_name} {customer.last_name} - {customer.email} - {customer.phone} 
                    </li>
                ))}
            </ul>
        </div>
        <Link to="/dashboard/customers/add">
            <button>Add Customer</button>
        </Link>
        </>
    );
}

