import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const SERVICE_TYPES = ['Full', 'Quick', 'Premium'];
const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

function toDateTimeLocal(isoString) {
    const dt = new Date(isoString);
    const pad = n => String(n).padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export default function EditAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/appointments/${id}`),
            axios.get('/api/customers')
        ]).then(([apptRes, custRes]) => {
            const a = apptRes.data;
            setForm({
                customerId: String(a.customer_id),
                dateTime: toDateTimeLocal(a.date_time),
                serviceType: a.service_type,
                status: a.status,
                notes: a.notes || ''
            });
            setCustomers(custRes.data);
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load appointment.');
        }).finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`/api/appointments/${id}`, form);
            toast.success('Appointment updated.');
            navigate(`/dashboard/appointments/${id}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update appointment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <>
            <h2>Edit Appointment</h2>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">Edit Appointment</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Label>Customer</Form.Label>
                                            <Form.Select name="customerId" value={form.customerId} onChange={handleChange} required>
                                                <option value="">Select a customer...</option>
                                                {customers.map(c => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.first_name} {c.last_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Label>Date & Time</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="dateTime"
                                                value={form.dateTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Label>Service Type</Form.Label>
                                            <Form.Select name="serviceType" value={form.serviceType} onChange={handleChange} required>
                                                <option value="">Select...</option>
                                                {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                                            </Form.Select>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select name="status" value={form.status} onChange={handleChange}>
                                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                                            </Form.Select>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Label>Notes</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="notes"
                                                value={form.notes}
                                                onChange={handleChange}
                                            />
                                        </Col>

                                        <Col xs={12} className="d-flex gap-3 mt-4">
                                            <Button
                                                variant="outline-secondary"
                                                type="button"
                                                className="flex-grow-1"
                                                onClick={() => navigate(`/dashboard/appointments/${id}`)}
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
