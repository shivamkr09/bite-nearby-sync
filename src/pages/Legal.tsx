import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileCheck, 
  Lock, 
  AlertTriangle, 
  Mail, 
  Clock, 
  Phone,
  Scale,
  Users,
  DollarSign,
  RefreshCw
} from "lucide-react";

const Legal = () => {
  const legalSections = [
    {
      title: "Food Safety and FSSAI Compliance",
      icon: Shield,
      color: "emerald",
      content: "We are a marketplace platform connecting customers with independent food businesses. All listed vendors are required to possess a valid FSSAI Registration/License and comply with Food Safety and Standards Act, 2006 and related regulations.",
      points: [
        "Vendors must provide their FSSAI Registration/License number and business details during onboarding.",
        "We may delist any vendor found operating without a valid FSSAI registration or in violation of hygiene norms.",
        "Ingredients, allergens, and veg/non-veg indications should be disclosed by vendors wherever applicable."
      ]
    },
    {
      title: "Consumer Protection and Grievance Redressal",
      icon: Users,
      color: "blue",
      content: "In line with the Consumer Protection (E-Commerce) Rules, 2020, we provide a grievance mechanism for users. We acknowledge complaints within 48 hours and aim to resolve them within 30 days.",
      contacts: {
        officer: "Designated Officer",
        email: "support@example.com",
        hours: "10:00–18:00 IST, Mon–Fri"
      }
    },
    {
      title: "Data and Privacy",
      icon: Lock,
      color: "purple",
      content: "We collect only necessary information to provide our services. User data is handled per applicable laws, including the Digital Personal Data Protection Act, 2023. See our Privacy Policy for details."
    },
    {
      title: "Refunds, Cancellations, and Pricing Transparency",
      icon: DollarSign,
      color: "amber",
      content: "Clear and transparent policies for financial transactions and order management.",
      points: [
        "Prices, taxes, and fees are shown before payment. Final charges are confirmed at checkout.",
        "Refunds/cancellations follow our platform policy and vendor-specific terms where applicable.",
        "For packaged foods, Legal Metrology requirements (e.g., MRP) apply to vendor listings."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Legal, Compliance & Safety
              </motion.h1>
              <motion.p 
                className="text-blue-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Comprehensive legal framework ensuring food safety, consumer protection, and regulatory compliance across our platform.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <FileCheck className="h-5 w-5 mr-2" />
                Download Policy
              </Button>
              <Link to="/report-issue">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg w-full">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {legalSections.map((section, index) => {
            const Icon = section.icon;
            const colorClasses = {
              emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
              blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
              amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            };

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p className="leading-relaxed">
                      {section.content}
                    </p>
                    
                    {section.points && (
                      <ul className="space-y-2 pl-2">
                        {section.points.map((point, pointIndex) => (
                          <motion.li 
                            key={pointIndex}
                            className="flex items-start space-x-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (pointIndex * 0.1) }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    
                    {section.contacts && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">Grievance Officer:</span>
                          <span>{section.contacts.officer}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">Email:</span>
                          <a href={`mailto:${section.contacts.email}`} className="text-primary hover:underline">
                            {section.contacts.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">Working hours:</span>
                          <span>{section.contacts.hours}</span>
                        </div>
                        <Link to="/report-issue" className="block pt-2">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report Food Safety or Order Issue
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Information Section */}
        <motion.div 
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Scale className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Regulatory Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Full compliance with Indian food safety laws, consumer protection regulations, and digital commerce guidelines.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Regular Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Our policies are regularly reviewed and updated to reflect changing regulations and industry best practices.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Phone className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">24/7 Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Round-the-clock customer support for urgent food safety concerns and emergency issues.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;
