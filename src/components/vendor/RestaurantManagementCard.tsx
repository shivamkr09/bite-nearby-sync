
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Label } from "@/components/ui/label";
import { RestaurantType } from "@/types/supabase";

interface RestaurantManagementCardProps {
  restaurant: RestaurantType;
}

const RestaurantManagementCard = ({ restaurant }: RestaurantManagementCardProps) => {
  const [isOpen, setIsOpen] = useState(restaurant.is_open);
  const { updateRestaurantStatus } = useRestaurant();

  const handleStatusChange = (checked: boolean) => {
    setIsOpen(checked);
    updateRestaurantStatus(restaurant.id, checked);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 bg-secondary rounded-md overflow-hidden">
          {restaurant.image_url ? (
            <img 
              src={restaurant.image_url} 
              alt={restaurant.name} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Address</h4>
          <p className="text-sm text-muted-foreground">{restaurant.address}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Description</h4>
          <p className="text-sm text-muted-foreground">{restaurant.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id={`restaurant-status-${restaurant.id}`} 
            checked={isOpen}
            onCheckedChange={handleStatusChange}
          />
          <Label htmlFor={`restaurant-status-${restaurant.id}`} className="font-medium">
            {isOpen ? 'Restaurant is Open' : 'Restaurant is Closed'}
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Edit Details</Button>
        <Button>Manage Menu</Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantManagementCard;
