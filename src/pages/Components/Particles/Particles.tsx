import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const Particles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Subtle monochrome colors for particles
  const colors = [
    'rgba(255, 255, 255, 0.05)',  // very subtle white
    'rgba(255, 255, 255, 0.03)',  // even more subtle white
    'rgba(200, 200, 200, 0.04)',  // slight gray
  ];

  useEffect(() => {
    // Generate minimal particles based on screen size
    const generateParticles = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const particleCount = Math.floor((windowWidth * windowHeight) / 40000); // Lower density
      
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        size: Math.random() * 2 + 1, // Smaller size between 1-3px
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 80 + 40, // Slower movement
        delay: Math.random() * 10, 
      }));
      
      setParticles(newParticles);
    };

    generateParticles();
    
    // Regenerate on window resize
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            x: particle.x,
            y: particle.y,
            filter: 'blur(1px)'
          }}
          animate={{
            x: [particle.x, particle.x + (Math.random() * 50 - 25)],
            y: [particle.y, particle.y + (Math.random() * 50 - 25)],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

export default Particles;