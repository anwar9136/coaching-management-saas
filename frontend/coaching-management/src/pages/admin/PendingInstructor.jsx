import React, { useState, useEffect } from 'react';
import { instructorService } from '../../services/instructorService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { UserPlus, Mail, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const PendingInstructor = () => {
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionModal, setActionModal] = useState({
        isOpen: false,
        type: null,        // 'approve' or 'reject'
        userId: null,
        name: ''
    });

    const fetchPending = async () => {
        try {
            const response = await instructorService.getPending();
            setPendingList(response.data?.data || []);
        } catch (err) {
            console.error('Failed to load pending instructors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const openActionModal = (type, userId, name) => {
        setActionModal({ isOpen: true, type, userId, name });
    };

    const handleActionConfirm = async () => {
        const { type, userId } = actionModal;
        try {
            if (type === 'approve') {
                await instructorService.approve(userId);
            } else {
                await instructorService.reject(userId);
            }
            fetchPending(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${type} instructor`);
        } finally {
            setActionModal({ isOpen: false, type: null, userId: null, name: '' });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-[#ffdb5c]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Pending Instructor Applications</h1>
                <p className="text-sm text-neutral-500 mt-1">Review and manage new instructor requests</p>
            </div>

            {pendingList.length === 0 ? (
                <Card className="border-dashed">
                    <EmptyState
                        icon={UserPlus}
                        title="No pending applications"
                        description="All applications have been reviewed. You're all caught up!"
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingList.map((user) => (
                        <Card key={user._id} className="flex flex-col">
                            <CardContent className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl font-semibold text-neutral-700">
                                        {user.name?.charAt(0) || '?'}
                                    </div>
                                    <Badge variant="warning">Pending</Badge>
                                </div>

                                <h3 className="text-lg font-semibold text-neutral-900">{user.name}</h3>
                                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-neutral-400" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-neutral-400" />
                                        Applied on {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>

                            <div className="border-t border-neutral-100 p-4 flex gap-3 bg-neutral-50/70 rounded-b-3xl">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => openActionModal('reject', user._id, user.name)}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    className="flex-1 bg-[#ffdb5c] hover:bg-[#ffd338] text-neutral-900"
                                    onClick={() => openActionModal('approve', user._id, user.name)}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Action Confirmation Modal */}
            <Modal
                isOpen={actionModal.isOpen}
                onClose={() => setActionModal({ isOpen: false, type: null, userId: null, name: '' })}
                title={actionModal.type === 'approve' ? 'Approve Instructor' : 'Reject Application'}
            >
                <div className="space-y-6 py-2">
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to <strong>{actionModal.type}</strong> the application for 
                        <span className="font-medium"> {actionModal.name}</span>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="secondary"
                            onClick={() => setActionModal({ isOpen: false, type: null, userId: null, name: '' })}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant={actionModal.type === 'approve' ? "default" : "danger"}
                            onClick={handleActionConfirm}
                        >
                            Confirm {actionModal.type === 'approve' ? 'Approval' : 'Rejection'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PendingInstructor;