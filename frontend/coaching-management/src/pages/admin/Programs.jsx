import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../services/programService';
import { courseService } from '../../services/courseService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookOpen, Plus, Calendar, MoreHorizontal, ChevronRight } from 'lucide-react';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programsRes, coursesRes] = await Promise.all([
                    programService.getAll(),
                    courseService.getAll().catch(() => ({ data: { data: [] } }))
                ]);

                setPrograms(programsRes.data?.data || programsRes.data || []);
                setCourses(coursesRes.data?.data || []);
            } catch (error) {
                console.error("Failed to load programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCourseCount = (programId) => {
        return courses.filter(c => 
            c.programId === programId || 
            c.programId?._id === programId ||
            c.program?._id === programId
        ).length;
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Programs</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage educational programs and their course structures.</p>
                </div>
                <Button
                    className="gap-2 bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 font-semibold"
                    onClick={() => navigate('/admin/programs/new')}
                >
                    <Plus className="h-4 w-4" />
                    Create Program
                </Button>
            </div>

            {programs.length === 0 ? (
                <Card className="rounded-3xl border border-neutral-200/60">
                    <EmptyState
                        icon={BookOpen}
                        title="No programs yet"
                        description="Get started by creating your first educational program."
                        action={
                            <Button onClick={() => navigate('/admin/programs/new')} className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Program
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2g lg:grid-cols-3 gap-6">
                    {programs.map((program) => {
                        const courseCount = getCourseCount(program._id);
                        const formattedDate = program.createdAt 
                            ? new Date(program.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : '';

                        return (
                            <Card
                                key={program._id}
                                className="flex flex-col rounded-3xl border border-neutral-200/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer"
                                onClick={() => navigate(`/admin/programs/${program._id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-lg">{program.name}</CardTitle>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-neutral-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <CardDescription>
                                        {program.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="flex gap-3">
                                        <div className="px-3 py-1 bg-neutral-50 rounded-md text-xs font-medium flex items-center gap-1.5">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            {courseCount} Courses
                                        </div>
                                        {formattedDate && (
                                            <div className="px-3 py-1 bg-neutral-50 rounded-md text-xs font-medium flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formattedDate}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Programs;