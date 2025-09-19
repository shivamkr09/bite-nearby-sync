
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Crown,
  ChefHat
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mobileInputClasses, mobileButtonClasses, getTouchFriendlyProps, mobileSpacingClasses } from "@/lib/mobile-optimizations";

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"customer" | "vendor" | "admin">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signUp, isLoading } = useAuth();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 6,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
    return criteria;
  };

  const passwordCriteria = validatePassword(password);
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleNext = () => {
    setError("");
    
    if (step === 1) {
      if (!name.trim()) {
        setError("Please enter your full name");
        return;
      }
      if (name.trim().length < 2) {
        setError("Name must be at least 2 characters");
        return;
      }
    }
    
    if (step === 2) {
      if (!email) {
        setError("Please enter your email");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (!password) {
        setError("Please enter a password");
        return;
      }
      if (!isPasswordValid) {
        setError("Password must meet all criteria");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      console.log(`Signing up as ${userType} with email: ${email}, name: ${name}`);
      const userData = { name };
      await signUp(email, password, userType, userData);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during sign up");
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

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  };

  const userTypeOptions = [
    {
      id: "customer",
      title: "Customer",
      description: "Order food from nearby restaurants",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      popular: true
    },
    {
      id: "vendor",
      title: "Restaurant Owner",
      description: "Manage your restaurant and orders",
      icon: ChefHat,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage platform and users",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10 border-purple-500/20"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${mobileSpacingClasses.section}`}
    >
      {/* Progress Bar */}
      <motion.div 
        className={`${mobileSpacingClasses.gap}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </motion.div>

      {/* Step Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={step}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={mobileSpacingClasses.section}
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">What's your name?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">This will be displayed on your profile</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                  className="relative"
                >
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    className={`${mobileInputClasses} pl-10 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 touch-manipulation`}
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </motion.div>
                {name && name.length < 2 && (
                  <p className="text-sm text-amber-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Name must be at least 2 characters
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={mobileSpacingClasses.section}
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">Account Credentials</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Secure your account with email and password</p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
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
                    className={`${mobileInputClasses} pl-10 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 touch-manipulation`}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
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
                    placeholder="Create a password"
                    className={`${mobileInputClasses} pl-10 pr-10 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 touch-manipulation`}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </motion.div>

                {/* Password Criteria */}
                {password && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
                      <div className={`flex items-center space-x-1 ${passwordCriteria.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.length ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>6+ characters</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordCriteria.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.lowercase ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>Lowercase</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordCriteria.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.uppercase ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>Uppercase</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordCriteria.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.number ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span>Number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'confirmPassword' ? 'focused' : 'unfocused'}
                  className="relative"
                >
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    className={`${mobileInputClasses} pl-10 pr-10 bg-white/5 border-white/20 placeholder:text-muted-foreground/50 focus:bg-white/10 touch-manipulation`}
                    required
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 touch-manipulation"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </motion.div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-sm text-green-500 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={mobileSpacingClasses.section}
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">Choose Account Type</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Select the type of account you want to create</p>
              </div>

              <div className="space-y-3">
                {userTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = userType === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label
                        htmlFor={option.id}
                        className={`relative flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 touch-manipulation ${
                          isSelected 
                            ? `${option.bgColor} border-primary` 
                            : 'border-white/20 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <RadioGroup value={userType} onValueChange={(value) => setUserType(value as "customer" | "vendor" | "admin")}>
                          <RadioGroupItem value={option.id} id={option.id} className="hidden" />
                        </RadioGroup>
                        
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${option.color}`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-sm sm:text-base truncate">{option.title}</h4>
                            {option.popular && (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{option.description}</p>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </label>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-3 sm:space-x-4">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className={`${mobileButtonClasses.medium} border-white/20 bg-white/5 hover:bg-white/10 flex items-center touch-manipulation`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        
        <div className="flex-1" />
        
        {step < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            className={`${mobileButtonClasses.medium} bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 touch-manipulation`}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className={`${mobileButtonClasses.medium} bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 touch-manipulation`}
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
                  <span className="hidden sm:inline">Creating account...</span>
                  <span className="sm:hidden">Creating...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create Account</span>
                  <span className="sm:hidden">Create</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SignUpForm;
