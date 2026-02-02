import Header from './components/Header'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import CustomerList from './components/CustomerList'
import AddCustomer from './components/AddCustomer'
import Appointments from './components/Appointments'
import Insights from './components/Insights'
import ContentPage from './components/ContentPage'
import Settings from './components/Settings'
import { Route, Routes, Navigate } from 'react-router'
import './App.css'

function App() {

  return (
    <>
    <Header />
    <main className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="customers" replace />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="insights" element={<Insights />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </main>
    </>
  )
}

export default App
