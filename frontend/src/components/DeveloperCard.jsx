import React from 'react';
import { motion } from 'framer-motion';
import { SiLinkedin, SiGithub } from 'react-icons/si';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const DeveloperCard = ({ name, imgSrc, role, linkedinUrl, githubUrl }) => {
  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-secondary rounded-lg p-4 text-center group"
    >
      <img src={imgSrc} alt={name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-border group-hover:border-primary transition-all duration-300 transform group-hover:scale-105" />
      <h4 className="font-bold text-lg text-foreground">{name}</h4>
      <p className="text-sm text-muted-foreground mb-4">{role}</p>
      <div className="flex justify-center items-center gap-5">
        <motion.a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={`${name}'s LinkedIn`}
          whileHover={{ y: -3, scale: 1.15 }}
          className="text-muted-foreground hover:text-primary"
        >
          <SiLinkedin size={20} />
        </motion.a>
        <motion.a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={`${name}'s GitHub`}
          whileHover={{ y: -3, scale: 1.15 }}
          className="text-muted-foreground hover:text-primary"
        >
          <SiGithub size={20} />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default DeveloperCard;