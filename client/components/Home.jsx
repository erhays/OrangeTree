import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const SERVICES = [
    {
        name: 'Quick Detail',
        description: 'Exterior wash, tire shine, and interior wipe-down. Perfect for a fast refresh.',
        price: 'From $49',
    },
    {
        name: 'Full Detail',
        description: 'Complete interior and exterior detail, including hand wax and deep vacuum.',
        price: 'From $149',
    },
    {
        name: 'Premium Detail',
        description: 'Everything in Full plus paint decontamination, clay bar, and ceramic coating prep.',
        price: 'From $299',
    },
];

export default function Home() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/contact', form);
            toast.success('Message sent! We\'ll be in touch soon.');
            setForm({ name: '', email: '', message: '' });
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="home-hero">
                <h1 className="home-hero-title">Professional Auto Detailing</h1>
                <p className="home-hero-sub">
                    We bring the shine back to your vehicle — inside and out.
                    Serving the area with premium detailing at competitive prices.
                </p>
                <Link to="/book" className="home-hero-btn">Book an Appointment</Link>
            </section>

            {/* Services */}
            <section className="home-services">
                <h2 className="home-section-title">Our Services</h2>
                <div className="home-services-grid">
                    {SERVICES.map(s => (
                        <div key={s.name} className="home-service-card">
                            <h3 className="home-service-name">{s.name}</h3>
                            <p className="home-service-desc">{s.description}</p>
                            <span className="home-service-price">{s.price}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="home-contact">
                <h2 className="home-section-title">Get in Touch</h2>
                <p className="home-contact-sub">Have a question? Send us a message and we'll get back to you.</p>
                <form className="home-contact-form" onSubmit={handleSubmit}>
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
                            rows={4}
                            placeholder="How can we help?"
                        />
                    </div>
                    <button type="submit" className="home-contact-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send Message'}
                    </button>
                </form>
            </section>
        </div>
    );
}