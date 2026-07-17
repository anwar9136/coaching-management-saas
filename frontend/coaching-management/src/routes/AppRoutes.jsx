import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import PendingApproval from '../pages/PendingApproval';

// Layouts & Auth
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import InstructorLayout from '../components/layout/InstructorLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Programs from '../pages/admin/Programs';
import ProgramForm from '../pages/admin/ProgramForm';
import ProgramDetails from '../pages/admin/ProgramDetails';
import Courses from '../pages/admin/Courses';
import CourseForm from '../pages/admin/CourseForm';
import CourseDetails from '../pages/admin/CourseDetails';
import Lectures from '../pages/admin/Lectures';
import LectureForm from '../pages/admin/LectureForm';
import LectureDetails from '../pages/admin/LectureDetails';
import Instructors from '../pages/admin/Instructors';
import InstructorDetails from '../pages/admin/InstructorDetails';
import CreateInstructor from '../pages/admin/CreateInstructor';
import EditInstructor from '../pages/admin/EditInstructor';
import PendingInstructor from '../pages/admin/PendingInstructor';
import Students from '../pages/admin/Students';

// Instructor Pages
import InstructorDashboard from '../pages/instructor/Dashboard';
import MyLectures from '../pages/instructor/MyLectures';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      <Route 
        path="/unauthorized" 
        element={
          <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Unauthorized Access</h1>
              <p className="text-slate-500">You do not have permission to view this page.</p>
            </div>
          </div>
        } 
      />

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Programs */}
          <Route path="/admin/programs" element={<Programs />} />
          <Route path="/admin/programs/new" element={<ProgramForm />} />
          <Route path="/admin/programs/:programId" element={<ProgramDetails />} />
          <Route path="/admin/programs/:programId/edit" element={<ProgramForm />} />

          {/* Courses */}
          <Route path='/admin/programs/:programId/courses' element={<Courses />} />
          <Route path='/admin/programs/:programId/courses/new' element={<CourseForm />} />
          <Route path='/admin/programs/:programId/courses/:courseId/edit' element={<CourseForm />} />
          <Route path="/admin/programs/:programId/courses/:courseId" element={<CourseDetails />} />

          {/* Lectures */}
          <Route path="/admin/programs/:programId/courses/:courseId/lectures" element={<Lectures />} />
          <Route path="/admin/programs/:programId/courses/:courseId/lectures/new" element={<LectureForm />} />
          <Route path="/admin/programs/:programId/courses/:courseId/lectures/:lectureId" element={<LectureDetails />} />
          <Route path="/admin/programs/:programId/courses/:courseId/lectures/:lectureId/edit" element={<LectureForm />} />

          {/* Instructors */}
          <Route path="/admin/instructors" element={<Instructors />} />
          <Route path="/admin/instructors/new" element={<CreateInstructor />} />
          <Route path="/admin/instructors/:instructorId" element={<InstructorDetails />} />
          <Route path="/admin/instructors/:instructorId/edit" element={<EditInstructor />} />
          <Route path="/admin/pending-instructors" element={<PendingInstructor />} />

          {/* Students */}
          <Route path="/admin/students" element={<Students />} />
        </Route>
      </Route>

      {/* ==================== INSTRUCTOR ROUTES ==================== */}
      <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
        <Route element={<InstructorLayout />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/my-lectures" element={<MyLectures />} />
          <Route path="/instructor/profile/edit" element={<EditInstructor />} />
        </Route>
      </Route>

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;