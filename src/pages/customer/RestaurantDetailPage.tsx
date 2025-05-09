
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, ShoppingCart } from "lucide-react";
import MenuItemCard from "@/components/customer/MenuItemCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useOrder } from "@/contexts/OrderContext";

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
      <div className="py-6">
        <div className="animate-pulse-light">
          <div className="h-40 bg-muted rounded-lg mb-4"></div>
          <div className="h-8 bg-muted rounded-lg w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded-lg w-1/2 mb-4"></div>
          <div className="h-10 bg-muted rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const { name, address, description, menu, categories, imageUrl, distance } = restaurantDetails;
  
  const filteredMenu = activeCategory 
    ? menu.filter(item => item.category === activeCategory)
    : menu;

  return (
    <div className="py-6">
      <Button
        variant="ghost"
        className="mb-4 pl-0 flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to restaurants
      </Button>
      
      <div className="relative h-40 md:h-64 w-full bg-muted rounded-lg overflow-hidden mb-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover" 
          />
        ) : null}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isOpen ? 'bg-success-500 text-white' : 'bg-destructive text-white'}`}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{address}</span>
          </div>
          {distance !== undefined && (
            <Badge variant="outline" className="font-normal">
              {distance.toFixed(2)} km away
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {!isOpen && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p className="font-medium">This restaurant is currently closed</p>
          <p className="text-sm">You can browse the menu but cannot place orders at this time</p>
        </div>
      )}
      
      {categories.length > 0 && (
        <Tabs value={activeCategory || categories[0]} className="mb-6">
          <TabsList className="overflow-x-auto flex w-full mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredMenu.length > 0 ? (
                filteredMenu.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    restaurantId={id || ''}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No items in this category
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {totalItems > 0 && id === currentRestaurantId && (
        <div className="fixed bottom-0 left-0 w-full bg-background border-t p-4 shadow-top">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">{totalItems} items in cart</span>
            </div>
            <Button onClick={() => navigate('/customer/cart')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
