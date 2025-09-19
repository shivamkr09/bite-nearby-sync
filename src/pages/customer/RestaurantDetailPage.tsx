
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ArrowLeft, 
  ShoppingCart, 
  Clock, 
  Star, 
  Heart,
  Share2,
  ChefHat,
  Utensils,
  Phone,
  Timer
} from "lucide-react";
import MenuItemCard from "@/components/customer/MenuItemCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useOrder } from "@/contexts/OrderContext";
import { RestaurantDetailsType } from "@/types/models";
import { motion, AnimatePresence } from "framer-motion";

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurantDetails, fetchRestaurantDetails, isRestaurantOpen } = useRestaurant();
  const { cart, currentRestaurantId } = useOrder();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const isOpen = id ? isRestaurantOpen(id) : false;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  useEffect(() => {
    if (id) {
      fetchRestaurantDetails(id);
    }
  }, [id, fetchRestaurantDetails]);
  
  useEffect(() => {
    if (restaurantDetails?.categories?.length > 0 && !activeCategory) {
      setActiveCategory(restaurantDetails.categories[0]);
    }
  }, [restaurantDetails, activeCategory]);
  
  if (!restaurantDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 relative">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header Skeleton */}
            <div className="flex items-center mb-6">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Hero Image Skeleton */}
            <div className="relative h-64 md:h-80 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Restaurant Info Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
            </div>
            
            {/* Menu Skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  const { name, address, description, menu_items, categories, image_url, distance } = restaurantDetails;
  // Use menu_items as menu if menu is not defined
  const menu = restaurantDetails.menu || menu_items || [];
  
  const filteredMenu = activeCategory 
    ? menu.filter(item => item.category === activeCategory)
    : menu;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 relative">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-6 pl-0 flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to restaurants
          </Button>
        </motion.div>
        
        {/* Hero Section */}
        <motion.div 
          className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {image_url ? (
            <div className="relative h-full w-full">
              <img 
                src={image_url} 
                alt={name} 
                className="h-full w-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-white/60" />
            </div>
          )}
          
          {/* Restaurant Status Badge */}
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge 
              className={`px-4 py-2 text-sm font-semibold backdrop-blur-sm border-0 shadow-lg ${
                isOpen 
                  ? 'bg-emerald-500/90 text-white' 
                  : 'bg-red-500/90 text-white'
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="absolute top-4 left-4 flex gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/20 border-white/20 text-white hover:bg-white/30"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/20 border-white/20 text-white hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </motion.div>
          
          {/* Restaurant Info Overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
            <div className="flex flex-wrap gap-4 items-center text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{address}</span>
              </div>
              {distance !== undefined && (
                <Badge variant="secondary" className="bg-white/20 border-white/20 text-white backdrop-blur-sm">
                  {distance.toFixed(2)} km away
                </Badge>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span>4.5 (120+ reviews)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Restaurant Details */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-0">
            <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
            
            {/* Restaurant Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <Timer className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">25-35 min</p>
                <p className="text-xs text-muted-foreground">Delivery</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                <Star className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">4.5 Rating</p>
                <p className="text-xs text-muted-foreground">120+ reviews</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Utensils className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">{menu.length} Items</p>
                <p className="text-xs text-muted-foreground">Menu</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <Phone className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Contact</p>
                <p className="text-xs text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Closed Restaurant Notice */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 p-6 rounded-2xl mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <p className="font-semibold">Restaurant Currently Closed</p>
              </div>
              <p className="text-sm">You can browse the menu but cannot place orders at this time. Check back during operating hours!</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Menu Section */}
        {categories && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Tabs value={activeCategory || categories[0]} className="mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Utensils className="h-6 w-6 mr-2" />
                  Our Menu
                </h2>
                <TabsList className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg p-1 h-auto flex-wrap justify-start">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <TabsTrigger 
                        value={category}
                        onClick={() => setActiveCategory(category)}
                        className="whitespace-nowrap px-4 py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                      >
                        {category}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </div>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredMenu.length > 0 ? (
                      filteredMenu.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <MenuItemCard 
                            item={item} 
                            restaurantId={id || ''}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No items available in this category</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}
        
        {/* Floating Cart Button */}
        <AnimatePresence>
          {totalItems > 0 && id === currentRestaurantId && (
            <motion.div 
              className="fixed bottom-6 left-6 right-6 z-50"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''} in cart</p>
                    <p className="text-sm opacity-90">Ready to checkout?</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/customer/cart')}
                    className="bg-white text-orange-600 hover:bg-gray-50 shadow-lg"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
