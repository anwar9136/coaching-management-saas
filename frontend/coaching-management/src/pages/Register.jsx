import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GraduationCap, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'instructor',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.register(formData);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fcfbfa] font-sans antialiased text-neutral-800 p-3 lg:p-4 gap-4">

            {/* Left Section: Clean Warm Premium Form Panel */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 bg-gradient-to-br from-neutral-50 via-neutral-50/80 to-[#f6f2e2]/40 rounded-[2.5rem]">
                <Card className="w-full max-w-md mx-auto border-0 shadow-none bg-transparent">
                    <CardHeader className="text-left px-0 pt-0 pb-8">

                        <CardTitle className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
                            Apply as Instructor
                        </CardTitle>
                        <CardDescription className="text-neutral-500 text-base mt-2">
                            Join our platform to manage and deliver your lectures
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0 pb-0">
                        {error && (
                            <div className="mb-6 flex gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-500 text-sm">
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success ? (
                            <div className="py-10 flex flex-col items-center text-center">
                                <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
                                <h4 className="text-xl font-semibold text-green-600">Application Submitted!</h4>
                                <p className="text-neutral-400 mt-2 text-sm">Redirecting to login...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-400 block ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 bg-white/90 border border-neutral-200/60 rounded-full pl-11 pr-4 text-neutral-900 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-400 block ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 bg-white/90 border border-neutral-200/60 rounded-full pl-11 pr-4 text-neutral-900 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-400 block ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="w-full h-12 bg-white/90 border border-neutral-200/60 rounded-full pl-11 pr-4 text-neutral-900 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
                                            placeholder="Min. 6 characters"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 border-0 rounded-full text-[15px] font-medium shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:scale-100"
                                    >
                                        {loading ? "Submitting..." : "Submit Application"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>

                    {!success && (
                        <CardFooter className="px-0 pt-8 pb-0 border-0">
                            <p className="text-sm text-neutral-500 text-center lg:text-left w-full">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-neutral-900 hover:underline underline-offset-4 transition-all">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Right Section: Structured Container matching the Rounded Canvas layout of image_24059b.jpg */}
            <div className="hidden lg:flex w-[55%] bg-neutral-900 relative items-center justify-center overflow-hidden rounded-[2.5rem]">

                
                  {/* ========================================================================
                  RESERVED SPACE FOR YOUR IMAGE COMPONENT
                  ========================================================================
                  The container wrapper above features highly rounded corners matching image_24059b.jpg.
                  Drop your premium SaaS asset directly inside here when you are ready.
                  
                  Example: */}
                  <img 
                      src="/register-bg.jpg" 
                      alt="Workspace Analytics Platform" 
                      className="w-full h-full object-cover"
                  />
               

            </div>

        </div>
    );
};

export default Register;