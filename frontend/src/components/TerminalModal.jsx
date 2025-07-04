import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiLinkedin, SiGithub } from 'react-icons/si';

const developers = [
    { name: 'Maheswar', linkedin: 'https://www.linkedin.com/in/maheswar117/',  },
    { name: 'HEMANTH', linkedin: 'https://www.linkedin.com/in/hemanth-anala-1739b7267/',  }
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="terminal-font w-full max-w-2xl bg-gray-900/90 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 p-6 text-base"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-700"></span>
                <span className="w-3.5 h-3.5 bg-yellow-500 rounded-full border border-yellow-700"></span>
                <span className="w-3.5 h-3.5 bg-green-500 rounded-full border border-green-700"></span>
              </div>
              <p className="text-gray-400 font-bold">NetgainOS</p>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            
            <p className="text-green-400">Welcome to Netgain OS.</p>
            <p className="text-green-400 mt-4">$ devcrew --list</p>
            <div className="mt-2 pl-4 border-l-2 border-cyan-500/30">
              {developers.map(dev => (
                <div key={dev.name} className="flex flex-col sm:flex-row sm:items-center sm:gap-4 my-3 py-1 text-cyan-400">
                  <span className="w-32 font-bold">👨‍💻 {dev.name}</span>
                  <div className="flex items-center gap-4 mt-1 sm:mt-0">
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <SiLinkedin /> LinkedIn
                    </a>
                    
                  </div>
                </div>
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