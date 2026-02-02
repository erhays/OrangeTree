import { Link, NavLink } from 'react-router'

function Header() {
    return (
        <header class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
            <nav className="header" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <div class="flex h-16 items-center justify-between">
                    {/* Logo */}                   
                    <div class="flex-shrink-0">
                        <Link to="/"><p class="text-2x1 font-bold text-gray-900">OrangeTree Detailing</p></Link>
                    </div>

                    {/* Desktop Menu */}
                    <div class="hidden md:flex md:items-center md:space-x-8">
                        <NavLink to="/" end className={({ isActive }) =>
                         isActive
                            ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1'
                            : 'text-gray-700 hover:text-indigo-600 transition'
                        }>
                            <a class="text-gray-700 hover:text-indigo-600">Home</a>
                        </NavLink>
                        <NavLink to="/dashboard" className={({ isActive }) =>
                         isActive
                            ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1'
                            : 'text-gray-700 hover:text-indigo-600 transition'
                        }>
                            <a class="text-gray-700 hover:text-indigo-600">Admin</a>
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div class="md:hidden">
                        <button id="mobile-menu-btn" type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );  
}

export default Header;