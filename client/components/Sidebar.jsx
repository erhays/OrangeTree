import { NavLink } from 'react-router'

const links = [
    { to: '/dashboard/customers', label: 'Customers' },
    { to: '/dashboard/appointments', label: 'Appointments' },
    { to: '/dashboard/insights', label: 'Insights' },
    { to: '/dashboard/content', label: 'Content' },
    { to: '/dashboard/settings', label: 'Settings' },
]

function Sidebar() {
    return (
        <aside className="bg-slate-800 md:w-56 md:min-h-screen md:px-4 md:py-6 w-full px-3 py-2">
            <nav className="flex flex-wrap justify-center gap-1 md:flex-col md:flex-nowrap md:justify-start md:gap-0 md:space-y-1">
                {links.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? ' active' : ''}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
