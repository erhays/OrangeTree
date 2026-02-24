import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function Dashboard() {
    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
