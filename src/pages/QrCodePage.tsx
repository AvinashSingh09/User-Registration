import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const QrCodePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const qrData = {
        name: user.name,
        username: user.username,
        email: user.email,
        token: user.token,
        age: user.age,
        gender: user.gender,
        phone: user.phone
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center"
                >
                    <h1 className="text-3xl font-bold text-center mb-8">Your Game Pass</h1>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                        <QRCodeSVG
                            value={JSON.stringify(qrData)}
                            size={250}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <p className="text-gray-500 text-center">
                        Scan this QR code at any game station to start playing
                    </p>

                    <div className="mt-8 text-center">
                        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500">@{user.username}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default QrCodePage;
