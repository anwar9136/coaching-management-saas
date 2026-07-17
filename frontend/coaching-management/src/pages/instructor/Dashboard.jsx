import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { useDateTime } from '../../hooks/useDateTime';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar, Clock, Video, User, ChevronRight, Activity, ArrowRight, CheckCircle } from 'lucide-react';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getGreeting, formatDate } = useDateTime();
    
    const [myLectures, setMyLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyLectures = async () => {
            try {
                const response = await lectureService.getMyLectures();
                setMyLectures(response.data?.data || []);
            } catch (error) {
                console.error("Failed to load lectures", error);
                setError("Failed to load your schedule. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyLectures();
    }, []);

    // Filter today's lectures
    const todayLectures = useMemo(() => {
        const today = new Date().toDateString();
        return myLectures.filter(l => l.date && new Date(l.date).toDateString() === today);
    }, [myLectures]);

    // Upcoming lectures (future)
    const upcomingLectures = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Include all today's and future
        return myLectures.filter(l => l.date && new Date(l.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [myLectures]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Instructor'}
                    </h1>
                    <p className="text-sm text-neutral-500">
                        {formatDate()}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50/60 border border-emerald-200/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-emerald-800">{todayLectures.length} Lectures Today</span>
                    </div>
                </div>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Schedule) */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card className="rounded-3xl border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Today's Schedule</CardTitle>
                                        <p className="text-xs text-neutral-500 mt-1">Your classes for today</p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-neutral-500"
                                        onClick={() => navigate('/instructor/my-lectures')}
                                    >
                                        View All
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {todayLectures.length > 0 ? (
                                    <div className="divide-y divide-neutral-100">
                                        {todayLectures.map((lecture) => (
                                            <div key={lecture._id} className="p-6 flex items-start gap-5 hover:bg-neutral-50/50 transition-colors">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-sm font-semibold text-neutral-900">{lecture.startTime}</div>
                                                    <div className="h-8 w-px bg-neutral-200 my-1"></div>
                                                    <div className="text-sm font-semibold text-neutral-500">{lecture.endTime}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <h3 className="text-base font-semibold text-neutral-900">{lecture.title}</h3>
                                                        <Badge variant="success">Scheduled</Badge>
                                                    </div>
                                                    <p className="text-sm text-neutral-600 mb-3">
                                                        {lecture.courseId?.name || 'Unknown Course'} 
                                                        {lecture.courseId?.level && ` • ${lecture.courseId.level}`}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 h-8 px-4 text-xs rounded-full">
                                                            Join Class
                                                        </Button>
                                                        <Button size="sm" variant="secondary" className="h-8 px-4 text-xs rounded-full">
                                                            Materials
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8">
                                        <EmptyState
                                            icon={Calendar}
                                            title="No Classes Today"
                                            description="You have a free day today. Enjoy your time!"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column (Overview) */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Card className="rounded-3xl border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                            <CardHeader>
                                <CardTitle className="text-lg">Upcoming Next</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcomingLectures.length > todayLectures.length ? (
                                    <div className="space-y-4">
                                        {upcomingLectures.filter(l => !todayLectures.find(t => t._id === l._id)).slice(0, 3).map(lecture => (
                                            <div key={lecture._id} className="flex gap-4 p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <Video className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">{lecture.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {new Date(lecture.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {lecture.startTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button 
                                            variant="ghost" 
                                            className="w-full text-sm font-medium text-neutral-600 mt-2"
                                            onClick={() => navigate('/instructor/my-lectures')}
                                        >
                                            View Full Schedule <ArrowRight className="h-4 w-4 ml-1.5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={Activity}
                                        title="No Upcoming Classes"
                                        description="You don't have any upcoming classes scheduled."
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card className="rounded-3xl border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-neutral-900 text-white overflow-hidden relative">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Video className="w-32 h-32" />
                            </div>
                            <CardContent className="p-7 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">Total Assigned Lectures</h3>
                                <div className="text-4xl font-bold text-[#ffdb5c] mb-6">{myLectures.length}</div>
                                
                                <p className="text-sm text-neutral-400 mb-6">
                                    Keep up the great work! Your contribution helps shape the future of our students.
                                </p>

                                <Button 
                                    className="w-full bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 font-medium border-0 rounded-xl"
                                    onClick={() => navigate('/instructor/my-lectures')}
                                >
                                    Manage Lectures
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
