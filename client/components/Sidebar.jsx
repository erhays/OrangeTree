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
        <aside className="bg-white border-b border-gray-200 md:border-b-0 md:border-r md:w-56 md:shrink-0 md:overflow-y-auto md:px-4 md:py-6 w-full px-3 py-2">
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
