import { motion } from 'framer-motion';
import { BannerImage } from '@/assets/images';

export const BackgroundImage = () => {
  return (
    <motion.div
      className="hidden md:block md:w-1/2 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <img
        src={BannerImage}
        alt="Lighthouse and sailboat at sunset"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
