import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ToolCard = ({ icon, title, description, to }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        to={to}
        className="block p-6 bg-card border border-border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
      >
        <div className="flex items-center mb-4">
          <div className="text-3xl text-primary mr-4">{icon}</div>
          <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </Link>
    </motion.div>
  );
};

export default ToolCard;