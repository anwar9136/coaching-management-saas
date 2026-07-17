import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructorService } from '../../services/instructorService'; // Note: You might need to add a create method if not present
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, UserPlus } from 'lucide-react';

const CreateInstructor = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        experience: '',
        specialization: 'General'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await instructorService.create(formData);
            navigate('/admin/instructors');

        } catch (err) {
            setError(err.response?.data?.message || "Failed to create instructor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/instructors')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">Add New Instructor</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <CardTitle>Create Instructor Account</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Experience (years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Instructor Account"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateInstructor;