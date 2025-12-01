import { useNavigate } from 'react-router-dom';
import { Zap, Dumbbell, Target, Grid, Gamepad2, User as UserIcon, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    const navigate = useNavigate();

    const games = [
        { id: 'batak-pro', title: 'Batak Pro', icon: Zap, path: '/game/batak-pro' },
        { id: 'power-punch', title: 'Power Punch Max Fresh', icon: Dumbbell, path: '/game/power-punch-max-fresh' },
        { id: 'arrow-game', title: 'Arrow Game', icon: Target, path: '/game/arrow-game' },
        { id: 'planogram', title: 'Planogram Game', icon: Grid, path: '/game/planogram-game' },
        { id: 'purple-game', title: 'Purple Game', icon: Gamepad2, path: '/game/purple-game' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 relative">
                <div className="text-red-500 z-10">
                    <Grid size={24} />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <img src="/Colgate-Logo.png" alt="Colgate Logo" className="h-32 object-contain" />
                </div>

                <div className="flex items-center gap-4 z-10">
                    <button
                        onClick={() => navigate('/qr-code')}
                        className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        title="Show QR Code"
                    >
                        <QrCode size={20} />
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                        title="My Profile"
                    >
                        <UserIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Game Grid */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                {games.map((game, index) => (
                    <motion.button
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(game.path)}
                        className="bg-white hover:bg-gray-50 text-gray-900 rounded-xl p-8 h-32 flex flex-col items-center justify-center gap-4 shadow-lg transform hover:scale-[1.02] transition-all group"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }} // Subtle tech-shape
                    >
                        <game.icon className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-bold text-lg uppercase tracking-wide">{game.title}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
