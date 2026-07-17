import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instructorService } from '../../services/instructorService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar, Clock, User, Award, ArrowLeft, Edit } from 'lucide-react';

const InstructorDetails = () => {
    const { instructorId } = useParams();
    const navigate = useNavigate();

    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const res = await instructorService.getDetails(instructorId);
                setInstructorData(res.data?.data || res.data);
            } catch (error) {
                console.error("Failed to fetch instructor details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [instructorId]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    if (!instructorData) {
        return <div>Instructor not found</div>;
    }

    const { instructor, lectureCount, lectures } = instructorData;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/instructors')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{instructor.userId?.name}</h1>
                    <p className="text-neutral-500">{instructor.userId?.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructor Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center py-4">
                                <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center text-4xl font-semibold text-neutral-600">
                                    {instructor.userId?.name?.charAt(0)}
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Experience</span>
                                    <span className="font-medium">{instructor.experience || 0} years</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Specialization</span>
                                    <span className="font-medium">{instructor.specialization || 'General'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Total Lectures</span>
                                    <span className="font-medium">{lectureCount}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button 
                        onClick={() => navigate(`/admin/instructors/${instructorId}/edit`)}
                        className="w-full"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>

                {/* Lectures Assigned */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Lectures ({lectureCount})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lectures && lectures.length > 0 ? (
                                <div className="space-y-4">
                                    {lectures.map(lecture => (
                                        <div key={lecture._id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-2xl hover:bg-neutral-50">
                                            <div>
                                                <p className="font-medium">{lecture.title}</p>
                                                <div className="text-xs text-neutral-500 mt-1 flex items-center gap-4">
                                                    <span>{new Date(lecture.date).toLocaleDateString()}</span>
                                                    {lecture.startTime && <span>{lecture.startTime} - {lecture.endTime}</span>}
                                                </div>
                                            </div>
                                            <Badge variant={lecture.status === 'Scheduled' ? "success" : "warning"}>
                                                {lecture.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Calendar}
                                    title="No lectures assigned yet"
                                    description="This instructor hasn't been assigned any lectures."
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InstructorDetails;