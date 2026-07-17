import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructorService } from '../../services/instructorService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Users, Plus, Award, BookOpen } from 'lucide-react';

const Instructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const res = await instructorService.getAll();
                setInstructors(res.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Instructors</h1>
                    <p className="text-neutral-500 mt-1">Manage your teaching team</p>
                </div>
                <Button onClick={() => navigate('/admin/instructors/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Instructor
                </Button>
            </div>

            {instructors.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Users}
                        title="No instructors yet"
                        description="Approve pending applications to build your team."
                        action={
                            <Button onClick={() => navigate('/admin/instructors/new')}>
                                Add First Instructor
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map((inst) => (
                        <Card 
                            key={inst._id}
                            className="hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => navigate(`/admin/instructors/${inst._id}`)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl font-semibold">
                                        {inst.userId?.name?.charAt(0) || 'I'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="truncate">{inst.userId?.name}</CardTitle>
                                        <p className="text-sm text-neutral-500 truncate">{inst.userId?.email}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Award className="h-4 w-4 text-amber-500" />
                                        <span>{inst.experience || 0} yrs exp</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{inst.lectureCount || 0} lectures</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Instructors;