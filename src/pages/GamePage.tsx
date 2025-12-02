import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { makeRequest, API_CONFIG } from '../services/api';
import LeaderboardModal from '../components/LeaderboardModal';

const GamePage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [gameData, setGameData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const getGameConfig = (id: string | undefined) => {
        switch (id) {
            case 'batak-pro':
                return {
                    title: 'Batak Pro',
                    description: 'Test your reaction speed!',
                    slug: 'batak-pro'
                };
            case 'power-punch-max-fresh':
                return {
                    title: 'Power Punch Max Fresh',
                    description: 'Show your strength!',
                    slug: 'power-punch-max-fresh'
                };
            case 'arrow-game':
                return {
                    title: 'Arrow Game',
                    description: 'Hit the target!',
                    slug: 'arrow-game'
                };
            case 'planogram-game':
                return {
                    title: 'Planogram Game',
                    description: 'Arrange items correctly.',
                    slug: 'planogram-game'
                };
            case 'purple-game':
                return {
                    title: 'Purple Game',
                    description: 'Collect the purple items.',
                    slug: 'purple-game'
                };
            default:
                return { title: 'Game Activity', description: 'Activity details...', slug: '' };
        }
    };

    const game = getGameConfig(gameId);

    useEffect(() => {
        const fetchData = async () => {
            if (!game.slug || !user?.token) return;

            setLoading(true);
            try {
                // Using the specific endpoint structure: /api/game-activities?game=SLUG
                const endpoint = `${API_CONFIG.ENDPOINTS.GAME_ACTIVITIES}?game=${game.slug}`;

                const response = await makeRequest(endpoint, 'GET', undefined, user.token);
                setGameData(response);
            } catch (err: any) {
                console.error('Error fetching game data:', err);
                setError('Failed to load game data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gameId, user?.token, game.slug]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
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
                    onClick={() => setShowLeaderboard(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg"
                >
                    <Trophy size={20} />
                    Leaderboard
                </button>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-gray-900 rounded-xl p-12 max-w-4xl w-full shadow-2xl text-center"
                >
                    <h1 className="text-3xl font-bold text-red-600 mb-4">{game.title}</h1>
                    <p className="text-gray-600 font-medium mb-8">{game.description}</p>

                    <div className="mt-8 p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                                <Loader2 className="animate-spin" size={32} />
                                <p>Loading activity data...</p>
                            </div>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : gameData?.data && gameData.data.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-6">
                                {gameData.data.map((activity: any, index: number) => {
                                    let stats = [];

                                    switch (game.slug) {
                                        case 'batak-pro':
                                            stats = [
                                                { label: 'Button Hits', value: activity.buttonHits },
                                                { label: 'Session Time', value: `${activity.sessionTimeSeconds || 0}s` }
                                            ];
                                            break;
                                        case 'power-punch-max-fresh':
                                            stats = [
                                                { label: 'Score', value: activity.score },
                                                { label: 'Attempts', value: activity.attempts }
                                            ];
                                            break;
                                        case 'arrow-game':
                                            stats = [
                                                { label: 'Score', value: activity.score },
                                                { label: 'Attempts', value: activity.attempts }
                                            ];
                                            break;
                                        case 'planogram-game':
                                            stats = [
                                                { label: 'Score', value: activity.score },
                                                { label: 'Time Taken', value: activity.metadata?.timeTaken || 'N/A' }
                                            ];
                                            break;
                                        case 'purple-game':
                                            stats = [
                                                { label: 'Score', value: activity.score },
                                                { label: 'Bonus', value: activity.metadata?.bonus ? 'Yes' : 'No' }
                                            ];
                                            break;
                                        default:
                                            stats = [{ label: 'Score', value: activity.score || 'N/A' }];
                                    }

                                    return (
                                        <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center hover:shadow-lg transition-shadow w-full max-w-xs">
                                            <div className="text-xs text-gray-400 self-end mb-2">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </div>

                                            <div className="text-4xl font-bold text-red-600 mb-2">
                                                {stats[0].value}
                                            </div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4 text-gray-500">
                                                {stats[0].label}
                                            </div>

                                            {stats[1] && (
                                                <div className="w-full pt-4 border-t border-gray-100">
                                                    <div className="text-2xl font-bold text-gray-800">
                                                        {stats[1].value}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold text-gray-500">
                                                        {stats[1].label}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>No data available yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <LeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                gameSlug={game.slug}
                gameTitle={game.title}
            />
        </div>
    );
};

export default GamePage;
