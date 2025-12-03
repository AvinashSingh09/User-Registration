import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <img
                        src="/Colgate-Logo.png"
                        alt="Colgate Logo"
                        className="h-32 object-contain drop-shadow-xl"
                    />
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 w-full px-8">
                    <motion.button
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        onClick={() => navigate('/login')}
                        className="bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all uppercase tracking-wider text-lg"
                    >
                        Login
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        onClick={() => navigate('/register')}
                        className="bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all uppercase tracking-wider text-lg"
                    >
                        Register
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
