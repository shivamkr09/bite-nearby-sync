
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrder } from "@/contexts/OrderContext";
import { MenuItemType } from "@/types/models";

interface MenuItemCardProps {
  item: MenuItemType;
  restaurantId: string;
}

const MenuItemCard = ({ item, restaurantId }: MenuItemCardProps) => {
  const { name, description, price, is_available } = item;
  const { addToCart } = useOrder();

  const handleAddToCart = () => {
    addToCart(item, restaurantId);
  };

  return (
    <Card className={`overflow-hidden ${!is_available ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-base mb-1 text-left">{name}</h3>
            <p className="text-muted-foreground text-sm mb-2 text-left line-clamp-2">{description}</p>
            <p className="font-semibold text-primary">${price.toFixed(2)}</p>
          </div>
          <div className="ml-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!is_available}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
