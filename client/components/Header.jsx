import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authed, setAuthed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/me').then(() => setAuthed(true)).catch(() => setAuthed(false));
    }, []);

    const handleLogout = async () => {
        await axios.post('/api/logout');
        setAuthed(false);
        setMenuOpen(false);
        navigate('/');
    };

    const linkClass = 'px-3 py-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm transition';
    const mobileLinkClass = 'flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition w-full text-left';

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 relative">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/"><p className="text-2xl font-bold text-gray-900">OrangeTree Detailing</p></Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {authed ? (
                            <button onClick={handleLogout} className={linkClass}>Logout</button>
                        ) : (
                            <Link to="/login" className={linkClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setMenuOpen(prev => !prev)}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className="md:hidden absolute left-0 right-0 bg-white shadow-md px-4 pb-3 space-y-1"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                        >
                            {authed ? (
                                <button onClick={handleLogout} className={mobileLinkClass}>Logout</button>
                            ) : (
                                <Link to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    Login
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}

export default Header;