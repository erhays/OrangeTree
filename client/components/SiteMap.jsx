import { Link } from 'react-router';

const PAGES = [
    {
        heading: 'Main',
        links: [
            { label: 'Home', to: '/', desc: 'Welcome page and hero' },
            { label: 'Services', to: '/services', desc: 'Our detailing service offerings' },
            { label: 'Book an Appointment', to: '/book', desc: 'Schedule your detail online' },
        ],
    },
    {
        heading: 'Legal',
        links: [
            { label: 'Privacy Policy', to: '/privacy', desc: 'How we handle your data' },
            { label: 'Sitemap', to: '/sitemap', desc: 'This page' },
        ],
    },
];

export default function SiteMap() {
    return (
        <div className="sitemap-page">
            <div className="sitemap-inner">
                <h1>Sitemap</h1>
                {PAGES.map(section => (
                    <section key={section.heading} className="sitemap-section">
                        <h2>{section.heading}</h2>
                        <ul className="sitemap-list">
                            {section.links.map(({ label, to, desc }) => (
                                <li key={to} className="sitemap-item">
                                    <Link to={to}>{label}</Link>
                                    {desc && <span className="sitemap-desc">{desc}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
