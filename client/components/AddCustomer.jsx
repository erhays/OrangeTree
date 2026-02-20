import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

export default function AddCustomer() {

    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/customers', customer);
            console.log('Customer added successfully');
            navigate('/dashboard/customers');
            setCustomer({
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            });
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('Failed to add customer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <>
    <h2>Add Customer</h2>
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Add New Customer</h4>
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

                  {/* You can add more fields here */}
                  {/* <Col md={6}>
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="Phoenix" />
                  </Col> */}

                  <Col xs={12} className="d-flex gap-3 mt-4">
                  <Link to="/dashboard/customers" className="flex-grow-1">
                    <Button variant="outline-secondary" type="button"className="flex-grow-1"
                    >
                      Cancel
                    </Button>
                    </Link>
                    
                    <Button variant="primary" type="submit" className="flex-grow-1">
                      Add Customer
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

