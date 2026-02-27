import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import axios from 'axios';

export default function ProtectedRoute() {
    const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'unauth'

    useEffect(() => {
        axios.get('/api/me')
            .then(() => setStatus('ok'))
            .catch(() => setStatus('unauth'));
    }, []);

    if (status === 'loading') return null;
    if (status === 'unauth') return <Navigate to="/login" replace />;
    return <Outlet />;
}
