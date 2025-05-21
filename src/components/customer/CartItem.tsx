
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/order/OrderContext";
import { CartItemType } from "@/contexts/order/types";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { id, name, price, quantity } = item;
  const { updateQuantity, removeFromCart } = useOrder();

  // Ensure price is always a valid number for calculations
  const itemPrice = typeof price === 'number' ? price : 
                   typeof price === 'string' ? parseFloat(price) || 0 : 0;

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex-1">
        <h4 className="font-medium text-left">{name}</h4>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => updateQuantity(id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 min-w-[20px] text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => updateQuantity(id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-right">
            <span className="font-medium">${(itemPrice * quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 ml-2"
        onClick={() => removeFromCart(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
