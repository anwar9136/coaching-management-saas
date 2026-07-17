import React from 'react';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { GraduationCap } from 'lucide-react';

const Students = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[80vh] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
                <p className="text-sm text-slate-500 mt-1">Manage student enrollments and progress.</p>
            </div>

            <Card className="flex-1 flex items-center justify-center border-dashed">
                <EmptyState 
                    icon={GraduationCap}
                    title="Student Management Coming Soon"
                    description="We are currently building the student management module. You will soon be able to manage enrollments, track progress, and communicate with students directly from here."
                />
            </Card>
        </div>
    );
};

export default Students;
