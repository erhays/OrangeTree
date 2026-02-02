import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function Dashboard() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
