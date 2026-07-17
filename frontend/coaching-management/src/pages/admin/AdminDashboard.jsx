import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { instructorService } from '../../services/instructorService';
import { lectureService } from '../../services/lectureService';
import { programService } from '../../services/programService';
import { useCountUp } from '../../hooks/useCountUp';
import { useDateTime } from '../../hooks/useDateTime';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Video,
  Calendar,
  UserPlus,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  ChevronRight,
  Activity,
  FolderTree,
  XCircle,
  ArrowRight
} from 'lucide-react';

// Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-neutral-200/60 via-neutral-100 to-neutral-200/60 bg-[length:200%_100%] ${className}`} />
);

// KPI Card
const KPICard = ({ title, value, subtitle, icon: Icon, delay, iconBgClass, iconColorClass }) => {
  const count = useCountUp(value);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-3xl border border-neutral-200/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-neutral-400 mb-1.5">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight text-neutral-900 mb-1.5">{count}</h3>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${iconBgClass || "bg-neutral-50"} ${iconColorClass || "text-neutral-700"}`}>
          <Icon className="h-5.5 w-5.5" />
        </div>
      </div>
    </motion.div>
  );
};

// Quick Action
const QuickAction = ({ title, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3.5 w-full px-5 py-4 rounded-2xl bg-white border border-neutral-200/60 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition-all duration-200 shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
  >
    <Icon className="h-5 w-5 text-neutral-600" />
    <span className="flex-1 text-left font-medium">{title}</span>
    <ChevronRight className="h-4 w-4 text-neutral-400" />
  </button>
);

// Timeline Item
const TimelineItem = ({ lecture }) => {
  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-neutral-100 last:border-0">
      <div className="flex flex-col items-center mt-0.5">
        <div className="h-9 w-9 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-800 text-xs font-semibold border border-neutral-200/60">
          {new Date(lecture.date).getDate()}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-neutral-900">{lecture.title}</h4>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="h-4 w-4" />
            {lecture.startTime} - {lecture.endTime}
          </div>
        </div>
        {lecture.courseId && (
          <p className="text-xs text-neutral-500">
            {typeof lecture.courseId === 'object' ? lecture.courseId.name : 'Course'}
            {lecture.instructorId && typeof lecture.instructorId === 'object' && lecture.instructorId.userId && (
              <> • {lecture.instructorId.userId.name}</>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

// Pending Application Item
const PendingApplicationItem = ({ app, onApprove, onReject, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-start gap-4 py-3.5 border-b border-neutral-100 last:border-0"
  >
    <div className="h-11 w-11 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-800 font-semibold text-base border border-neutral-200/60">
      {app.name?.charAt(0).toUpperCase() || "?"}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-neutral-900 truncate">{app.name || "Anonymous"}</h4>
      <p className="text-xs text-neutral-400 truncate">{app.email}</p>
    </div>
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => onApprove(app._id)}
        className="h-10 px-4 rounded-full bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 text-sm font-medium transition-all duration-200"
      >
        Approve
      </button>
      <button
        onClick={() => onReject(app._id)}
        className="h-10 px-4 rounded-full bg-white border border-neutral-300 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-all duration-200"
      >
        Reject
      </button>
    </div>
  </motion.div>
);

// Compact Program Hierarchy Item
const HierarchyItem = ({ program, courses, lectures }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="py-3 border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-50 text-neutral-700 border border-neutral-200/60">
            <FolderTree className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-900">{program.name}</h4>
            <p className="text-xs text-neutral-500">{courses.length} courses</p>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="ml-12 mt-3.5 space-y-2.5">
          {courses.map(course => (
            <div key={course._id} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <div className="flex-1">
                <p className="text-sm text-neutral-900">{course.name}</p>
                <p className="text-xs text-neutral-500">
                  {lectures.filter(l => l.courseId && (l.courseId._id === course._id || l.courseId === course._id)).length} lectures
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Top Instructors Item
const InstructorWorkloadItem = ({ instructor }) => {
  const count = instructor.lectureCount || 0;
  const name = instructor.userId?.name || "Instructor";
  
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-neutral-100 last:border-0">
      <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 font-semibold text-sm border border-neutral-200/60">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-sm text-neutral-900 font-medium">{name}</p>
          <p className="text-xs text-neutral-500">{count} lectures</p>
        </div>
        <div className="h-2.5 bg-neutral-200/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#ffd338] rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((count / 30) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Empty State
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-5 rounded-3xl bg-amber-50/50 mb-4 border border-amber-100/70">
      <Icon className="h-8 w-8 text-amber-400/70" />
    </div>
    <h4 className="text-sm font-medium text-neutral-900 mb-1.5">{title}</h4>
    <p className="text-xs text-neutral-500">{description}</p>
  </div>
);

// Section Header
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-base font-semibold tracking-tight text-neutral-900">{title}</h2>
      {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
    </div>
    {action && action}
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getGreeting, formatDate, formatTime, getTimeAgo } = useDateTime();
  
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalLectures: 0,    
    upcomingLectures: 0,
    pendingInstructors: 0
  });
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Today's lectures
  const todayLectures = useMemo(() => {
    const today = new Date().toDateString();
    return lectures
      .filter(l => l.date && new Date(l.date).toDateString() === today)
      .slice(0, 5);
  }, [lectures]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities = [];
    
    pendingApplications.forEach(app => {
      activities.push({
        id: `pending-${app._id}`,
        type: "application",
        subject: app.name || "New instructor",
        action: "applied for instructor position",
        time: app.createdAt ? getTimeAgo(app.createdAt) : "Recently",
        icon: UserPlus
      });
    });

    todayLectures.forEach(lecture => {
      activities.push({
        id: `lecture-${lecture._id}`,
        type: "lecture",
        subject: lecture.title || "Lecture",
        action: "scheduled",
        time: lecture.date ? `Today at ${lecture.startTime || "TBD"}` : "Scheduled",
        icon: Calendar
      });
    });

    return activities.slice(0, 4);
  }, [pendingApplications, todayLectures, getTimeAgo]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [programsRes, coursesRes, instructorsRes, lecturesRes, pendingRes] = await Promise.all([
          programService.getAll().catch(() => ({ data: { data: [] } })),
          courseService.getAll().catch(() => ({ data: { data: [] } })),
          instructorService.getAll().catch(() => ({ data: { data: [] } })),
          lectureService.getAll().catch(() => ({ data: { data: [] } })),
          instructorService.getPending().catch(() => ({ data: { data: [] } }))
        ]);

        const p = programsRes?.data?.data || programsRes?.data || [];
        const c = coursesRes?.data?.data || coursesRes?.data || [];
        const i = instructorsRes?.data?.data || instructorsRes?.data || [];
        const l = lecturesRes?.data?.data || lecturesRes?.data || [];
        const pending = pendingRes?.data?.data || pendingRes?.data || [];

        setPrograms(p);
        setCourses(c);
        setInstructors(i);
        setLectures(l);
        setPendingApplications(pending);

        const now = new Date();
        const validLectures = l.filter(lect => lect && lect.date);
        const upcomingCount = validLectures.filter(lect => new Date(lect.date) > now).length;

        setStats({
          totalPrograms: p.length,
          totalCourses: c.length,
          totalInstructors: i.length,
          totalLectures: l.length,
          upcomingLectures: upcomingCount,
          pendingInstructors: pending.length
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await instructorService.approve(userId);
      const pendingRes = await instructorService.getPending();
      const instructorsRes = await instructorService.getAll();
      setPendingApplications(pendingRes.data.data || []);
      setInstructors(instructorsRes.data.data || []);
      setStats(s => ({ ...s, pendingInstructors: s.pendingInstructors - 1, totalInstructors: s.totalInstructors + 1 }));
    } catch (err) {
      console.error("Error approving instructor:", err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await instructorService.reject(userId);
      const pendingRes = await instructorService.getPending();
      setPendingApplications(pendingRes.data.data || []);
      setStats(s => ({ ...s, pendingInstructors: s.pendingInstructors - 1 }));
    } catch (err) {
      console.error("Error rejecting instructor:", err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-6">
        {/* Main 9 cols */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="space-y-2.5">
            <Skeleton className="h-9 w-80 rounded-2xl" />
            <Skeleton className="h-5 w-96 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
        {/* Right 3 cols */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Content (9 cols) */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-normal tracking-tight text-neutral-900 mb-1.5">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}
            </h1>
            <p className="text-base text-neutral-500">
              Here's what's happening in your coaching institute today
            </p>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-50/50 border border-green-200/50">
              <CheckCircle className="h-4.5 w-4.5 text-green-600" />
              <span className="text-sm font-medium text-green-800">System Healthy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-50/60 border border-neutral-200/60">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-neutral-700">{stats.upcomingLectures} Lectures Today</span>
            </div>
            {stats.pendingInstructors > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-50/50 border border-amber-200/50">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-sm font-medium text-amber-800">{stats.pendingInstructors} Pending</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Programs"
            value={stats.totalPrograms}
            icon={BookOpen}
            delay={0.1}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-indigo-700"
          />
          <KPICard
            title="Courses"
            value={stats.totalCourses}
            icon={FileText}
            delay={0.15}
            iconBgClass="bg-blue-50"
            iconColorClass="text-blue-700"
          />
          <KPICard
            title="Instructors"
            value={stats.totalInstructors}
            subtitle={stats.pendingInstructors > 0 ? `${stats.pendingInstructors} pending` : undefined}
            icon={Users}
            delay={0.2}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-700"
          />
          <KPICard
            title="Lectures"
            value={stats.totalLectures}
            subtitle={`${stats.upcomingLectures} upcoming`}
            icon={Video}
            delay={0.25}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-700"
          />
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <SectionHeader
              title="Today's Schedule"
              subtitle={`${todayLectures.length} lectures today`}
              action={
                <button
                  onClick={() => navigate('/admin/programs')}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  View All
                </button>
              }
            />
            
            {todayLectures.length > 0 ? (
              <div>
                {todayLectures.map((lecture, index) => (
                  <TimelineItem key={lecture._id || index} lecture={lecture} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No Lectures Today"
                description="Create your first lecture"
              />
            )}
          </motion.div>

          {/* Program Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <SectionHeader
              title="Program Hierarchy"
              subtitle="Programs → Courses"
            />
            
            {programs.length > 0 ? (
              <div>
                {programs.map(program => (
                  <HierarchyItem
                    key={program._id}
                    program={program}
                    courses={courses.filter(c => c.programId && (c.programId._id === program._id || c.programId === program._id))}
                    lectures={lectures}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FolderTree}
                title="No Programs Yet"
                description="Create your first program"
              />
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <SectionHeader title="Recent Activity" />
          {recentActivity.length > 0 ? (
            <div>
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3.5 py-3 border-b border-neutral-100 last:border-0">
                  <div className="p-2.5 rounded-xl bg-neutral-50 text-neutral-600 mt-0.5 border border-neutral-200/60">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-neutral-900">{activity.subject}</span>
                      <span className="text-neutral-500"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-neutral-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No Recent Activity"
              description="Activity will appear here"
            />
          )}
        </motion.div>
      </div>

      {/* Right Sidebar (3 cols) */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <SectionHeader title="Quick Actions" />
          <div className="space-y-3">
            <QuickAction
              title="Create Program"
              icon={Plus}
              onClick={() => navigate('/admin/programs')}
            />
            <QuickAction
              title="Add Course"
              icon={FileText}
              onClick={() => navigate('/admin/programs')}
            />
            <QuickAction
              title="Create Lecture"
              icon={Video}
              onClick={() => navigate('/admin/programs')}
            />
            <QuickAction
              title="Review Applications"
              icon={UserPlus}
              onClick={() => navigate('/admin/pending-instructors')}
            />
          </div>
        </motion.div>

        {/* Pending Requests */}
        {pendingApplications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <SectionHeader
              title="Pending Requests"
              subtitle={`${pendingApplications.length} to review`}
            />
            <div>
              {pendingApplications.slice(0, 4).map((app, index) => (
                <PendingApplicationItem
                  key={app._id || index}
                  app={app}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  delay={0.45 + index * 0.05}
                />
              ))}
              {pendingApplications.length > 4 && (
                <button
                  onClick={() => navigate('/admin/pending-instructors')}
                  className="w-full mt-4 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  View All {pendingApplications.length} Applications
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Top Instructors */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="bg-white rounded-3xl border border-neutral-200/60 p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <SectionHeader
            title="Top Instructors"
            subtitle="By lecture count"
          />
          {instructors.length > 0 ? (
            <div>
              {instructors
                .sort((a, b) => (b.lectureCount || 0) - (a.lectureCount || 0))
                .slice(0, 4)
                .map((instructor, index) => (
                  <InstructorWorkloadItem key={instructor._id || index} instructor={instructor} />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No Instructors Yet"
              description="Approve instructors to see them here"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
