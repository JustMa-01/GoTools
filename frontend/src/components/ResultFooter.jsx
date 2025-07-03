// src/components/ResultFooter.jsx
import React from 'react';

const ResultFooter = () => {
    return (
        <div className="mt-6 pt-4 border-t border-border/20 text-center text-xs text-muted-foreground">
            <p>
                ⚙️ Optimized by GoTools | Powered by Netgain Engine · 
                <a href="https://www.linkedin.com/in/maheswar" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground"> 👨‍💻 Maheswar</a>, 
                <a href="https://www.linkedin.com/in/hemanth-anala" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground"> 👨‍💻 Hemanth</a>
            </p>
        </div>
    );
};

export default ResultFooter;