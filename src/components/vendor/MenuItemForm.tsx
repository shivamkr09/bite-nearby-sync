
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MenuItemType } from "@/types/models";

interface MenuItemFormProps {
  initialValues?: MenuItemType;
  onSubmit: (menuItem: Partial<MenuItemType>) => void;
  onCancel: () => void;
}

const MenuItemForm = ({ initialValues, onSubmit, onCancel }: MenuItemFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [originalPrice, setOriginalPrice] = useState(
    initialValues?.original_price?.toString() || ""
  );
  const [category, setCategory] = useState(initialValues?.category || "");
  const [isAvailable, setIsAvailable] = useState(initialValues?.is_available ?? true);
  const [imageUrl, setImageUrl] = useState(initialValues?.image_url || "");

  // Calculate marked up price for display
  const calculateMarkedUpPrice = (price: number) => {
    return (price * 1.02 + 3).toFixed(2);
  };

  const originalPriceNum = parseFloat(originalPrice) || 0;
  const markedUpPrice = originalPriceNum > 0 ? calculateMarkedUpPrice(originalPriceNum) : "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !originalPrice || !category) {
      return;
    }

    onSubmit({
      name,
      description,
      original_price: parseFloat(originalPrice),
      category,
      is_available: isAvailable,
      image_url: imageUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Margherita Pizza"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your menu item..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Your Price (₹) *</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-muted-foreground">
            This is the price you'll receive
          </p>
        </div>

        <div className="space-y-2">
          <Label>Customer Price (₹)</Label>
          <div className="p-2 bg-muted rounded text-sm">
            ₹{markedUpPrice}
          </div>
          <p className="text-xs text-muted-foreground">
            Includes 2% platform fee + ₹3 admin fee
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Main Course, Appetizer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isAvailable"
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
        />
        <Label htmlFor="isAvailable">Available for ordering</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialValues ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
