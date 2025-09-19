
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Filter, SlidersHorizontal, Clock, Star } from "lucide-react";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { useLocation } from "@/contexts/LocationContext";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mobileButtonClasses, mobileTextClasses, mobileSpacingClasses } from "@/lib/mobile-optimizations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const RestaurantsPage = () => {
  const { userLocation, locationError, requestLocationPermission, isLoading: locationLoading } = useLocation();
  const { restaurants, fetchNearbyRestaurants, searchRestaurants, isLoading: restaurantsLoading } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">("distance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
  useEffect(() => {
    // Fetch restaurants on component mount - with or without location
    if (userLocation) {
      // Pass userLocation coordinates to fetchNearbyRestaurants
      fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
    } else {
      // Fetch all restaurants if location not available - pass undefined parameters
      fetchNearbyRestaurants();
    }
  }, [userLocation, fetchNearbyRestaurants]);
  
  // Handle text search
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      searchRestaurants(searchQuery);
    } else {
      // Reset to standard fetch if search is cleared
      if (userLocation) {
        fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
      } else {
        fetchNearbyRestaurants();
      }
    }
  };

  // Handle location search submission
  const handleLocationSearch = () => {
    if (locationSearchQuery.trim() !== "") {
      searchRestaurants(locationSearchQuery);
    }
  };

  // Filter restaurants by name/description and apply filters
  const filteredRestaurants = restaurants
    .filter(restaurant => {
      const matchesSearch = searchQuery
        ? restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (restaurant.description && restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      const matchesOpen = onlyOpen ? restaurant.is_open : true;
      const matchesRating = restaurant.rating ? restaurant.rating >= minRating : minRating === 0;
      
      return matchesSearch && matchesOpen && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "distance":
        default:
          return (a.distance || 999) - (b.distance || 999);
      }
    });

  const isAnyRestaurant = filteredRestaurants.length > 0;
  const isLoading = locationLoading || restaurantsLoading;

  return (
    <div className="py-6 relative">
      {/* Hero Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-6 sm:p-8 border border-white/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
          <div className="relative z-10">
            <h1 className={`${mobileTextClasses.title} font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3`}>
              Discover Amazing Restaurants
            </h1>
            
            {userLocation ? (
              <motion.div 
                className="flex items-center text-sm sm:text-base text-muted-foreground mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                <span>Showing restaurants near your location</span>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Find delicious food from restaurants around you
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button 
                    onClick={() => requestLocationPermission()} 
                    variant="outline"
                    disabled={locationLoading}
                    className={`${mobileButtonClasses.medium} bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 hover:bg-primary/10`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {locationLoading ? 'Detecting Location...' : 'Use My Location'}
                  </Button>
                  {locationError && (
                    <motion.p 
                      className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {locationError}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Search and Filter Section */}
      <motion.div 
        className={`${mobileSpacingClasses.section} mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 sm:p-6">
            {/* Location search */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by location or address..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/20 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  onClick={handleLocationSearch} 
                  disabled={isLoading}
                  className={`${mobileButtonClasses.medium} bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find
                </Button>
              </div>
              
              {/* Restaurant name search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search restaurants by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/20 backdrop-blur-sm"
                  />
                </div>
                
                {/* Filter Button */}
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`${mobileButtonClasses.medium} bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 hover:bg-primary/10`}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {(onlyOpen || minRating > 0) && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {(onlyOpen ? 1 : 0) + (minRating > 0 ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
                    <SheetHeader>
                      <SheetTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filter & Sort
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="space-y-6 py-6">
                      {/* Sort Options */}
                      <div>
                        <h3 className="font-medium mb-3">Sort by</h3>
                        <div className="space-y-2">
                          {[
                            { value: "distance", label: "Distance", icon: MapPin },
                            { value: "rating", label: "Rating", icon: Star },
                            { value: "name", label: "Name", icon: Filter }
                          ].map((option) => {
                            const Icon = option.icon;
                            return (
                              <Button
                                key={option.value}
                                variant={sortBy === option.value ? "default" : "outline"}
                                className="w-full justify-start"
                                onClick={() => setSortBy(option.value as any)}
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                {option.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Filter Options */}
                      <div>
                        <h3 className="font-medium mb-3">Filters</h3>
                        <div className="space-y-4">
                          <Button
                            variant={onlyOpen ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setOnlyOpen(!onlyOpen)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Open now only
                          </Button>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Minimum Rating: {minRating || "Any"}
                            </label>
                            <div className="flex gap-2">
                              {[0, 3, 4, 4.5].map((rating) => (
                                <Button
                                  key={rating}
                                  variant={minRating === rating ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setMinRating(rating)}
                                >
                                  {rating === 0 ? "Any" : `${rating}+⭐`}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Clear Filters */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setOnlyOpen(false);
                          setMinRating(0);
                          setSortBy("distance");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Results Summary */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isAnyRestaurant 
                  ? `Found ${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''}`
                  : 'No restaurants found'
                }
              </p>
              {(onlyOpen || minRating > 0 || searchQuery) && (
                <div className="flex gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="text-xs">
                      "{searchQuery}"
                    </Badge>
                  )}
                  {onlyOpen && (
                    <Badge variant="secondary" className="text-xs">
                      Open now
                    </Badge>
                  )}
                  {minRating > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {minRating}+⭐
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Restaurant Grid */}
      {isLoading ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
            />
            <p className={`${mobileTextClasses.subtitle} font-medium text-foreground`}>
              Finding amazing restaurants...
            </p>
            <p className="text-sm text-muted-foreground mt-2">Please wait a moment</p>
          </div>
        </motion.div>
      ) : isAnyRestaurant ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer(0.08)}
          initial="initial"
          animate="animate"
        >
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className={`${mobileTextClasses.subtitle} font-bold text-foreground mb-3`}>
              No restaurants found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or clearing filters to see more results
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setLocationSearchQuery("");
                setOnlyOpen(false);
                setMinRating(0);
                if (userLocation) {
                  fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
                } else {
                  fetchNearbyRestaurants();
                }
              }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
            >
              Clear all and show all restaurants
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RestaurantsPage;
