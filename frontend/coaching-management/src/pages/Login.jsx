import React, { useState, useEffect } from 'react';
import { authService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
            else if (user.role === 'instructor') navigate('/instructor/dashboard', { replace: true });
            else if (user.role === 'pendingInstructor' || user.role === 'rejectedInstructor') navigate('/pending-approval', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.login(formData);
            if (response.data.success) {
                login(response.data.user, response.data.token);
                const role = response.data.user.role;
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'instructor') navigate('/instructor/dashboard');
                else navigate('/pending-approval');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#fcfbfa] via-[#faf7ee] to-[#f5eed4]/50 font-sans antialiased text-neutral-800 p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/login-bg.jpg")' }}
        >

            {/* Centered Premium Card Structure */}
            <Card className="w-full max-w-md bg-white rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-6 sm:p-10">

                {/* Header Brand Section */}
                <CardHeader className="text-center p-0 pb-6">
                    {/* //coaching name and logo */}
                    <CardTitle className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl text-center">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-neutral-500 text-base mt-2 text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0 pb-0">
                    {error && (
                        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-500 border border-red-100">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 h-4 w-4 text-neutral-400" />
                                <input
                                    type="email"
                                    name='email'
                                    value={formData.email}
                                    required
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-full border border-neutral-200/60 bg-white pl-11 pr-4 text-[15px] outline-none transition-all focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 shadow-[0_2px_6px_rgba(0,0,0,0.01)] placeholder:text-neutral-400"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-medium text-neutral-400 block">Password</label>
                                <a href="#" className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 h-4 w-4 text-neutral-400" />
                                <input
                                    type="password"
                                    name='password'
                                    value={formData.password}
                                    required
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-full border border-neutral-200/60 bg-white pl-11 pr-4 text-[15px] outline-none transition-all focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 shadow-[0_2px_6px_rgba(0,0,0,0.01)] placeholder:text-neutral-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 border-0 rounded-full text-[15px] font-medium shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:scale-100"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-0 pt-6 pb-0 px-0">
                    <p className="text-sm text-neutral-500 text-center w-full">
                        Don't have an account? <Link to="/register" className="font-medium text-neutral-900 hover:underline underline-offset-4 transition-all">Apply as Instructor</Link>
                    </p>
                </CardFooter>
            </Card>

        </div>
    );
};

export default Login;