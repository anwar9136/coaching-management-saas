import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { instructorService } from '../../services/instructorService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const EditInstructor = () => {
    const { instructorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        experience: '',
        specialization: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    // Determine which ID to use
    const isOwnProfile = user?.role === 'instructor';
    const effectiveId = isOwnProfile ? user.instructorId || instructorId : instructorId;

    useEffect(() => {
        const fetchInstructor = async () => {
            if (!effectiveId) {
                setInitialLoading(false);
                return;
            }

            try {
                const res = await instructorService.getDetails(effectiveId);
                const data = res.data?.data?.instructor || res.data?.data;

                if (data) {
                    setFormData({
                        experience: data.experience || '',
                        specialization: data.specialization || ''
                    });
                }
            } catch (err) {
                setError("Failed to load profile data");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInstructor();
    }, [effectiveId]);

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
            await instructorService.update(effectiveId, formData);

            // Smart redirect
            if (isOwnProfile) {
                navigate('/instructor/dashboard');
            } else {
                navigate(`/admin/instructors/${effectiveId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex h-[60vh] items-center justify-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => isOwnProfile 
                        ? navigate('/instructor/dashboard') 
                        : navigate(`/admin/instructors/${effectiveId}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {isOwnProfile ? "Update My Profile" : "Edit Instructor Profile"}
                </h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Experience (in years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                placeholder="5"
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
                                placeholder="e.g., Web Development"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="button" 
                                variant="secondary"
                                onClick={() => isOwnProfile 
                                    ? navigate('/instructor/dashboard') 
                                    : navigate(`/admin/instructors/${effectiveId}`)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditInstructor;