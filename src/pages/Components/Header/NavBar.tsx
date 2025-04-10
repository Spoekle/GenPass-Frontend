import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, MotionStyle } from 'framer-motion';
import logo from '/src/images/logo_500px.png';
import { FaGithub } from 'react-icons/fa';

const NavBar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState<MotionStyle>({});
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        const activeLink = navRef.current?.querySelector('.active') as HTMLElement | null;
        if (activeLink) {
            const { offsetLeft, offsetWidth } = activeLink;
            setUnderlineStyle({
                left: offsetLeft,
                width: offsetWidth,
                background: '#4f46e5', // Indigo color
                height: '2px',
                position: 'absolute',
                bottom: -5,
                borderRadius: '1px'
            });
        }
    }, [currentPath]);

    return (
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md bg-black/60 text-white shadow-md"
        >
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <motion.a 
                    href="/generator"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="flex items-center space-x-2">
                        <motion.img 
                            src={logo} 
                            alt="logo" 
                            className="w-8 h-8 rounded-md"
                            initial={{ rotate: -5 }}
                            animate={{ rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        />
                        <motion.h2 
                            className="hidden sm:block text-lg font-semibold text-white"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >
                            GenPass
                        </motion.h2>
                    </div>
                </motion.a>
                
                <div className="relative flex space-x-4 items-center" ref={navRef}>
                    <NavLink
                        to="/generator"
                        className={({ isActive }) =>
                            `z-20 p-2 font-medium transition-all duration-200 ${isActive ? 'active text-white' : 'text-neutral-300 hover:text-white'}`
                        }
                    >
                        <motion.span whileHover={{ y: -1 }} className="inline-block">
                            Generator
                        </motion.span>
                    </NavLink>
                    
                    <NavLink
                        to="/editor"
                        className={({ isActive }) =>
                            `z-20 p-2 font-medium transition-all duration-200 ${isActive ? 'active text-white' : 'text-neutral-300 hover:text-white'}`
                        }
                    >
                        <motion.span whileHover={{ y: -1 }} className="inline-block">
                            Editor
                        </motion.span>
                    </NavLink>
                    
                    <motion.a
                        href="https://github.com/Spoekle/genpass"
                        target="_blank"
                        rel="noreferrer"
                        className="mx-2 text-neutral-300 hover:text-white transition duration-200 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub className="text-2xl" />
                    </motion.a>
                    
                    <motion.div 
                        className="absolute bottom-0"
                        style={underlineStyle}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;