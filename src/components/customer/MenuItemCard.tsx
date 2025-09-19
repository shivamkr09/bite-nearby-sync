
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/contexts/OrderContext";
import { MenuItemType } from "@/types/models";
import { motion } from "framer-motion";
import { Plus, Minus, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItemType;
  restaurantId: string;
}

const MenuItemCard = ({ item, restaurantId }: MenuItemCardProps) => {
  const { name, description, price, is_available } = item;
  const { addToCart } = useOrder();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      addToCart(item, restaurantId);
      setIsAdding(false);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={is_available ? { 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      className="group"
    >
      <Card className={`
        overflow-hidden transition-all duration-300 relative
        ${is_available 
          ? 'bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5' 
          : 'bg-gray-100/50 dark:bg-gray-800/30 opacity-60'
        }
        border-0 shadow-md
      `}>
        {!is_available && (
          <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Badge variant="secondary" className="bg-gray-600 text-white">
              <Clock className="h-3 w-3 mr-1" />
              Unavailable
            </Badge>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-lg text-left leading-tight group-hover:text-primary transition-colors duration-200">
                  {name}
                </h3>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-sm text-left line-clamp-2 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center text-primary font-bold text-lg">
                  <DollarSign className="h-4 w-4" />
                  <span>{price.toFixed(2)}</span>
                </div>
                
                {is_available && (
                  <Badge 
                    variant="outline" 
                    className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/20"
                  >
                    Available
                  </Badge>
                )}
              </motion.div>
            </div>
            
            <motion.div 
              className="shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <Button 
                onClick={handleAddToCart}
                disabled={!is_available || isAdding}
                variant={is_available ? "default" : "secondary"}
                size="sm"
                className={`
                  relative overflow-hidden font-medium transition-all duration-200
                  ${is_available 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                <motion.div
                  className="flex items-center gap-2"
                  animate={isAdding ? { scale: [1, 0.9, 1] } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {isAdding ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="whitespace-nowrap">
                    {isAdding ? 'Adding...' : 'Add to cart'}
                  </span>
                </motion.div>
                
                {/* Animated background for success state */}
                {isAdding && (
                  <motion.div
                    className="absolute inset-0 bg-emerald-500"
                    initial={{ scale: 0, borderRadius: "50%" }}
                    animate={{ scale: 2, borderRadius: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard;
