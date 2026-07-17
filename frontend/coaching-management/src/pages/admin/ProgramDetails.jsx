import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programService } from '../../services/programService';
import { courseService } from '../../services/courseService';
import { lectureService } from '../../services/lectureService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Accordion } from '../../components/ui/Accordion';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookOpen, Plus, FileText, Video, Edit, Trash2, Calendar, Clock, User, ArrowLeft } from 'lucide-react';

const ProgramDetails = () => {
    const { programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [courses, setCourses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [progRes, coursesRes, lectRes] = await Promise.all([
                programService.getById(programId),
                courseService.getAll().catch(() => ({ data: { data: [] } })),
                lectureService.getAll().catch(() => ({ data: { data: [] } }))
            ]);

            setProgram(progRes.data?.data || progRes.data);

            const allCourses = coursesRes.data?.data || [];
            const programCourses = allCourses.filter(c => 
                c.programId === programId || 
                c.programId?._id === programId ||
                c.program?._id === programId
            );
            setCourses(programCourses);

            setLectures(lectRes.data?.data || []);
        } catch (error) {
            console.error("Error fetching program details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (programId) fetchData();
    }, [programId]);

    const handleDeleteConfirm = async () => {
        const { type, id: targetId } = deleteModal;
        try {
            if (type === 'program') {
                await programService.delete(targetId);
                navigate('/admin/programs');
            } else if (type === 'course') {
                await courseService.delete(targetId);
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || `Failed to delete ${type}`);
        } finally {
            setDeleteModal({ isOpen: false, type: null, id: null });
        }
    };

    if (loading) return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
    if (!program) return <div>Program not found</div>;

    const accordionItems = courses.map(course => {
        const courseLectures = lectures.filter(l => l.courseId === course._id || l.courseId?._id === course._id);

        return {
            title: (
                <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-medium text-neutral-900">{course.name}</p>
                            <p className="text-xs text-neutral-500">{courseLectures.length} Lectures</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/admin/programs/${programId}/courses/${course._id}/edit`)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:text-red-600"
                            onClick={() => setDeleteModal({ isOpen: true, type: 'course', id: course._id })}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ),
            content: (
                <div className="pt-4 flex flex-col items-start gap-4">
                    <p className="text-sm text-neutral-600">{course.description || 'No description.'}</p>
                    <Button 
                        onClick={() => navigate(`/admin/programs/${programId}/courses/${course._id}`)}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white"
                        size="sm"
                    >
                        Manage Lectures
                    </Button>
                </div>
            )
        };
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/programs')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{program.name}</h1>
            </div>

            {/* Program Info */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/60 flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{program.name}</h2>
                        <p className="text-neutral-600 mt-2 max-w-2xl">{program.description || 'No description available.'}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button onClick={() => navigate(`/admin/programs/${programId}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Program
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteModal({ isOpen: true, type: 'program', id: program._id })}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            {/* Courses Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Courses in this Program</h2>
                <Button 
                    onClick={() => navigate(`/admin/programs/${programId}/courses/new`)}
                    className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
            </div>

            {courses.length > 0 ? (
                <Accordion items={accordionItems} />
            ) : (
                <Card className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50">
                    <EmptyState
                        icon={FileText}
                        title="No courses yet"
                        description="Start building this program by adding courses."
                        action={
                            <Button 
                                onClick={() => navigate(`/admin/programs/${programId}/courses/new`)}
                                className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add First Course
                            </Button>
                        }
                    />
                </Card>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: null, id: null })}
                title={`Delete ${deleteModal.type}`}
            >
                <p className="text-sm text-neutral-600 mb-6">
                    Are you sure? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default ProgramDetails;