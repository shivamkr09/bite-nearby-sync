import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Utensils, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientMesh, FloatingParticles } from "@/components/ui/animated-backgrounds";
import { mobileTextClasses, mobileButtonClasses, mobileSpacingClasses } from "@/lib/mobile-optimizations";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <GradientMesh />
      <FloatingParticles />

      <div className={`text-center ${mobileSpacingClasses.container} relative z-10 max-w-2xl mx-auto`}>
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <h1 className={`${mobileTextClasses.hero} font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4`}>
              404
            </h1>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"
            >
              <Utensils className="w-20 h-20 sm:w-32 sm:h-32 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={mobileSpacingClasses.section}
        >
          <h2 className={`${mobileTextClasses.title} font-bold text-foreground mb-3 sm:mb-4`}>
            Oops! Page Not Found
          </h2>
          
          <p className={`${mobileTextClasses.body} text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed`}>
            The page you're looking for seems to have gone missing, just like a delivery driver who took a wrong turn. 
            Don't worry, we'll help you find your way back to delicious food!
          </p>
        </motion.div>

        {/* Fun Food-Related Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base font-medium text-foreground">
              Looking for something tasty?
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            While you're here, maybe it's time to discover some new restaurants near you!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link to="/">
            <Button 
              className={`${mobileButtonClasses.large} bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto`}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className={`${mobileButtonClasses.large} border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 sm:mt-16 flex justify-center space-x-4 sm:space-x-8"
        >
          {[
            { icon: "🍕", delay: 0 },
            { icon: "🍔", delay: 0.2 },
            { icon: "🍜", delay: 0.4 },
            { icon: "🥗", delay: 0.6 },
            { icon: "🍰", delay: 0.8 }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1.2 + item.delay,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="text-2xl sm:text-3xl opacity-60"
            >
              {item.icon}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
