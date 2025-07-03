import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// We only need the LinkedIn icon now
import { SiLinkedin } from 'react-icons/si';

// Updated developer data without GitHub links
const developers = [
    { name: 'Maheswar', linkedin: 'https://www.linkedin.com/in/maheswar117/' },
    { name: 'HEMANTH', linkedin: 'https://www.linkedin.com/in/hemanth-anala-1739b7267/' }
];

const TerminalModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="terminal-font w-full max-w-lg bg-gray-900/80 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 p-6 text-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            
            <p className="text-green-400">Welcome to Netgain OS.</p>
            <p className="text-green-400 mt-2">$ devcrew --list --contact</p>
            <div className="mt-2 pl-4 border-l-2 border-cyan-500/30">
              {developers.map(dev => (
                <a 
                  key={dev.name} 
                  href={dev.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 my-3 text-cyan-400 hover:text-white hover:bg-cyan-500/10 p-2 rounded-md transition-all duration-300"
                >
                  <span className="w-24">👨‍💻 {dev.name}</span>
                  <div className="flex items-center gap-2">
                    <SiLinkedin /> 
                    <span>View LinkedIn Profile</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-4">
              <span className="text-green-400">$ <span className="cursor"></span></span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalModal;