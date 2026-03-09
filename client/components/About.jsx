import { Link } from 'react-router';

const VALUES = [
    {
        title: 'We Come to You',
        body: 'As a fully mobile service, we bring professional-grade equipment directly to your home, office, or anywhere your vehicle is parked. No appointments at a shop, no waiting rooms.',
    },
    {
        title: 'Attention to Detail',
        body: 'Every vehicle we work on gets our full focus. We don\'t rush — we take the time to do the job right, from the door jambs to the dashboard.',
    },
    {
        title: 'Professional Products',
        body: 'We use industry-leading chemicals, clay bars, and ceramic-grade compounds. The same products used by professional detailers nationwide.',
    },
    {
        title: 'Transparent Pricing',
        body: 'No hidden fees, no surprises. Our tiered service packages make it easy to choose the level of care that fits your vehicle and your budget.',
    },
];

export default function About() {
    return (
        <div className="about-page">
            {/* Hero strip */}
            <section className="about-hero">
                <div className="about-hero-inner">
                    <h1>About</h1>
                    <p>Scottsdale's mobile detailing specialists — bringing the shine to you.</p>
                </div>
            </section>

            {/* Story */}
            <section className="about-section">
                <div className="about-inner">
                    <div className="about-story">
                        <h2>Our Story</h2>
                        <p>
                            OrangeTree Detailing was founded with one goal: make professional auto detailing convenient, affordable, and consistent. We got tired of watching great cars get mediocre treatment at drive-through washes. We believed every vehicle deserved the kind of care that keeps it looking showroom-fresh — and that the owner shouldn't have to go out of their way to get it.
                        </p>
                        <p>
                            Based in Scottsdale, Arizona, we serve the greater Phoenix metro area. Whether you drive a daily commuter or a weekend show car, we have a package built for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-values-section">
                <div className="about-inner">
                    <h2 className="about-values-heading">Why Choose Us</h2>
                    <div className="about-values-grid">
                        {VALUES.map(v => (
                            <div key={v.title} className="about-value-card">
                                <h3>{v.title}</h3>
                                <p>{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="about-inner">
                    <h2>Ready to book?</h2>
                    <p>Schedule your detail online in minutes. We'll take care of the rest.</p>
                    <div className="about-cta-actions">
                        <Link to="/book" className="about-cta-btn">Book Now</Link>
                        <Link to="/contact" className="about-cta-btn-outline">Contact Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
