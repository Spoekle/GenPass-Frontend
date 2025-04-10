import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import './styles/glass.css';
import NavBar from './pages/Components/Header/NavBar';
import Generator from './pages/Generator/Generator';
import Editor from './pages/Editor/Editor';
import PrivacyStatement from './pages/PrivacyStatement/PrivacyStatement';
import Footer from './pages/Components/Footer/Footer';

function App() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Track mouse position for ambient light effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden font-sans leading-6 font-normal antialiased">
            {/* Animated subtle dark gradient background */}
            <div className="fixed inset-0 animated-gradient opacity-90 -z-10"></div>
            
            {/* Subtle ambient light that follows cursor */}
            <div 
                className="ambient-light"
                style={{ 
                    '--x': `${mousePosition.x}px`, 
                    '--y': `${mousePosition.y}px` 
                } as React.CSSProperties}
            ></div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex flex-col relative z-10"
            >
                <Router>
                    <NavBar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Navigate to="/generator" />} />
                            <Route path="/generator" element={<Generator />} />
                            <Route path="/editor" element={<Editor />} />
                            <Route path="/privacy" element={<PrivacyStatement />} />
                        </Routes>
                    </main>
                    <Footer />
                </Router>
            </motion.div>
        </div>
    );
}

export default App;
