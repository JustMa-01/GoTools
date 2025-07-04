import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TerminalModal from './TerminalModal'; // Import our new modal

// --- The rotating messages for the terminal ---
const terminalMessages = [
    "[Netgain Engine v2.7.3] System stable. GoTools module: active ✅",
    "⚙️ Build: netgain-alpha-042 | Status: Operational",
    "👨‍💻 Developer: Maheswar | Systems Lead",
    "👨‍💻 Developer: Hemanth | Interface Architect",
    "🛰️ Broadcasting from Netgain Core... \"PDF compressed successfully in 1.3s\"",
    "[⚡] Glitch detected... rerouting power to Maheswar's node",
    "[⚡] Glitch detected... rerouting UX packet to Hemanth's sector",
    "↪ Engine thread uptime: 3h 14m 52s",
];

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');

    // Effect to handle rotating to the next message
    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % terminalMessages.length);
        }, 5000); // Change message every 5 seconds
        return () => clearInterval(messageInterval);
    }, []);

    // Effect to handle the typing animation for the current message
    useEffect(() => {
        setDisplayedText(''); // Reset text when the message index changes
        const fullText = terminalMessages[currentMessageIndex];
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText(prev => prev + fullText.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 40); // Adjust typing speed here (lower is faster)
        return () => clearInterval(typingInterval);
    }, [currentMessageIndex]);


    return (
      <>
        <TerminalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
        <motion.footer
          className="relative bg-gray-900 border-t-2 border-cyan-500/30 text-sm terminal-font p-6 mt-20 cursor-pointer shadow-lg shadow-cyan-500/10 overflow-hidden"
          onClick={() => setIsModalOpen(true)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          aria-label="Click to open developer console"
          title="Click to view developer info"
        >
          <div className="scanline-overlay"></div>
          <div className="container mx-auto relative z-10">
              {/* The dynamic, rotating line */}
              <div className="h-6 text-cyan-400">
                  <span className="text-green-400 font-bold mr-2">LOG:</span>
                  <span>{displayedText}</span>
                  <span className="cursor"></span>
              </div>
              
              {/* The static, always-visible line */}
              <div className="text-gray-600 mt-4 pt-4 border-t border-cyan-500/20 text-center">
                  <p>⚙️ Engine powered by Netgain · 👨‍💻 Maheswar & Hemanth · Built with grit, caffeine, and cosmic ambition.</p>
              </div>
          </div>
        </motion.footer>
      </>
    );
};
  
export default Footer;