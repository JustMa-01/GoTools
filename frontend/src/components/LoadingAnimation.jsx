// src/components/LoadingAnimation.jsx
import React from 'react';
import { motion } from 'framer-motion';

// --- IMPORTANT: REPLACE THESE PLACEHOLDER URLS ---
const hemanthImg = "https://media.licdn.com/dms/image/D5603AQGn-n47wK24RA/profile-displayphoto-shrink_800_800/0/1715136829775?e=1726099200&v=beta&t=M8F2gH1iU9iQ8h5l9eH-yYl3yI_4c4J9F4f7Z5a9B8k";
const maheswarImg = "https://media.licdn.com/dms/image/D5603AQGn-n47wK24RA/profile-displayphoto-shrink_800_800/0/1715136829775?e=1726099200&v=beta&t=M8F2gH1iU9iQ8h5l9eH-yYl3yI_4c4J9F4f7Z5a9B8k"; // <-- REPLACE
const netgainLogo = "https://via.placeholder.com/150/FFFFFF/000000?Text=Netgain"; // <-- REPLACE

const LoadingAnimation = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 4.5 }}
            className="splash-screen"
        >
            <div className="loader-container">
                <motion.div
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.img 
                    src={netgainLogo}
                    className="netgain-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                />
                <motion.div className="dev-photos">
                    <motion.img src={hemanthImg} className="dev-photo" initial={{ scale: 0, x: -100, opacity: 0 }} animate={{ scale: 1, x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}/>
                    <motion.img src={maheswarImg} className="dev-photo" initial={{ scale: 0, x: 100, opacity: 0 }} animate={{ scale: 1, x: 0, opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}/>
                </motion.div>
                <motion.p className="booting-text" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, delay: 0.5, times: [0, 0.2, 0.8, 1] }}>
                    Netgain Engine Booting...
                </motion.p>
            </div>
        </motion.div>
    );
};

export default LoadingAnimation;