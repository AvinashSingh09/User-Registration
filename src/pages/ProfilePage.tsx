import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, LogOut, Mail, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen text-white p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-semibold"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-gray-900 rounded-xl p-8 max-w-2xl w-full shadow-2xl"
                >
                    <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold text-red-600">{user.name.charAt(0)}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500">@{user.username}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="flex items-center gap-3 text-gray-600 p-4 bg-gray-50 rounded-lg">
                                <Mail className="text-red-500" size={20} />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase">Email</span>
                                    <span className="font-medium">{user.email}</span>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3 text-gray-600 p-4 bg-gray-50 rounded-lg">
                                    <Phone className="text-red-500" size={20} />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase">Phone</span>
                                        <span className="font-medium">{user.phone}</span>
                                    </div>
                                </div>
                            )}

                            {user.age && (
                                <div className="flex items-center gap-3 text-gray-600 p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="text-red-500" size={20} />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase">Age</span>
                                        <span className="font-medium">{user.age} years</span>
                                    </div>
                                </div>
                            )}

                            {user.gender && (
                                <div className="flex items-center gap-3 text-gray-600 p-4 bg-gray-50 rounded-lg">
                                    <UserIcon className="text-red-500" size={20} />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase">Gender</span>
                                        <span className="font-medium capitalize">{user.gender}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
