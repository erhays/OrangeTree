import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const formatDate = (dt) => new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const DEFAULT_HERO = 'We bring the shine back to your vehicle — inside and out. Serving the area with premium detailing at competitive prices.';

const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function Home() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState(null);
    const [heroDescription, setHeroDescription] = useState(DEFAULT_HERO);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);

    const startCarousel = (count) => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setActiveIndex(i => (i + 1) % count);
        }, 5000);
    };

    const goPrev = () => {
        setDirection(-1);
        setActiveIndex(i => (i - 1 + posts.length) % posts.length);
        setPaused(true);
    };

    const goNext = () => {
        setDirection(1);
        setActiveIndex(i => (i + 1) % posts.length);
        setPaused(true);
    };

    useEffect(() => {
        axios.get('/api/reviews').then(res => setReviews(res.data)).catch(() => {});
        axios.get('/api/posts').then(res => {
            const p = res.data.slice(0, 3);
            setPosts(p);
            if (p.length > 1) startCarousel(p.length);
        }).catch(() => {});
        axios.get('/api/settings/hero').then(res => {
            if (res.data.heroDescription) setHeroDescription(res.data.heroDescription);
        }).catch(() => {});
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (posts.length > 1) {
            if (paused) clearInterval(intervalRef.current);
            else startCarousel(posts.length);
        }
    }, [paused, posts.length]);

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
                <div className="home-hero-content">
                    <h1 className="home-hero-title">Scottsdale's premier mobile detailing specialists.</h1>
                    <Link to="/book" className="home-hero-btn">BOOK NOW</Link>
                </div>
                <div className="home-hero-img-wrap">
                    <img src="/hero-car.jpg" alt="Detail car" className="home-hero-img" />
                </div>
                <button className="home-hero-scroll" onClick={() => document.querySelector('.home-latest, .home-contact')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll down">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
            </section>

            {/* Reviews */}
            {reviews?.reviews?.length > 0 && (
                <section className="home-reviews">
                    <h2 className="home-section-title">What Our Customers Say</h2>
                    {reviews.rating && (
                        <p className="home-reviews-summary">
                            <span className="home-reviews-star">★</span> {reviews.rating.toFixed(1)} · {reviews.userRatingCount} reviews on Google
                        </p>
                    )}
                    <div className="home-reviews-grid">
                        {reviews.reviews.map((r, i) => (
                            <div key={i} className="home-review-card">
                                <div className="home-review-header">
                                    {r.authorPhoto
                                        ? <img src={r.authorPhoto} alt={r.authorAttribution?.displayName?.text} className="home-review-avatar" />
                                        : <div className="home-review-avatar home-review-avatar-fallback">{r.authorAttribution?.displayName?.text?.[0] ?? '?'}</div>
                                    }
                                    <div>
                                        <p className="home-review-author">{r.authorAttribution?.displayName?.text}</p>
                                        <p className="home-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                                    </div>
                                </div>
                                <p className="home-review-text">{r.text?.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Latest — carousel */}
            {posts.length > 0 && (
                <section
                    className="home-latest"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <h2 className="home-section-title">Latest</h2>
                    <div className="home-latest-carousel">
                        <div className="home-latest-inner">
                            {posts.length > 1 && (
                                <button className="home-latest-nav" onClick={goPrev} aria-label="Previous post">&#8249;</button>
                            )}
                            <div className="home-latest-track">
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={activeIndex}
                                        className="home-latest-slide"
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    >
                                        <p className="home-latest-date">{formatDate(posts[activeIndex].created_at)}</p>
                                        <h3 className="home-latest-title">{posts[activeIndex].title}</h3>
                                        <div className="home-latest-body rich-text" dangerouslySetInnerHTML={{ __html: posts[activeIndex].body }} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            {posts.length > 1 && (
                                <button className="home-latest-nav" onClick={goNext} aria-label="Next post">&#8250;</button>
                            )}
                        </div>

                        {posts.length > 1 && (
                            <div className="home-latest-dots">
                                {posts.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`home-latest-dot${i === activeIndex ? ' active' : ''}`}
                                        onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); setPaused(true); }}
                                        aria-label={`Go to post ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

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