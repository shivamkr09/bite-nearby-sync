
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  Smartphone, 
  Star, 
  ChefHat, 
  Truck, 
  Shield, 
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  TrendingUp,
  Globe
} from "lucide-react";
import { GradientMesh, FloatingParticles, GlassCard } from "@/components/ui/animated-backgrounds";
import { AnimatedCard, CardContainer } from "@/components/ui/animated-card";
import { useRef } from "react";
import { mobileTextClasses, mobileSpacingClasses, responsiveGrids, mobileButtonClasses } from "@/lib/mobile-optimizations";

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const features = [
    {
      icon: MapPin,
      title: "Smart Location Detection",
      description: "AI-powered location services find the best restaurants within 1km radius",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Real-time Availability",
      description: "Get instant updates on food availability before placing your order",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Smartphone,
      title: "One-tap Ordering",
      description: "Streamlined ordering process with just a few taps",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Truck,
      title: "Live Order Tracking",
      description: "Track your order in real-time from kitchen to your doorstep",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "500+", label: "Partner Restaurants", icon: ChefHat },
    { number: "50K+", label: "Orders Delivered", icon: Truck },
    { number: "4.9", label: "Average Rating", icon: Star }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Enthusiast",
      content: "BiteNearby has completely changed how I discover local restaurants. The real-time availability feature is a game-changer!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Restaurant Owner",
      content: "As a restaurant owner, BiteNearby helps us connect with nearby customers efficiently. The platform is intuitive and powerful.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Busy Professional",
      content: "Perfect for quick lunch orders during work hours. The availability check saves me so much time!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 5
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
        <div className={`container mx-auto ${mobileSpacingClasses.container} py-3 sm:py-4 flex justify-between items-center`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className={`font-bold ${mobileTextClasses.body} sm:text-xl md:text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`}>
              Bite<span className="text-foreground">Nearby</span>
            </Link>
          </motion.div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="hover:bg-white/10 text-sm sm:text-base px-2 sm:px-4">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-sm sm:text-base px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-16 sm:pb-32">
        <motion.div 
          style={{ y, opacity }}
          className={`container mx-auto ${mobileSpacingClasses.container} text-center relative z-10`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
          >
            <Badge className="bg-white/10 text-primary border-primary/20 mb-4 sm:mb-6 text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Now with Real-time Availability
            </Badge>
            
            <h1 className={`${mobileTextClasses.hero} font-bold leading-tight`}>
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Discover Food
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                That's Actually Available
              </span>
            </h1>
            
            <p className={`${mobileTextClasses.subtitle} text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0`}>
              Skip the disappointment. Check real-time availability, order from nearby restaurants, 
              and enjoy delicious meals delivered fresh to your door.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 sm:px-0">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className={`${mobileButtonClasses.primary} w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold group`}>
                  Start Ordering Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className={`${mobileButtonClasses.primary} w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 font-semibold group`}>
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image/Animation - Hidden on mobile for better performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-3/4 hidden xl:block"
        >
          <div className="relative w-full h-full">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center"
                alt="Food delivery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={mobileSpacingClasses.section}>
        <div className={`container mx-auto ${mobileSpacingClasses.container}`}>
          <CardContainer className={`grid ${responsiveGrids.stats} ${mobileSpacingClasses.gap}`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <AnimatedCard key={stat.label} delay={index * 0.1} enableHover>
                  <GlassCard className="p-4 sm:p-6 text-center">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 text-primary" />
                    <div className={`${mobileTextClasses.title} sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent`}>
                      {stat.number}
                    </div>
                    <div className={`${mobileTextClasses.caption} text-muted-foreground`}>{stat.label}</div>
                  </GlassCard>
                </AnimatedCard>
              );
            })}
          </CardContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${mobileSpacingClasses.section} relative z-10`}>
        <div className={`container mx-auto ${mobileSpacingClasses.container}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className={`${mobileTextClasses.title} font-bold mb-4 sm:mb-6`}>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Why Choose BiteNearby?
              </span>
            </h2>
            <p className={`${mobileTextClasses.subtitle} text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0`}>
              Experience the future of food delivery with cutting-edge technology and seamless user experience.
            </p>
          </motion.div>

          <CardContainer className={`grid ${responsiveGrids.features} ${mobileSpacingClasses.gap}`}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={feature.title} delay={index * 0.1} enableHover enableGlow>
                  <GlassCard className="p-6 sm:p-8 h-full">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-3 sm:p-4 mb-4 sm:mb-6`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className={`${mobileTextClasses.body} sm:text-xl font-bold mb-3 sm:mb-4`}>{feature.title}</h3>
                    <p className={`${mobileTextClasses.caption} text-muted-foreground`}>{feature.description}</p>
                  </GlassCard>
                </AnimatedCard>
              );
            })}
          </CardContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 -translate-y-1/2" />
            <div className="hidden md:block absolute top-1/2 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 -translate-y-1/2" />

            {[
              {
                step: "01",
                title: "Find Nearby Restaurants",
                description: "Enable location services to discover restaurants within 1km of your position with smart AI recommendations.",
                icon: MapPin,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "Check Real-time Availability",
                description: "Send instant availability requests to restaurants before placing your order to avoid disappointment.",
                icon: Clock,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Order & Track Delivery",
                description: "Place your order with confidence and track its progress in real-time until it reaches your door.",
                icon: Truck,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <GlassCard className="p-8 text-center relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} p-5 mx-auto mb-6`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
          </motion.div>

          <CardContainer className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={testimonial.name} delay={index * 0.1} enableHover>
                <GlassCard className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </CardContainer>
        </div>
      </section>

      {/* Restaurant CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-12 text-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="relative z-10">
                <ChefHat className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Grow Your Restaurant Business?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of restaurant owners who trust BiteNearby to connect with nearby customers 
                  and streamline their order management.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/restaurant-login">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8 py-4 text-lg font-semibold">
                      Register Your Restaurant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                    Learn More
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/50 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                BiteNearby
              </div>
              <p className="text-muted-foreground">
                Connecting hungry customers with nearby restaurants through smart technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link to="/legal" className="block hover:text-primary transition-colors">Legal & Compliance</Link>
                <Link to="/fssai-guide" className="block hover:text-primary transition-colors">FSSAI Registration</Link>
                <Link to="/report-issue" className="block hover:text-primary transition-colors">Report Issue</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Support</div>
                <div>Community</div>
                <div>Newsletter</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BiteNearby. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
