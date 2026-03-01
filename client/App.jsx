import Header from './components/Header'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CustomerList from './components/CustomerList'
import AddCustomer from './components/AddCustomer'
import CustomerDetail from './components/CustomerDetail'
import EditCustomer from './components/EditCustomer'
import Appointments from './components/Appointments'
import AddAppointment from './components/AddAppointment'
import AppointmentDetail from './components/AppointmentDetail'
import EditAppointment from './components/EditAppointment'
import BookAppointment from './components/BookAppointment'
import Insights from './components/Insights'
import ContentPage from './components/ContentPage'
import Settings from './components/Settings'
import ChangePassword from './components/ChangePassword'
import { Route, Routes, Navigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {

  return (
    <>
    <Header />
    <main className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="customers" replace />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/:id/edit" element={<EditCustomer />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/add" element={<AddAppointment />} />
          <Route path="appointments/:id" element={<AppointmentDetail />} />
          <Route path="appointments/:id/edit" element={<EditAppointment />} />
          <Route path="insights" element={<Insights />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
        </Route>
        </Route>
      </Routes>
    </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default App
