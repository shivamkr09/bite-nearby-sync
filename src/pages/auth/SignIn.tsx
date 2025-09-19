
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignInForm from "@/components/auth/SignInForm";
import { GradientMesh, FloatingParticles, GlassCard } from "@/components/ui/animated-backgrounds";
import { mobileSpacingClasses, mobileButtonClasses } from "@/lib/mobile-optimizations";

const SignIn = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get access to your account instantly"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: Sparkles,
      title: "Personalized",
      description: "Tailored recommendations just for you"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <GradientMesh />
      <FloatingParticles />
      
      {/* Navigation */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className={`${mobileButtonClasses.small} hover:bg-white/10 text-xs sm:text-sm`}>
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to</span> Home
            </Button>
          </Link>
          <Link to="/" className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Bite<span className="text-foreground">Nearby</span>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="sm" className={`${mobileButtonClasses.small} border-white/20 bg-white/5 hover:bg-white/10 text-xs sm:text-sm`}>
              Sign Up
            </Button>
          </Link>
        </div>
      </motion.header>

      <div className="flex min-h-screen pt-16 sm:pt-20">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg space-y-8 relative z-10"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Welcome back to
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  BiteNearby
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Sign in to discover amazing restaurants near you, check real-time availability, 
                and enjoy seamless food ordering experience.
              </motion.p>
            </div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/20 to-purple-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center space-x-4 pt-8"
            >
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                ].map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`User ${index + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-background"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">10,000+ happy customers</div>
                <div className="text-muted-foreground">Already using BiteNearby</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <GlassCard className={`${mobileSpacingClasses.container}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-6 sm:mb-8 lg:hidden"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Sign In</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Enter your credentials to access your account
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <SignInForm />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center"
              >
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <motion.div 
        className="lg:hidden absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BiteNearby
            </span>
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
