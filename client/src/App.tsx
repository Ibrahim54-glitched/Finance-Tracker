import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}
