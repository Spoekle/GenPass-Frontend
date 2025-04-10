import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const PrivacyStatement = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-24 px-4 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="glass-card shadow-xl">
        <motion.h1 
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.01 }}
        >
          Privacy Statement
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="mb-6 leading-relaxed text-white/90"
        >
          This Privacy Statement explains how GenPass, our password generator, manages and protects your privacy. 
          We value your trust and are committed to safeguarding any personal information you may provide while using the application.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mb-8 glass-dark p-6 rounded-lg">
          <motion.h2
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ x: 5 }}
          >
            About the Password Generator
          </motion.h2>
          <p className="mb-4 leading-relaxed text-white/90">
            GenPass is a secure password generator designed to help you create strong, random passwords for your online accounts. 
            The generator operates entirely on your device, ensuring that your input and generated passwords remain private. 
            No password or personal information is transmitted to or stored on any remote server.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8 glass-dark p-6 rounded-lg">
          <motion.h2 
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ x: 5 }}
          >
            Data and Local Storage
          </motion.h2>
          <p className="mb-4 leading-relaxed text-white/90">
            GenPass uses your browser's local storage only to save non-sensitive user preferences, such as your selected options for password generation. 
            These settings help improve your user experience by preserving your favorite configurations. 
            All data stored locally remains on your device and is never shared or accessed by third parties.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8 glass-dark p-6 rounded-lg">
          <motion.h2 
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ x: 5 }}
          >
            Privacy and Security
          </motion.h2>
          <p className="mb-4 leading-relaxed text-white/90">
            We designed GenPass with security and privacy in mind. The password generation process happens in your browser, 
            preventing any of your data from being exposed or intercepted in transit. 
            We do not implement tracking cookies, analytics, or collect any personal data beyond what is stored locally for user convenience.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8 glass-dark p-6 rounded-lg">
          <motion.h2 
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ x: 5 }}
          >
            Your Consent and Control
          </motion.h2>
          <p className="mb-4 leading-relaxed text-white/90">
            By using GenPass, you acknowledge that you understand how your data is handled and consent to the use of local storage 
            for saving your password generation settings. If you prefer, you can clear your browser's local storage at any time 
            to remove these settings.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass-dark p-6 rounded-lg">
          <motion.h2 
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ x: 5 }}
          >
            Contact Us
          </motion.h2>
          <p className="leading-relaxed text-white/90">
            If you have any questions or concerns about this Privacy Statement or the way GenPass handles your data, 
            please feel free to reach out to us via GitHub.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyStatement;