import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
    message: string;
    type: 'error' | 'success' | 'alert';
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getStyles = () => {
        switch (type) {
            case 'error':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/40',
                    icon: '❌',
                    shadow: 'shadow-red-500/20'
                };
            case 'success':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/40',
                    icon: '✅',
                    shadow: 'shadow-green-500/20'
                };
            case 'alert':
                return {
                    bg: 'bg-indigo-500/10',
                    border: 'border-indigo-500/40',
                    icon: 'ℹ️',
                    shadow: 'shadow-indigo-500/20'
                };
            default:
                return {
                    bg: 'bg-white/10',
                    border: 'border-white/30',
                    icon: 'ℹ️',
                    shadow: 'shadow-white/10'
                };
        }
    };

    const styles = getStyles();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                }}
                className={`
                    p-4 rounded-lg border backdrop-blur-md 
                    ${styles.bg} ${styles.border} ${styles.shadow}
                    shadow-lg flex items-center min-w-[250px] max-w-sm
                `}
            >
                <span className="mr-2 text-xl">{styles.icon}</span>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white font-medium"
                >
                    {message}
                </motion.p>
            </motion.div>
        </AnimatePresence>
    );
};

export default Alert;