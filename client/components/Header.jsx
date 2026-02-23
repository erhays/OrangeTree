import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1'
            : 'text-gray-700 hover:text-indigo-600 transition';

    const mobileNavLinkClass = ({ isActive }) =>
        isActive
            ? 'block px-4 py-2 text-indigo-600 font-semibold bg-indigo-50 rounded'
            : 'block px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition';

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm relative">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/"><p className="text-2xl font-bold text-gray-900">OrangeTree Detailing</p></Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                        <NavLink to="/dashboard" className={navLinkClass}>Admin</NavLink>
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
                            <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
                            <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}

export default Header;