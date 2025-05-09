
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AvailabilityRequestType } from "@/contexts/OrderContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { formatDistanceToNow } from "date-fns";

interface AvailabilityRequestCardProps {
  request: AvailabilityRequestType;
}

const AvailabilityRequestCard = ({ request }: AvailabilityRequestCardProps) => {
  const [estimatedTime, setEstimatedTime] = useState("30-45 minutes");
  const [isAvailable, setIsAvailable] = useState(true);
  const { respondToAvailabilityRequest } = useRestaurant();

  const handleRespond = () => {
    respondToAvailabilityRequest(request.id, estimatedTime, isAvailable);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Availability Request</CardTitle>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Customer</h4>
          <p className="text-sm">{request.customerName}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Items</h4>
          <ul className="space-y-1 mt-1 text-sm">
            {request.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Customer asks</h4>
          <p className="text-sm italic">"{request.estimatedTimeQuery}"</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Estimated Time</label>
          <Input
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g. 30-45 minutes"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 w-full">
          <Button 
            className="flex-1" 
            onClick={handleRespond}
            variant="default"
          >
            Confirm Availability
          </Button>
          <Button 
            className="flex-1" 
            onClick={() => {
              setIsAvailable(false);
              handleRespond();
            }}
            variant="outline"
          >
            Items Unavailable
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AvailabilityRequestCard;
