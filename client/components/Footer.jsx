import { Link } from 'react-router';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <nav className="site-footer-nav">
                    <Link to="/">Home</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/book">Book</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </nav>
                <div className="site-footer-bottom">
                    <span>&copy; {new Date().getFullYear()} OrangeTree Detailing. All rights reserved.</span>
                    <span>Built by <a href="https://erikhays.dev" target="_blank" rel="noopener noreferrer">Erik Hays</a></span>
                </div>
            </div>
        </footer>
    );
}
