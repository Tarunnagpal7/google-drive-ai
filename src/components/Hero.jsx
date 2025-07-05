import { motion } from 'framer-motion';
import { FiArrowRight, FiFolder, FiFile, FiImage, FiVideo, FiMusic, FiFileText } from 'react-icons/fi';

export default function Hero() {
  // Different Google Drive file type icons
  const driveIcons = [
    { icon: <FiFolder size={32} />, color: 'text-blue-400', type: 'folder' },
    { icon: <FiFile size={32} />, color: 'text-purple-400', type: 'document' },
    { icon: <FiImage size={32} />, color: 'text-green-400', type: 'image' },
    { icon: <FiVideo size={32} />, color: 'text-red-400', type: 'video' },
    { icon: <FiMusic size={32} />, color: 'text-yellow-400', type: 'audio' },
    { icon: <FiFileText size={32} />, color: 'text-indigo-400', type: 'pdf' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 text-center lg:text-left relative z-10"
      >
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-500">Google Drive</span> with AI
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl text-black- mb-8 max-w-2xl mx-auto lg:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Automatically organize, rename, and structure your files with our intelligent AI assistant.
          Say goodbye to messy folders forever!
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >

          {/* <button onClick={"#learn-more"} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium bg-white/10 hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
            <span>Learn More</span>
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button> */}
        </motion.div>
      </motion.div>
      
      {/* Enhanced Floating Google Drive Icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 mt-12 lg:mt-0 h-96 lg:h-[32rem] relative"
      >
        {/* Background container */}
        <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 border-black border-10 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]" />
        </div>

        {/* Primary floating Google Drive icons with enhanced animations */}
        {driveIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color} bg-white/5 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/10`}
            style={{
              left: `${10 + (index * 12) % 70}%`,
              top: `${10 + (index * 7) % 70}%`,
            }}
            initial={{ y: 0, opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{
              y: [0, -30, -10, -40, 0],
              x: [0, 10, -5, 15, 0],
              opacity: [0, 1, 0.8, 1, 0.9],
              rotate: [-180, -5, 5, -10, 0],
              scale: [0.8, 1.1, 0.9, 1.05, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
            whileHover={{
              scale: 1.2,
              rotate: 15,
              transition: { duration: 0.2 }
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Secondary layer with medium-sized floating elements */}
        {[...Array(8)].map((_, i) => {
          const randomIcon = driveIcons[Math.floor(Math.random() * driveIcons.length)];
          return (
            <motion.div
              key={`medium-${i}`}
              className={`absolute ${randomIcon.color} bg-white/4 backdrop-blur-sm p-3 rounded-lg shadow-md border border-white/8`}
              style={{
                left: `${Math.random() * 75 + 12.5}%`,
                top: `${Math.random() * 75 + 12.5}%`,
                zIndex: 2,
              }}
              initial={{ y: 0, opacity: 0, scale: 0.6, rotate: 90 }}
              animate={{
                y: [0, -25, -5, -35, 0],
                x: [0, -8, 12, -3, 0],
                opacity: [0, 0.7, 0.9, 0.6, 0.8],
                rotate: [90, 0, -8, 12, 0],
                scale: [0.6, 0.9, 1.1, 0.8, 1],
              }}
              transition={{
                duration: 7 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6 + 1,
              }}
            >
              {randomIcon.icon}
            </motion.div>
          );
        })}

        {/* Tertiary layer with smaller floating particles */}
        {[...Array(15)].map((_, i) => {
          const randomIcon = driveIcons[Math.floor(Math.random() * driveIcons.length)];
          return (
            <motion.div
              key={`small-${i}`}
              className={`absolute ${randomIcon.color} bg-white/3 backdrop-blur-sm p-2 rounded-md shadow-sm`}
              style={{
                left: `${Math.random() * 85 + 7.5}%`,
                top: `${Math.random() * 85 + 7.5}%`,
                fontSize: `${Math.random() * 8 + 12}px`,
                zIndex: 1,
              }}
              initial={{ y: 0, opacity: 0, scale: 0.3 }}
              animate={{
                y: [0, -50, -20, -60, 0],
                x: [0, 15, -10, 8, 0],
                opacity: [0, 0.4, 0.7, 0.3, 0.5],
                rotate: [0, 180, 90, 270, 360],
                scale: [0.3, 0.6, 0.8, 0.4, 0.7],
              }}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3 + 2,
              }}
            >
              {randomIcon.icon}
            </motion.div>
          );
        })}

        {/* Ambient floating orbs for additional depth */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              zIndex: 0,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0.1, 0.4, 0.2],
              scale: [0, 1.2, 0.8, 1.5, 1],
              x: [0, 20, -15, 25, 0],
              y: [0, -30, -10, -40, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}