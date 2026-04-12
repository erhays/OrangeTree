import { Link } from 'react-router';

const TIERS = [
    {
        name: 'Full Detail',
        tagline: 'The ultimate vehicle refresh',
        price: 'From $149',
        image: '/full-detail-header.jpg',
        description: 'Experience the ultimate vehicle refresh with our comprehensive mobile detailing service. Designed for first-time clients, we meticulously clean and restore your car inside and out using only high-end detailing products. From interior rejuvenation to exterior brilliance, your vehicle will look, feel, and smell exceptional.',
        exterior: [
            'Pre-soak foam wash for safe dirt removal',
            'Panel-by-panel hand wash for a scratch-free finish',
            'Deep cleaning of wheels, rims, and tires',
            'Tire dressing for a rich, like-new shine',
            'Thorough cleaning of door jambs and crevices',
            'Streak-free exterior and interior window cleaning',
            'Application of a protective ceramic sealant for long-lasting shine and protection',
        ],
        interior: [
            'Full interior vacuum (carpets, seats, trunk, and hard-to-reach areas)',
            'Light shampoo treatment for seats to remove stains and odors',
            'Streak-free cleaning of all interior glass and mirrors',
            'Deep cleaning of cup holders, center console, and high-touch areas',
            'Detailed cleaning of steering wheel and dashboard',
            'Cleaning and conditioning of door panels and trim',
            'Door jamb wipe-down for a complete finish',
        ],
        addons: null,
        premium: false,
    },
    {
        name: 'Premium Detail',
        tagline: 'Showroom-quality results with advanced protection',
        price: 'From $299',
        image: '/premium-detail-header.jpg',
        description: 'Showroom-quality results with advanced protection and deep restoration. Our most thorough package brings your vehicle back to its best — combining paint enhancement, deep cleaning, and long-lasting protective treatments inside and out.',
        exterior: [
            'Pre-treatment foam bath for safe dirt and grime removal',
            'Panel-by-panel hand wash using premium wash methods',
            'Clay bar treatment to remove embedded contaminants and restore smoothness',
            'Light paint enhancement polish to boost gloss and remove minor imperfections',
            'Deep cleaning of wheels, rims, and tires (including brake dust removal)',
            'Tire dressing + trim restoration for a rich, satin finish',
            'Full cleaning of door jambs, cracks, and crevices',
            'Streak-free cleaning of all exterior glass',
            'Ceramic sealant protection (enhanced durability + hydrophobic finish)',
            'Exterior plastic and trim conditioning to restore faded surfaces',
        ],
        interior: [
            'Full interior vacuum (including under seats and tight areas)',
            'Deep steam cleaning & shampoo extraction for carpets and seats',
            'Leather cleaning & conditioning (if applicable)',
            'Deep cleaning of cup holders, center console, vents, and high-touch areas',
            'Detailed cleaning of dashboard, steering wheel, and controls',
            'Door panels and trim cleaned and conditioned',
            'Streak-free interior glass cleaning',
            'Odor elimination treatment (neutralizes odors at the source)',
            'Interior protectant application (UV protection for dash, plastics, and trim)',
        ],
        addons: [
            'Engine bay cleaning & dressing (safe and professional)',
            'Pet hair removal (time-intensive, high-value service)',
            'Salt/stain removal treatment (if needed)',
            'Final inspection + touch-ups to ensure flawless results',
        ],
        premium: true,
    },
];

export default function Services() {
    return (
        <div className="services-page">
            <section className="about-hero">
                <div className="about-hero-inner">
                    <h1>Services</h1>
                    <p>Professional mobile detailing — delivered to your door.</p>
                </div>
            </section>

            <section className="services-tiers">
                <div className="services-tiers-inner">
                    <div className="services-tier-grid">
                        {TIERS.map(tier => (
                            <div key={tier.name} className="services-tier-card">
                                <div className="services-tier-content" style={{ flex: 1 }}>
                                    <div
                                        className="services-tier-header"
                                        style={{ backgroundImage: `url(${tier.image})` }}
                                    >
                                        <div className="services-tier-header-overlay">
                                            <h2 className="services-tier-name">{tier.name}</h2>
                                            <p className="services-tier-tagline">{tier.tagline}</p>
                                            <span className="services-tier-price">{tier.price}</span>
                                        </div>
                                    </div>
                                    <div className="services-tier-body">
                                        <p className="services-tier-desc">{tier.description}</p>

                                        <div className="services-tier-section">
                                            <p className="services-tier-section-title">Exterior Detailing</p>
                                            <ul className="services-tier-list">
                                                {tier.exterior.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>

                                        <div className="services-tier-section">
                                            <p className="services-tier-section-title">Interior Detailing</p>
                                            <ul className="services-tier-list">
                                                {tier.interior.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    {tier.addons && (
                                        <div className="services-tier-addons">
                                            <p className="services-tier-addons-title">Premium Add-Ons Included</p>
                                            <ul className="services-tier-list">
                                                {tier.addons.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="services-cta">
                <h2>Ready to book?</h2>
                <p>We come to you — at home, at work, wherever works best.</p>
                <Link to="/book" className="services-cta-btn">Book an Appointment</Link>
            </section>
        </div>
    );
}
