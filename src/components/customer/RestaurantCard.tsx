
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RestaurantType } from "@/types/models";
import { MapPin, Clock, Star, ChefHat, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mobileTextClasses } from "@/lib/mobile-optimizations";
import { useState } from "react";

const RestaurantCard = ({ restaurant }: { restaurant: RestaurantType }) => {
  const { id, name, address, description, image_url, distance, is_open, rating } = restaurant;
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-purple-600/20 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <Card className="relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl border border-white/20 dark:border-gray-700/20">
        <Link to={`/customer/restaurants/${id}`} className="block">
          <div className="relative h-56 w-full overflow-hidden">
            {image_url ? (
              <motion.img 
                src={image_url} 
                alt={name} 
                className="h-full w-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 flex items-center justify-center relative">
                <motion.div
                  animate={{ 
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? 1.2 : 1 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <ChefHat className="h-16 w-16 text-primary/60" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            )}
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            
            {/* Floating action buttons */}
            <motion.div 
              className="absolute top-4 right-4 flex flex-col gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Favorite button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-200 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
                  }`} 
                />
              </motion.button>
              
              {/* Status badge */}
              <Badge 
                variant={is_open ? "default" : "destructive"}
                className={`
                  font-semibold shadow-lg backdrop-blur-md border
                  ${is_open 
                    ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border-emerald-400/50' 
                    : 'bg-red-500/90 hover:bg-red-600 text-white border-red-400/50'
                  }
                `}
              >
                <Clock className="h-3 w-3 mr-1" />
                {is_open ? 'Open' : 'Closed'}
              </Badge>
            </motion.div>

            {/* Rating badge */}
            {rating && (
              <motion.div 
                className="absolute top-4 left-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
              >
                <Badge className="bg-amber-500/90 hover:bg-amber-600 text-white font-bold shadow-lg backdrop-blur-md border border-amber-400/50">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {rating.toFixed(1)}
                </Badge>
              </motion.div>
            )}

            {/* Distance badge */}
            {distance !== undefined && distance < 50 && (
              <motion.div 
                className="absolute bottom-4 left-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-medium">
                  <MapPin className="h-3 w-3 mr-1" />
                  {distance.toFixed(1)} km
                </Badge>
              </motion.div>
            )}
          </div>
          
          <CardContent className="p-6 space-y-4 relative">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 dark:to-gray-800/10 pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className={`${mobileTextClasses.subtitle} font-bold text-left group-hover:text-primary transition-colors duration-300 line-clamp-1`}>
                  {name}
                </h3>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-sm text-left line-clamp-2 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {description || "Delicious food awaits you at this amazing restaurant."}
              </motion.p>
              
              <motion.div 
                className="flex items-center text-sm text-muted-foreground/80"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span className="truncate">{address}</span>
              </motion.div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-4 bg-gradient-to-r from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 backdrop-blur-sm border-t border-white/10 dark:border-gray-700/20">
            <motion.div 
              className="flex justify-between items-center w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-primary">
                  View Menu
                </span>
                {distance !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    • {distance.toFixed(1)} km away
                  </span>
                )}
              </div>
              
              <motion.div
                className="p-2 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                animate={{ 
                  x: isHovered ? 5 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ArrowRight className="h-4 w-4 text-primary group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </motion.div>
          </CardFooter>
        </Link>

        {/* Quick action overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute bottom-6 left-6 right-6 flex gap-2 pointer-events-auto">
                <Button
                  size="sm"
                  className="flex-1 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle quick order
                  }}
                >
                  Quick Order
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-primary/20 backdrop-blur-md text-white border border-primary/30 hover:bg-primary/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle view details
                  }}
                >
                  Details
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
