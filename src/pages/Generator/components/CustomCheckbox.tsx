import React from 'react';
import { motion } from 'framer-motion';

interface CustomCheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label }) => {
    return (
        <motion.label 
            className="flex items-center cursor-pointer font-bold text-white mb-2 select-none"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={onChange} 
                className="hidden" 
            />
            <motion.span 
                className={`
                    flex items-center justify-center w-full px-4 py-3 
                    backdrop-blur-sm rounded-lg transition-all duration-300
                    ${checked 
                        ? 'bg-indigo-500/30 border border-indigo-500/50 shadow-md' 
                        : 'bg-white/10 border border-white/20'}
                `}
                animate={{
                    scale: checked ? [1, 1.05, 1] : 1,
                    transition: {
                        duration: 0.2,
                        ease: "easeInOut"
                    }
                }}
            >
                <motion.span 
                    className="relative flex items-center text-sm"
                    variants={{
                        checked: { opacity: 1 },
                        unchecked: { opacity: 0.8 }
                    }}
                    animate={checked ? "checked" : "unchecked"}
                >
                    {checked && (
                        <motion.span 
                            className="absolute -left-2 text-indigo-300 mr-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            ✓
                        </motion.span>
                    )}
                    <span className="ml-4">{label}</span>
                </motion.span>
            </motion.span>
        </motion.label>
    );
};

export default CustomCheckbox;