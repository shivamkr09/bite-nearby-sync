
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RestaurantType } from "@/types/models";
import { MapPin } from "lucide-react";

const RestaurantCard = ({ restaurant }: { restaurant: RestaurantType }) => {
  const { id, name, address, description, image_url, distance, is_open, rating } = restaurant;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/customer/restaurants/${id}`}>
        <div className="relative h-40 w-full bg-secondary">
          {image_url && (
            <img 
              src={image_url} 
              alt={name} 
              className="h-full w-full object-cover" 
            />
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${is_open ? 'bg-success-500 text-white' : 'bg-destructive text-white'}`}>
              {is_open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 text-left">{name}</h3>
            {rating && (
              <span className="flex items-center bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-sm font-medium">
                ★ {rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-2 text-left line-clamp-1">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{address}</span>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-2 border-t bg-secondary/50">
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-muted-foreground">
              {distance !== undefined && distance < 900 ? `${distance.toFixed(2)} km away` : ''}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default RestaurantCard;
