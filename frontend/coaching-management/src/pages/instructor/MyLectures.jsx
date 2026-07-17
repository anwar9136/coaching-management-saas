import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Video, Calendar, Clock, BookOpen, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const MyLectures = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, upcoming, past
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await lectureService.getMyLectures();
                setLectures(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch lectures:", err);
                setError("Failed to load your lectures. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

    const filteredLectures = lectures.filter(lecture => {
        if (!lecture.date) return false;
        const lectureDate = new Date(lecture.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === 'upcoming') return lectureDate >= today;
        if (filter === 'past') return lectureDate < today;
        return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">My Schedule</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage and view all your assigned lectures.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-neutral-200/60 shadow-sm">
                    {['all', 'upcoming', 'past'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                                filter === f 
                                    ? 'bg-neutral-900 text-white' 
                                    : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
                    {error}
                </div>
            )}

            {!error && filteredLectures.length === 0 ? (
                <Card className="rounded-3xl border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] py-12">
                    <EmptyState
                        icon={Calendar}
                        title={`No ${filter !== 'all' ? filter : ''} classes found`}
                        description="You don't have any classes matching this filter."
                        action={
                            filter !== 'all' && (
                                <Button 
                                    onClick={() => setFilter('all')} 
                                    variant="outline" 
                                    className="mt-4 rounded-xl"
                                >
                                    View All Classes
                                </Button>
                            )
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLectures.map((lecture, index) => (
                        <motion.div
                            key={lecture._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="h-full flex flex-col rounded-3xl border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant={
                                            new Date(lecture.date) < new Date() ? 'secondary' : 'success'
                                        }>
                                            {new Date(lecture.date) < new Date() ? 'Completed' : 'Scheduled'}
                                        </Badge>
                                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                            <Video className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 leading-tight">
                                        {lecture.title}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-1 flex flex-col pt-0">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2.5 text-sm text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                                            <BookOpen className="h-4 w-4 text-neutral-400 shrink-0" />
                                            <span className="truncate">{lecture.courseId?.name || 'Unknown Course'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2.5 text-sm text-neutral-600">
                                            <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                                            <span>{new Date(lecture.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2.5 text-sm text-neutral-600">
                                            <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                                            <span>{lecture.startTime} - {lecture.endTime}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-neutral-100 flex gap-2">
                                        <Button 
                                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-10"
                                            disabled={new Date(lecture.date) < new Date()}
                                        >
                                            {new Date(lecture.date) < new Date() ? 'Ended' : 'Join Class'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLectures;