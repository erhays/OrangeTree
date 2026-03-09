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

function ReviewAvatar({ r }) {
    const name = r.authorAttribution?.displayName?.text;
    const photo = r.authorAttribution?.photoUri;
    const [failed, setFailed] = useState(false);
    if (photo && !failed) {
        return <img src={photo} alt={name} className="home-review-avatar" onError={() => setFailed(true)} referrerPolicy="no-referrer" />;
    }
    return <div className="home-review-avatar home-review-avatar-fallback">{name?.[0] ?? '?'}</div>;
}

export default function Home() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState(null);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewDirection, setReviewDirection] = useState(1);
    const [reviewPaused, setReviewPaused] = useState(false);
    const reviewIntervalRef = useRef(null);
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

    useEffect(() => {
        if (!reviews?.reviews?.length) return;
        const len = reviews.reviews.length;
        if (reviewPaused) {
            clearInterval(reviewIntervalRef.current);
        } else {
            reviewIntervalRef.current = setInterval(() => { setReviewDirection(1); setReviewIndex(i => (i + 1) % len); }, 5000);
        }
        return () => clearInterval(reviewIntervalRef.current);
    }, [reviews, reviewPaused]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/contact', form);
            window.umami?.track('contact-form-submitted');
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
                    <Link to="/book" className="home-hero-btn" onClick={() => window.umami?.track('book-now-click')}>BOOK NOW</Link>
                </div>
                <div className="home-hero-img-wrap">
                    <img src="/hero-car.jpg" alt="Detail car" className="home-hero-img" />
                </div>
                <button className="home-hero-scroll" onClick={() => document.querySelector('.home-reviews, .home-latest, .home-contact')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll down">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className="home-hero-chevron">
                    <svg viewBox="0 0 1440 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,70 720,0 1440,70" fill="#fff"/>
                    </svg>
                </div>
            </section>

            {/* Reviews */}
            {reviews?.reviews?.length > 0 && (() => {
                const all = reviews.reviews;
                const len = all.length;
                const cards = [0, 1, 2].map(offset => all[(reviewIndex + offset) % len]);
                return (
                    <section className="home-reviews" onMouseEnter={() => setReviewPaused(true)} onMouseLeave={() => setReviewPaused(false)}>
                        <div className="home-reviews-inner">
                            <h2 className="home-section-title">What Our Customers Say</h2>
                            {reviews.rating && (
                                <p className="home-reviews-summary">
                                    <span className="home-reviews-star">★</span> {reviews.rating.toFixed(1)} · {reviews.userRatingCount} reviews on Google
                                </p>
                            )}
                            <div className="home-reviews-carousel">
                                <button className="home-reviews-nav" onClick={() => { setReviewDirection(-1); setReviewIndex(i => (i - 1 + len) % len); setReviewPaused(true); }} aria-label="Previous review">&#8249;</button>
                                <div className="home-reviews-track-wrap">
                                    <AnimatePresence initial={false} custom={reviewDirection} mode="wait">
                                        <motion.div
                                            key={reviewIndex}
                                            className="home-reviews-track"
                                            custom={reviewDirection}
                                            variants={{ enter: d => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }), center: { x: 0, opacity: 1 }, exit: d => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }) }}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        >
                                            {cards.map((r, i) => (
                                                <div key={i} className={`home-review-card${i === 1 ? ' home-review-card-hide-mobile' : i === 2 ? ' home-review-card-hide-medium' : ''}`}>
                                                    <div className="home-review-header">
                                                        <ReviewAvatar r={r} />
                                                        <div>
                                                            <p className="home-review-author">{r.authorAttribution?.displayName?.text}</p>
                                                            <p className="home-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="home-review-text">{r.text?.text}</p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <button className="home-reviews-nav" onClick={() => { setReviewDirection(1); setReviewIndex(i => (i + 1) % len); setReviewPaused(true); }} aria-label="Next review">&#8250;</button>
                            </div>
                        </div>
                    </section>
                );
            })()}


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