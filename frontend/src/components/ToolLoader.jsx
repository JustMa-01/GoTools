// src/components/ToolLoader.jsx
import React, { useState, useEffect } from 'react';
import { useTribute } from '../contexts/TributeContext';

const glitchTexts = ["👨‍💻 Maheswar", "👨‍💻 Hemanth", "⚙️ Netgain Systems"];

const ToolLoader = ({ onComplete }) => {
    const { markToolLoaderAsShown } = useTribute();
    const [text, setText] = useState("Initializing Netgain Engine...");

    useEffect(() => {
        const initialText = "Initializing Netgain Engine...";
        let glitchInterval;

        // Start the glitch effect
        glitchInterval = setInterval(() => {
            const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
            setText(randomText);
            setTimeout(() => setText(initialText), 100); // Revert quickly
        }, 300);
        
        // End the animation and show the real loader
        const masterTimeout = setTimeout(() => {
            clearInterval(glitchInterval);
            markToolLoaderAsShown(); // Mark as shown for the rest of the session
            onComplete();
        }, 1800); // Total duration of this animation

        return () => {
            clearInterval(glitchInterval);
            clearTimeout(masterTimeout);
        };
    }, [markToolLoaderAsShown, onComplete]);

    return (
        <div className="flex items-center justify-center font-mono text-lg text-primary tool-loader-glitch" data-text={text}>
            {text}
        </div>
    );
};

export default ToolLoader;