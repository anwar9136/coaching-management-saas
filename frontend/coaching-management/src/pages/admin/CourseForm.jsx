import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, ArrowLeft } from 'lucide-react';

const CourseForm = () => {
    const { programId, courseId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!courseId;

    const [formData, setFormData] = useState({
        name: '',
        level: 'Beginner',
        description: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [error, setError] = useState('');

    // Fetch course when editing
    useEffect(() => {
        if (isEdit && courseId) {
            const fetchCourse = async () => {
                try {
                    const res = await courseService.getById(courseId);
                    const course = res.data?.data || res.data;
                    if (course) {
                        setFormData({
                            name: course.name || '',
                            level: course.level || 'Beginner',
                            description: course.description || '',
                            image: course.image || ''
                        });
                    }
                } catch (err) {
                    setError("Failed to load course data.");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchCourse();
        } else {
            setInitialLoading(false);
        }
    }, [courseId, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isEdit) {
                response = await courseService.update(courseId, formData);
            } else {
                response = await courseService.create({ ...formData, programId });
            }

            if (response.data?.success) {
                navigate(`/admin/programs/${programId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 
                    (isEdit ? "Failed to update course" : "Failed to create course"));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/programs/${programId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEdit ? 'Edit Course' : 'Create New Course'}
                    </h1>
                </div>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <CardTitle>Course Details</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Course Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4 focus:outline-none focus:border-neutral-400"
                                placeholder="Course Name"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Level</label>
                            <select name="level" value={formData.level} onChange={handleChange} className="w-full h-12 border border-neutral-200 rounded-2xl px-4">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full border border-neutral-200 rounded-2xl px-4 py-3 resize-y"
                                placeholder="Course description..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Image URL (optional)</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate(`/admin/programs/${programId}`)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900" disabled={loading}>
                                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Course" : "Create Course")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseForm;