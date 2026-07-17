import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { instructorService } from '../../services/instructorService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Video, ArrowLeft, Clock, Calendar, User } from 'lucide-react';

const LectureForm = () => {
    const { programId, courseId, lectureId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!lectureId;

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        instructorId: ''
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [instructors, setInstructors] = useState([]);

    // Fetch lecture data when editing
    useEffect(() => {
        if (isEdit && lectureId) {
            const fetchLecture = async () => {
                try {
                    const res = await lectureService.getById(lectureId);
                    const lecture = res.data?.data || res.data;
                    if (lecture) {
                        setFormData({
                            title: lecture.title || '',
                            date: lecture.date ? lecture.date.split('T')[0] : '',
                            startTime: lecture.startTime || '',
                            endTime: lecture.endTime || '',
                            instructorId: lecture.instructorId?._id || ''
                        });
                    }
                } catch (err) {
                    setError("Failed to load lecture data.");
                }
            };

            const fetchInstructors = async () => {
                try {
                    const res = await instructorService.getAll();
                    setInstructors(res.data?.data || []);
                } catch (err) {
                    console.error("Failed to load instructors", err);
                }
            };

            Promise.all([
                isEdit && lectureId ? fetchLecture() : Promise.resolve(),
                fetchInstructors()
            ]).finally(() => {
                setInitialLoading(false);
            });
        } else {
            const fetchInstructors = async () => {
                try {
                    const res = await instructorService.getAll();
                    setInstructors(res.data?.data || []);
                } catch (err) {
                    console.error("Failed to load instructors", err);
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchInstructors();
        }
    }, [lectureId, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent past dates and times
        if (formData.date) {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                setError("Cannot create a lecture on a past date.");
                return;
            }

            if (selectedDate.getTime() === today.getTime() && formData.startTime) {
                const [hours, minutes] = formData.startTime.split(':');
                const selectedTime = new Date();
                selectedTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                if (selectedTime < new Date()) {
                    setError("Cannot create a lecture with a start time in the past.");
                    return;
                }
            }
        }

        setLoading(true);
        setError('');

        try {
            let response;
            if (isEdit) {
                response = await lectureService.update(lectureId, formData);
            } else {
                response = await lectureService.create({ ...formData, courseId });
            }

            if (response.data?.success) {
                navigate(`/admin/programs/${programId}/courses/${courseId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 
                    (isEdit ? "Failed to update lecture" : "Failed to create lecture"));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {isEdit ? 'Edit Lecture' : 'Create New Lecture'}
                </h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Video className="h-5 w-5" />
                        </div>
                        <CardTitle>Lecture Details</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Lecture Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                placeholder="Introduction to React Hooks"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-neutral-400 block mb-1">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="w-full h-12 border border-neutral-200 rounded-2xl px-4"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-neutral-400 block mb-1">Instructor (Optional)</label>
                            <select
                                name="instructorId"
                                value={formData.instructorId}
                                onChange={handleChange}
                                className="w-full h-12 border border-neutral-200 rounded-2xl px-4 bg-white"
                            >
                                <option value="">No Instructor</option>
                                {instructors.map(inst => (
                                    <option key={inst._id} value={inst._id}>
                                        {inst.userId?.name || 'Instructor'} ({inst.userId?.email || 'No email'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}`)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900" disabled={loading}>
                                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Lecture" : "Create Lecture")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LectureForm;