import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, XCircle, LogOut } from 'lucide-react';

const PendingApproval = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error occurred while logging out:', error);
        }
        logout();
        navigate('/login', { replace: true });
    };

    const isRejected = user?.role === 'rejectedInstructor';

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <Card className="border-0 shadow-floating text-center">
                    <CardHeader className="pb-4">
                        <div className="flex justify-center mb-4">
                            {isRejected ? (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                                    <XCircle className="h-8 w-8" />
                                </div>
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                                    <Clock className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <CardTitle className="text-xl">
                            {isRejected ? "Application Rejected" : "Application Pending Review"}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            {isRejected ? (
                                "Unfortunately, your instructor application has been rejected by the administrator. Please contact support if you believe this is a mistake."
                            ) : (
                                "Your instructor application has been submitted and is awaiting review. You will be able to access the platform once an administrator approves your account."
                            )}
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-sm">
                            <span className="text-slate-500">Logged in as:</span>
                            <span className="block font-medium text-slate-900 mt-1">{user?.email}</span>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center pt-2 pb-6">
                        <Button variant="secondary" onClick={handleLogout} className="w-full gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PendingApproval;
