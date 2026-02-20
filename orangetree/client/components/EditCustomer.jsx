import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function EditCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
                const c = response.data;
                setCustomer({
                    firstName: c.first_name,
                    lastName: c.last_name,
                    email: c.email,
                    phone: c.phone || ''
                });
            } catch (err) {
                console.error(err);
                toast.error('Failed to load customer.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:5000/api/customers/${id}`, customer);
            toast.success('Customer updated.');
            navigate(`/dashboard/customers/${id}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update customer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <>
            <h2>Edit Customer</h2>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">Edit Customer</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={customer.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={customer.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={customer.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={customer.phone}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col xs={12} className="d-flex gap-3 mt-4">
                                            <Button
                                                variant="outline-secondary"
                                                type="button"
                                                className="flex-grow-1"
                                                onClick={() => navigate(`/dashboard/customers/${id}`)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit" className="flex-grow-1" disabled={isSubmitting}>
                                                {isSubmitting ? 'Saving…' : 'Save Changes'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
