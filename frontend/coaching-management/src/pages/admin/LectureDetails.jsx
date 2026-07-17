import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Video, Calendar, Clock, User, ArrowLeft, Edit } from 'lucide-react';

const LectureDetails = () => {
    const { programId, courseId, lectureId } = useParams();
    const navigate = useNavigate();

    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const res = await lectureService.getById(lectureId);
                setLecture(res.data?.data || res.data);
            } catch (error) {
                console.error("Failed to load lecture details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLecture();
    }, [lectureId]);

    if (loading) return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
    if (!lecture) return <div>Lecture not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Lecture Details</h1>
                </div>
            </div>

            <Card className="max-w-3xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Video className="h-5 w-5" />
                            </div>
                            <CardTitle>{lecture.title}</CardTitle>
                        </div>
                        <Badge variant={lecture.status === 'Scheduled' ? 'success' : 'warning'}>
                            {lecture.status || 'Pending'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <Calendar className="h-5 w-5 text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400 font-medium">Date</p>
                                    <p className="font-medium text-neutral-900">
                                        {lecture.date ? new Date(lecture.date).toLocaleDateString() : 'Not set'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-neutral-600">
                                <Clock className="h-5 w-5 text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400 font-medium">Time</p>
                                    <p className="font-medium text-neutral-900">
                                        {lecture.startTime && lecture.endTime 
                                            ? `${lecture.startTime} - ${lecture.endTime}` 
                                            : 'Not set'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <User className="h-5 w-5 text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400 font-medium">Instructor</p>
                                    <p className="font-medium text-neutral-900">
                                        {lecture.instructorId?.userId?.name || lecture.instructorId?.name || 'Unassigned'}
                                    </p>
                                    {lecture.instructorId?.userId?.email && (
                                        <p className="text-xs text-neutral-500">{lecture.instructorId.userId.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex gap-3">
                        <Button 
                            className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                            onClick={() => navigate(`/admin/programs/${programId}/courses/${courseId}/lectures/${lectureId}/edit`)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Lecture
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LectureDetails;
