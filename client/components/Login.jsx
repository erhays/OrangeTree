import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/api/login', form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">OrangeTree Detailing</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoFocus
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
