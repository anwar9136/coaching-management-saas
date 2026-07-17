import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Lectures = () => {
    const { programId, courseId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // The CourseDetails page already serves as the Lectures list page in this architecture
        navigate(`/admin/programs/${programId}/courses/${courseId}`, { replace: true });
    }, [navigate, programId, courseId]);

    return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
        </div>
    );
};

export default Lectures;
