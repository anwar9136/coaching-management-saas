import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { lectureService } from '../../services/lectureService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Video, Plus, Calendar, Clock, User, Edit, Trash2, ArrowLeft } from 'lucide-react';

const CourseDetails = () => {
    const { programId, courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [courseRes, lecturesRes] = await Promise.all([
                courseService.getById(courseId),
                lectureService.getAll()
            ]);

            setCourse(courseRes.data?.data || courseRes.data);

            const allLectures = lecturesRes.data?.data || [];
            const courseLectures = allLectures.filter(l => 
                l.courseId === courseId || l.courseId?._id === courseId
            );
            setLectures(courseLectures);
        } catch (error) {
            console.error("Error fetching course details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) fetchData();
    }, [courseId]);

    const handleDelete = async () => {
        try {
            await lectureService.delete(deleteModal.id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete lecture");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
    }

    if (!course) return <div>Course not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/programs/${programId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{course.name}</h1>
                    <p className="text-sm text-neutral-500">{course.level} • {lectures.length} Lectures</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Lectures</h2>
                <Button 
                    onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}/lectures/new`)}
                    className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lecture
                </Button>
            </div>

            {lectures.length === 0 ? (
                <Card className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50">
                    <EmptyState
                        icon={Video}
                        title="No lectures yet"
                        description="Create your first lecture for this course."
                        action={
                            <Button 
                                onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}/lectures/new`)}
                                className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add First Lecture
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <div className="space-y-4">
                    {lectures.sort((a, b) => new Date(a.date) - new Date(b.date)).map(lecture => (
                        <Card key={lecture._id} className="rounded-3xl">
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">{lecture.title}</h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-neutral-500">
                                        {lecture.date && (
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(lecture.date).toLocaleDateString()}
                                            </span>
                                        )}
                                        {lecture.startTime && lecture.endTime && (
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {lecture.startTime} - {lecture.endTime}
                                            </span>
                                        )}
                                        {lecture.instructorId && (
                                            <span className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {lecture.instructorId.userId?.name || lecture.instructorId.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}/lectures/${lecture._id}/edit`)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="hover:text-red-600"
                                        onClick={() => setDeleteModal({ isOpen: true, id: lecture._id })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                title="Delete Lecture"
            >
                <p className="text-sm text-neutral-600 mb-6">Are you sure you want to delete this lecture? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, id: null })}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete Lecture
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default CourseDetails;