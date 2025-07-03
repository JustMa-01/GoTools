import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TerminalModal from './TerminalModal'; // Make sure this is imported

// A larger pool of messages to cycle through for a more dynamic feel
const terminalLogLines = [
    "[SYSTEM BOOT] Netgain Engine v2.7.3 initialized...",
    "[INFO] GoTools Module: ACTIVE",
    "[STATUS] All systems operational. ✅",
    "[DEV] Maheswar node... ONLINE",
    "[DEV] Hemanth node... ONLINE",
    "[LOG] PDF compressed successfully (payload: 5.2MB -> 1.3MB)",
    "[LOG] Image converted to PDF (4 files)",
    "[SECURITY] Firewall integrity: 100%",
    "Reticulating splines... complete.",
    "Querying developer caffeine levels... CRITICAL ☕",
    "Current thread uptime: 4h 21m 08s",
];

// Function to get a few random log lines
const getLogLines = (count = 3) => {
    const shuffled = [...terminalLogLines].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logLines, setLogLines] = useState(getLogLines());
    
    // Effect to rotate the log messages every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLogLines(getLogLines());
        }, 6000); // Rotate every 6 seconds
        return () => clearInterval(interval);
    }, []);

    return (
      <>
        <TerminalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
        <motion.footer
          className="relative bg-black/80 border-t-2 border-cyan-500/30 text-base terminal-font p-6 mt-20 cursor-pointer shadow-lg shadow-cyan-500/5 overflow-hidden"
          onClick={() => setIsModalOpen(true)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* The new scanline overlay effect */}
            <div className="scanline-overlay"></div>

            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Live Log */}
                    <div className="md:col-span-2">
                        <p className="text-green-400 font-bold">[LIVE ENGINE LOG]</p>
                        <div className="pl-4 border-l border-green-400/30 mt-2 text-cyan-400 space-y-1">
                            {logLines.map((line, index) => (
                                <p key={index}><span className="text-gray-500 mr-2">{'>'}</span>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    {/* Column 2: Static Info */}
                    <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-cyan-500/20 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                        <p className="font-bold text-green-400">STATUS: OPERATIONAL</p>
                        <p className="text-gray-400">Powered by <span className="text-white">Netgain</span></p>
                        <p className="text-gray-400">Dev Crew: <span className="text-white">Maheswar & Hemanth</span></p>
                    </div>
                </div>

                {/* The final, always-visible line */}
                <div className="text-gray-600 mt-6 pt-4 border-t border-cyan-500/20 text-center text-xs">
                    <p>Click anywhere on the terminal to view developer profiles.<span className="cursor"></span></p>
                </div>
            </div>
        </motion.footer>
      </>
    );
};
  
export default Footer;