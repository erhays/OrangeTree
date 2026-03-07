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

export default function Services() {
    return (
        <div className="page-content">
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
        </div>
    );
}
