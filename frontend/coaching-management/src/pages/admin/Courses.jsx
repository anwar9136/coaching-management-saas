import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { lectureService } from '../../services/lectureService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText, Plus, Video, MoreHorizontal, ChevronRight, Calendar } from 'lucide-react';

const Courses = () => {
    const { programId } = useParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, lecturesRes] = await Promise.all([
                    courseService.getAll(),
                    lectureService.getAll().catch(() => ({ data: { data: [] } }))
                ]);

                // Filter courses belonging to this program
                const allCourses = coursesRes.data?.data || coursesRes.data || [];
                const programCourses = allCourses.filter(course => 
                    course.programId === programId || 
                    course.programId?._id === programId ||
                    course.program?._id === programId
                );

                setCourses(programCourses);
                setLectures(lecturesRes.data?.data || []);
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setLoading(false);
            }
        };

        if (programId) fetchData();
    }, [programId]);

    const getLectureCount = (courseId) => {
        return lectures.filter(l => 
            l.courseId === courseId || l.courseId?._id === courseId
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
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Courses</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage courses for this program.</p>
                </div>
                <Button
                    className="gap-2 bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 font-semibold"
                    onClick={() => navigate(`/admin/programs/${programId}/courses/new`)}
                >
                    <Plus className="h-4 w-4" />
                    Add New Course
                </Button>
            </div>

            {courses.length === 0 ? (
                <Card className="rounded-3xl border border-neutral-200/60">
                    <EmptyState
                        icon={FileText}
                        title="No courses yet"
                        description="Create your first course for this program."
                        action={
                            <Button 
                                onClick={() => navigate(`/admin/programs/${programId}/courses/new`)}
                                className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Course
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const lectureCount = getLectureCount(course._id);
                        const formattedDate = course.createdAt 
                            ? new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
                            : '';

                        return (
                            <Card
                                key={course._id}
                                className="flex flex-col rounded-3xl border border-neutral-200/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer"
                                onClick={() => navigate(`/admin/programs/${programId}/courses/${course._id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{course.name}</CardTitle>
                                                {course.level && (
                                                    <p className="text-xs text-neutral-500 mt-0.5">{course.level}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-neutral-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <CardDescription className="mt-3 line-clamp-2">
                                        {course.description || "No description added yet."}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0 mt-auto">
                                    <div className="flex gap-3">
                                        <div className="px-3 py-1 bg-neutral-50 rounded-md text-xs font-medium flex items-center gap-1.5 border border-neutral-200/60">
                                            <Video className="h-3.5 w-3.5" />
                                            {lectureCount} Lectures
                                        </div>
                                        {formattedDate && (
                                            <div className="px-3 py-1 bg-neutral-50 rounded-md text-xs font-medium flex items-center gap-1.5 border border-neutral-200/60">
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

export default Courses;