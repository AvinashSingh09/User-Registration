import { useEffect, useState } from 'react';
import { X, Trophy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { makeRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameSlug: string;
    gameTitle: string;
}

interface LeaderboardEntry {
    id: string;
    username: string;
    score?: number;
    buttonHits?: number;
    attempts: number;
    createdAt: string;
}

const LeaderboardModal = ({ isOpen, onClose, gameSlug, gameTitle }: LeaderboardModalProps) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && gameSlug && user?.token) {
            fetchLeaderboard();
        }
    }, [isOpen, gameSlug, user?.token]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            // Using the specific endpoint structure provided by the user
            const endpoint = `/api/game-activities/leaderboard?game=${gameSlug}`;
            const response = await makeRequest(endpoint, 'GET', undefined, user?.token);

            if (response.success && response.leaderboard) {
                setLeaderboardData(response.leaderboard);
            } else {
                setLeaderboardData([]);
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const getScoreDisplay = (entry: LeaderboardEntry) => {
        if (gameSlug === 'batak-pro') {
            return `${entry.buttonHits || 0} Hits`;
        }
        return `${entry.score || 0} Pts`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-yellow-300" />
                                <h2 className="text-lg font-bold">{gameTitle} Leaderboard</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                    <p className="text-sm">Loading scores...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-6 text-red-500 text-sm">
                                    {error}
                                </div>
                            ) : leaderboardData.length > 0 ? (
                                <div className="space-y-2">
                                    {leaderboardData.map((entry, index) => (
                                        <div
                                            key={entry.id}
                                            className={`flex items-center p-3 rounded-xl border ${index < 3
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-gray-50 border-gray-100'
                                                }`}
                                        >
                                            <div className={`
                                                w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm mr-3
                                                ${index === 0 ? 'bg-yellow-400 text-white' :
                                                    index === 1 ? 'bg-gray-400 text-white' :
                                                        index === 2 ? 'bg-orange-400 text-white' :
                                                            'bg-gray-200 text-gray-600'}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800 text-sm">
                                                    {entry.username}
                                                </div>
                                                <div className="text-[10px] text-gray-500">
                                                    {new Date(entry.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="font-bold text-red-600 text-base">
                                                {getScoreDisplay(entry)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    No scores yet. Be the first!
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LeaderboardModal;
