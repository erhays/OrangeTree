import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authed, setAuthed] = useState(null);
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

    const linkClass = 'px-3 py-1.5 text-white hover:bg-gray-800 rounded-md text-sm font-light transition';
    const mobileLinkClass = 'flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-800 rounded font-light transition w-full text-left';

    return (
        <header className="fixed top-0 z-50 w-full bg-black">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <svg className="h-8 w-8 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 388.47 391.28">
                                <defs><style>{`.ot-cls-1{stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:7px}`}</style></defs>
                                <g>
                                    <g>
                                        <path d="M139.98,330.28c.02.06.04.13.06.19.02.06.1.29.08.21-.04-.13-.09-.26-.14-.4Z"/>
                                        <path d="M116.28,335.35c.07.05.13.08.12.05,0-.01-.05-.03-.12-.05Z"/>
                                        <path d="M42.33,244.45c8.53,34.42,28.83,64.69,57.06,86.15,3.73,2.78,9.77,3.89,12.67,4.16,2.03.22,3.43.42,4.03.54.38.54.64,1.36.89,1.99.72,2.14,1.76,4.29,3.28,5.92,1.21,1.4,2.85,2.68,4.4,3.64,8.91,5.13,18.92,7.09,28.6,9.19,9.88,1.92,19.69,3.31,30.03,3.85,96.1,3.16,182.93-78.57,164.79-177.54-4.73-30.53-19.93-59.87-43.54-80.06-7.94-6.83-16.11-13.88-27.54-13.32l-5.42,9.58c3.03,6.82,8.25,11.13,13.89,15.45,22.5,17.41,36.75,43.77,40.76,71.82,14.19,78.98-52.27,145.54-128.8,150.07-13.25.88-26.28-.83-39.45-3.42-6.2-1.19-13.97-3.24-19.15-5.37-2.72-6.36-7.53-11.99-14.24-14.27-5.34-1.83-8.83-1.55-12-2.3-32.56-25.11-50.11-61.6-52.03-102.62-4.9-74.89,54.9-128.41,127.54-129.13,11.71-.13,23,.38,34.79-1.17,0,0,2.57-10.02,2.57-10.02-12.79-8.91-28.87-10.45-44-9.74-36.95,1.46-73.74,15.26-100.9,40.88-40.7,37.76-51.37,93.06-38.2,145.69Z"/>
                                    </g>
                                    <path className="ot-cls-1" d="M297.67,31.4c-39.83-1.48-50.58,36.93-53.15,50.74-.29,1.56,1.58,2.58,2.74,1.49,4.5-4.2,12.64-11.24,20.03-14.68,17.4-8.1,34.04,5.35,51.59-4.31,17.28-9.51,9.75-32.1-21.21-33.25Z"/>
                                </g>
                                <g>
                                    <circle cx="84.86" cy="213.03" r="3.12"/><circle cx="111.36" cy="191.73" r="3.12"/><circle cx="133.8" cy="173.27" r="3.12"/><circle cx="154.4" cy="157.29" r="3.12"/><circle cx="177.26" cy="142.63" r="3.12"/><circle cx="199.58" cy="130.86" r="3.12"/><circle cx="227.34" cy="121.4" r="3.12"/>
                                    <circle cx="89.59" cy="246.68" r="1.5"/><circle cx="114.52" cy="222.19" r="1.5"/><circle cx="141.35" cy="199.47" r="1.5"/><circle cx="164.59" cy="182.72" r="1.5"/><circle cx="186.65" cy="165.27" r="1.5"/><circle cx="208.63" cy="152.22" r="1.5"/><circle cx="234.09" cy="141.52" r="1.5"/><circle cx="264.94" cy="128.26" r="1.5"/>
                                    <circle cx="89.86" cy="160.41" r="5"/><circle cx="107.35" cy="137.63" r="5"/><circle cx="127.49" cy="117.38" r="5"/><circle cx="154.4" cy="104.57" r="5"/><circle cx="185.06" cy="97.37" r="5"/>
                                    <circle cx="85.75" cy="188.61" r="4.01"/><circle cx="111.36" cy="164.43" r="4.01"/><circle cx="134.94" cy="143.86" r="4.01"/><circle cx="154.4" cy="128.62" r="4.01"/><circle cx="177.26" cy="117.38" r="4.01"/><circle cx="207.97" cy="109.57" r="4.01"/>
                                </g>
                            </svg>
                            <span className="text-xl tracking-wide text-white"><span className="logo-heavy">ORANGE</span><span className="logo-thin">TREE</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Link to="/about" className={linkClass}>About</Link>
                        <Link to="/services" className={linkClass}>Services</Link>
                        <Link to="/contact" className={linkClass}>Contact</Link>
                        {authed === true && (
                            <>
                                <Link to="/dashboard" className={linkClass}>Dashboard</Link>
                                <button onClick={handleLogout} className={linkClass}>Logout</button>
                            </>
                        )}
                        {authed === false && (
                            <Link to="/login" className={linkClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800"
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
                            className="md:hidden absolute left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 pb-3 space-y-1"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                        >
                            <Link to="/about" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>About</Link>
                            <Link to="/services" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Services</Link>
                            <Link to="/contact" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Contact</Link>
                            {authed === true && (
                                <>
                                    <Link to="/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={handleLogout} className={mobileLinkClass}>Logout</button>
                                </>
                            )}
                            {authed === false && (
                                <Link to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    Admin
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