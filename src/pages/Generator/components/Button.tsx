import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
    onClick, 
    children, 
    className,
    variant = 'primary'
}) => {
    // Define base and variant styles
    const baseStyle = "glass-button font-bold py-2 px-4 rounded-lg";
    
    const variantStyles = {
        primary: "border-indigo-500/30 bg-indigo-500/20 hover:bg-indigo-500/30",
        secondary: "border-purple-500/30 bg-purple-500/20 hover:bg-purple-500/30",
        success: "border-green-500/30 bg-green-500/20 hover:bg-green-500/30",
        danger: "border-red-500/30 bg-red-500/20 hover:bg-red-500/30"
    };

    return (
        <motion.button
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.button>
    );
};

export default Button;