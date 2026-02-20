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
        <aside className="w-56 min-h-screen bg-slate-800 px-4 py-6">
            <nav className="flex flex-col space-y-1">
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
