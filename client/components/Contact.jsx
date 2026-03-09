import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const EMPTY_FORM = { name: '', email: '', message: '' };

export default function Contact() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [business, setBusiness] = useState(null);

    useEffect(() => {
        axios.get('/api/business-info').then(res => setBusiness(res.data)).catch(() => {});
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/contact', form);
            window.umami?.track('contact-form-submitted');
            toast.success('Message sent! We\'ll be in touch soon.');
            setForm(EMPTY_FORM);
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <section className="about-hero">
                <div className="about-hero-inner">
                    <h1>Contact</h1>
                    <p>We'd love to hear from you. Send us a message or find us below.</p>
                </div>
            </section>
            <div className="contact-inner">
                {/* Business info */}
                <div className="contact-info">
                    <h2 className="contact-title">Get in Touch</h2>

                    {business && (
                        <div className="contact-details">
                            {business.address && (
                                <div className="contact-detail-item">
                                    <span className="contact-detail-label">Address</span>
                                    <span className="contact-detail-value">{business.address}</span>
                                </div>
                            )}
                            {business.phone && (
                                <div className="contact-detail-item">
                                    <span className="contact-detail-label">Phone</span>
                                    <a href={`tel:${business.phone}`} className="contact-detail-link">{business.phone}</a>
                                </div>
                            )}
                            {business.rating && (
                                <div className="contact-detail-item">
                                    <span className="contact-detail-label">Google Rating</span>
                                    <span className="contact-detail-value">
                                        ★ {business.rating.toFixed(1)} &middot; {business.userRatingCount} reviews
                                    </span>
                                </div>
                            )}
                            {business.hours?.length > 0 && (
                                <div className="contact-detail-item contact-detail-hours">
                                    <span className="contact-detail-label">Hours</span>
                                    <ul className="contact-hours-list">
                                        {business.hours.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Contact form */}
                <div className="contact-form-wrap">
                    <form className="home-contact-form" style={{ margin: 0 }} onSubmit={handleSubmit}>
                        <div className="home-contact-row">
                            <div className="home-contact-field">
                                <label className="home-contact-label">Name</label>
                                <input
                                    className="home-contact-input"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="home-contact-field">
                                <label className="home-contact-label">Email</label>
                                <input
                                    className="home-contact-input"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="home-contact-field">
                            <label className="home-contact-label">Message</label>
                            <textarea
                                className="home-contact-input home-contact-textarea"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="How can we help?"
                            />
                        </div>
                        <button type="submit" className="home-contact-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
