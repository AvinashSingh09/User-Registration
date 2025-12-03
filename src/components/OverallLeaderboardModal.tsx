import { useEffect, useState } from 'react';
import { X, Trophy, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { makeRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OverallLeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface GameScores {
    'batak-pro'?: number;
    'power-punch-max-fresh'?: number;
    'arrow-game'?: number;
    'planogram-game'?: number;
    'purple-game'?: number;
}

interface OverallLeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    userEmail: string;
    games: GameScores;
    overallScore: number;
}

const OverallLeaderboardModal = ({ isOpen, onClose }: OverallLeaderboardModalProps) => {
    const [leaderboardData, setLeaderboardData] = useState<OverallLeaderboardEntry[]>([]);
    const [maxScore, setMaxScore] = useState(500);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && user?.token) {
            fetchOverallLeaderboard();
        }
    }, [isOpen, user?.token]);

    const fetchOverallLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = `/api/game-activities/leaderboard/overall`;
            const response = await makeRequest(endpoint, 'GET', undefined, user?.token);

            if (response.success && response.leaderboard) {
                setLeaderboardData(response.leaderboard);
                if (response.maxOverallScore) {
                    setMaxScore(response.maxOverallScore);
                }
            } else {
                setLeaderboardData([]);
            }
        } catch (err) {
            console.error('Error fetching overall leaderboard:', err);
            setError('Failed to load overall leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (userId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedRows(newExpanded);
    };

    const gameNames: Record<string, string> = {
        'batak-pro': 'Batak Pro',
        'power-punch-max-fresh': 'Power Punch',
        'arrow-game': 'Arrow Game',
        'planogram-game': 'Planogram',
        'purple-game': 'Purple Game'
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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-yellow-300" />
                                <div>
                                    <h2 className="text-lg font-bold">Overall Leaderboard</h2>
                                    <p className="text-xs text-red-100">Max Score: {maxScore}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                    <p className="text-sm">Loading overall scores...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-6 text-red-500 text-sm">
                                    {error}
                                </div>
                            ) : leaderboardData.length > 0 ? (
                                <div className="space-y-2">
                                    {leaderboardData.map((entry) => {
                                        const isExpanded = expandedRows.has(entry.userId);
                                        const gameCount = Object.keys(entry.games).length;

                                        return (
                                            <div
                                                key={entry.userId}
                                                className={`rounded-xl border overflow-hidden ${entry.rank <= 3
                                                    ? 'bg-yellow-50 border-yellow-200'
                                                    : 'bg-gray-50 border-gray-100'
                                                    }`}
                                            >
                                                <div
                                                    className="flex items-center p-3 cursor-pointer hover:bg-white/50 transition-colors"
                                                    onClick={() => toggleRow(entry.userId)}
                                                >
                                                    <div className={`
                                                        w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm mr-3 flex-shrink-0
                                                        ${entry.rank === 1 ? 'bg-yellow-400 text-white' :
                                                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                                                                entry.rank === 3 ? 'bg-orange-400 text-white' :
                                                                    'bg-gray-200 text-gray-600'}
                                                    `}>
                                                        {entry.rank}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-gray-800 text-sm truncate">
                                                            {entry.username}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500">
                                                            {gameCount} game{gameCount !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-red-600 text-base mr-2">
                                                        {entry.overallScore.toFixed(2)}
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-3 pb-3 pt-1 border-t border-gray-200/50 bg-white/30">
                                                                <div className="text-[10px] text-gray-500 mb-2 font-semibold">
                                                                    Game Scores:
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {Object.entries(entry.games).map(([gameSlug, score]) => (
                                                                        <div
                                                                            key={gameSlug}
                                                                            className="flex justify-between items-center bg-white rounded px-2 py-1"
                                                                        >
                                                                            <span className="text-[10px] text-gray-600">
                                                                                {gameNames[gameSlug] || gameSlug}
                                                                            </span>
                                                                            <span className="text-xs font-bold text-gray-800">
                                                                                {score}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 text-sm">
                                    No overall scores yet. Start playing!
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OverallLeaderboardModal;
