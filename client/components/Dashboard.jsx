import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function Dashboard() {
    return (
        <div className="flex flex-col md:flex-row h-full">
            <Sidebar />
            <div className="flex-1 min-h-0 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
