import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programService } from '../../services/programService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookOpen, ArrowLeft } from 'lucide-react';

const ProgramForm = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!programId;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [error, setError] = useState('');

    // Fetch program data when editing
    useEffect(() => {
        if (isEdit && programId) {
            const fetchProgram = async () => {
                try {
                    const res = await programService.getById(programId);
                    const program = res.data?.data || res.data;

                    if (program) {
                        setFormData({
                            name: program.name || '',
                            description: program.description || ''
                        });
                    }
                } catch (err) {
                    console.error("Error fetching program:", err);
                    setError("Failed to load program data.");
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchProgram();
        } else {
            setInitialLoading(false);
        }
    }, [programId, isEdit]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isEdit) {
                response = await programService.update(programId, formData);
            } else {
                response = await programService.create(formData);
            }

            if (response.data?.success) {
                navigate('/admin/programs');
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 
                (isEdit ? "Failed to update program" : "Failed to create program")
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/programs')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                        {isEdit ? 'Edit Program' : 'Create New Program'}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {isEdit 
                            ? 'Update the program details below.' 
                            : 'Add a new educational program to your institute.'
                        }
                    </p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <CardTitle>Program Details</CardTitle>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400 block">Program Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-12 bg-white border border-neutral-200/60 rounded-2xl px-4 text-[15px] focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400"
                                placeholder="e.g., BSc Computer Science"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400 block">Description (optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-white border border-neutral-200/60 rounded-2xl px-4 py-3 text-[15px] focus:outline-none focus:ring-4 focus:ring-neutral-900/[0.03] focus:border-neutral-400 resize-y"
                                placeholder="Brief description of the program..."
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/admin/programs')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900 font-medium"
                                disabled={loading}
                            >
                                {loading 
                                    ? (isEdit ? "Updating..." : "Creating...") 
                                    : (isEdit ? "Update Program" : "Create Program")
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProgramForm;