import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const SERVICE_TYPES = ['Quick', 'Full', 'Premium'];

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    dateTime: '',
    notes: '',
};

export default function BookAppointment() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/bookings', form);
            setSubmitted(true);
            toast.success('Appointment booked! We\'ll confirm with you shortly.');
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="book-page">
                <div className="book-success">
                    <h1 className="book-success-title">You're booked!</h1>
                    <p className="book-success-sub">
                        Thanks for scheduling with OrangeTree Detailing. We'll reach out to confirm your appointment details.
                    </p>
                    <div className="book-success-actions">
                        <Link to="/" className="book-btn-outline">Back to Home</Link>
                        <button className="book-btn" onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }}>
                            Book Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="book-page">
            <div className="book-card">
                <div className="book-card-header">
                    <h1 className="book-title">Book an Appointment</h1>
                    <p className="book-sub">Fill out the form below and we'll get you scheduled.</p>
                </div>

                <form className="book-form" onSubmit={handleSubmit}>
                    <div className="book-row">
                        <div className="book-field">
                            <label className="book-label">First Name</label>
                            <input
                                className="book-input"
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Jane"
                            />
                        </div>
                        <div className="book-field">
                            <label className="book-label">Last Name</label>
                            <input
                                className="book-input"
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Smith"
                            />
                        </div>
                    </div>

                    <div className="book-row">
                        <div className="book-field">
                            <label className="book-label">Email</label>
                            <input
                                className="book-input"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div className="book-field">
                            <label className="book-label">Phone <span className="book-optional">(optional)</span></label>
                            <input
                                className="book-input"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="(555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="book-row">
                        <div className="book-field">
                            <label className="book-label">Service Type</label>
                            <select
                                className="book-input"
                                name="serviceType"
                                value={form.serviceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a service…</option>
                                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s} Detail</option>)}
                            </select>
                        </div>
                        <div className="book-field">
                            <label className="book-label">Preferred Date & Time</label>
                            <input
                                className="book-input"
                                type="datetime-local"
                                name="dateTime"
                                value={form.dateTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="book-field">
                        <label className="book-label">Notes <span className="book-optional">(optional)</span></label>
                        <textarea
                            className="book-input book-textarea"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Anything we should know about your vehicle?"
                        />
                    </div>

                    <div className="book-actions">
                        <Link to="/" className="book-btn-outline">Cancel</Link>
                        <button type="submit" className="book-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Booking…' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
