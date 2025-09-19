
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { LogIn, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mobileInputClasses, mobileButtonClasses, getTouchFriendlyProps } from "@/lib/mobile-optimizations";
import GoogleLoginButton from "./GoogleLoginButton";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      borderColor: "hsl(var(--primary))",
      boxShadow: "0 0 0 3px hsl(var(--primary) / 0.1)",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      borderColor: "hsl(var(--border))",
      boxShadow: "0 0 0 0px transparent",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'email' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                className="pl-10 h-12 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 transition-all duration-200"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <motion.div
              variants={inputVariants}
              animate={focusedField === 'password' ? 'focused' : 'unfocused'}
              className="relative"
            >
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-12 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 transition-all duration-200"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold"
              disabled={isSubmitting || isLoading}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background/80 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </motion.div>

      {/* Google Login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <GoogleLoginButton />
      </motion.div>

      {/* Additional Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-4"
      >
        {/* Remember Me */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
        </div>

        {/* Demo Accounts */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-sm font-medium mb-2">Quick Demo Access</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail("customer@demo.com");
                setPassword("demo123");
              }}
              className="p-2 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("restaurant@demo.com");
                setPassword("demo123");
              }}
              className="p-2 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
            >
              Restaurant Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignInForm;
