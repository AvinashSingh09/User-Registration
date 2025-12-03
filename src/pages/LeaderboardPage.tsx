import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { makeRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<OverallLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverallLeaderboard();
    }, [user?.token]);

    const fetchOverallLeaderboard = async () => {
        try {
            const endpoint = `/api/game-activities/leaderboard/overall`;
            const response = await makeRequest(endpoint, 'GET', undefined, user?.token);

            if (response.success && response.leaderboard) {
                setLeaderboardData(response.leaderboard);
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const topThree = [
        leaderboardData.find(d => d.rank === 2),
        leaderboardData.find(d => d.rank === 1),
        leaderboardData.find(d => d.rank === 3),
    ];

    const restOfPlayers = leaderboardData.filter(d => d.rank > 3);

    const GameScoreRow = ({ label, score }: { label: string, score: number }) => (
        <div className="flex justify-between items-center text-[10px] font-bold text-white">
            <span>{label}</span>
            <span>{score}</span>
        </div>
    );

    return (
        <div className="min-h-screen p-6 relative overflow-hidden font-sans">
            {/* Background Effects (Simplified) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="absolute top-6 left-6 text-white hover:text-gray-200 transition-colors z-10"
            >
                <ArrowLeft size={32} />
            </button>

            <div className="max-w-6xl mx-auto relative z-10">
                <h1 className="text-5xl font-black text-center text-white mb-12 uppercase tracking-wide drop-shadow-md">
                    Leaderboard
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        <div className="flex justify-center items-end gap-4 mb-16 px-4">
                            {topThree.map((player, index) => {
                                if (!player) return <div key={index} className="w-64"></div>; // Placeholder

                                const isFirst = player.rank === 1;
                                const cardHeight = isFirst ? 'h-[420px]' : 'h-[380px]';
                                const medalColor = isFirst ? 'text-yellow-400' : 'text-gray-300';

                                return (
                                    <motion.div
                                        key={player.userId}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ delay: index * 0.2 }}
                                        className={`relative w-64 rounded-3xl overflow-hidden shadow-2xl ${cardHeight} flex flex-col border border-white/30 backdrop-blur-md`}
                                    >
                                        {/* Top Section (Transparent Blue) */}
                                        <div className={`flex-1 ${isFirst ? 'bg-blue-500/30' : 'bg-blue-400/20'} p-4 flex flex-col items-center justify-center relative`}>
                                            <div className="mb-2">
                                                <div className="relative">
                                                    <Medal size={isFirst ? 64 : 48} className={`${medalColor} drop-shadow-lg`} />
                                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs pt-1">
                                                        ★
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 truncate max-w-full px-2 drop-shadow-md">
                                                {player.username}
                                            </h3>

                                            <div className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm mb-4 shadow-md">
                                                {Math.round(player.overallScore)} pts
                                            </div>

                                            {/* Rank Box */}
                                            <div className="bg-red-600 text-white w-full py-2 text-center font-black text-2xl absolute bottom-0">
                                                {player.rank}
                                            </div>
                                        </div>

                                        {/* Bottom Section (Transparent White - Scores) */}
                                        <div className="bg-black/20 p-4 pt-6 space-y-1">
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                <GameScoreRow label="Batak" score={player.games['batak-pro'] || 0} />
                                                <GameScoreRow label="Archery" score={player.games['arrow-game'] || 0} />
                                                <GameScoreRow label="Punch" score={player.games['power-punch-max-fresh'] || 0} />
                                                <GameScoreRow label="Planogram" score={player.games['planogram-game'] || 0} />
                                                <GameScoreRow label="Purple" score={player.games['purple-game'] || 0} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* List View */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
                            {/* Header */}
                            <div className="bg-[#ff3d00] text-white font-bold grid grid-cols-12 px-6 py-4 text-sm uppercase tracking-wider">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-4">User</div>
                                <div className="col-span-5">Email</div>
                                <div className="col-span-2 text-right">Score</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-gray-200">
                                {restOfPlayers.map((player) => (
                                    <div key={player.userId} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-1 font-bold text-red-600">
                                            {player.rank}
                                        </div>
                                        <div className="col-span-4 font-semibold text-gray-800">
                                            {player.username}
                                        </div>
                                        <div className="col-span-5 text-gray-600 text-sm">
                                            {player.userEmail}
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-red-600">
                                            {Math.round(player.overallScore)}
                                        </div>
                                    </div>
                                ))}
                                {restOfPlayers.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        No other players found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
