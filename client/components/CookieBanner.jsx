import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const KEY = 'cookie_consent';

export default function CookieBanner() {
    const [visible, setVisible] = useState(() => typeof localStorage !== 'undefined' && !localStorage.getItem(KEY));

    const respond = (value) => {
        localStorage.setItem(KEY, value);
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="cookie-banner"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <p className="cookie-banner-text">
                        We use cookies to improve your experience. See our <Link to="/privacy" className="cookie-banner-link">Privacy Policy</Link>.
                    </p>
                    <div className="cookie-banner-actions">
                        <button className="cookie-banner-decline" onClick={() => respond('declined')}>Decline</button>
                        <button className="cookie-banner-accept" onClick={() => respond('accepted')}>Accept</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
