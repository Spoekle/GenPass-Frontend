import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer 
            className="fixed bottom-0 w-full backdrop-blur-md bg-black/60 text-white py-3 z-40 shadow-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
        >
            <div className="container mx-auto flex justify-center px-4 items-center">
                <motion.p 
                    className="flex text-sm items-center text-neutral-300"
                >
                    © {new Date().getFullYear()} Spoekle. All rights reserved.
                    <motion.div
                        whileHover={{ y: -1 }}
                        className="ml-3"
                    >
                        <Link to="/privacy" className="text-neutral-300 hover:text-white underline transition-colors duration-200">
                            Privacy Statement
                        </Link>
                    </motion.div>
                </motion.p>
            </div>
        </motion.footer>
    );
}

export default Footer;