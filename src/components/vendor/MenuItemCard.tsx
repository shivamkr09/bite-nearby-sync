
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItemType } from "@/types/models";
import { Switch } from "@/components/ui/switch";

interface MenuItemCardProps {
  menuItem: MenuItemType;
  onEdit: (menuItem: MenuItemType) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

const MenuItemCard = ({ menuItem, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) => {
  const { id, name, description, price, category, is_available } = menuItem;

  return (
    <Card className={`overflow-hidden ${!is_available ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-base">{name}</h3>
              <p className="font-semibold text-primary">${Number(price).toFixed(2)}</p>
            </div>
            <p className="text-muted-foreground text-sm mb-1 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="bg-secondary text-xs font-medium py-1 px-2 rounded-md">
                {category}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{is_available ? 'Available' : 'Hidden'}</span>
                <Switch 
                  checked={!!is_available} 
                  onCheckedChange={() => onToggleAvailability(id, !!is_available)} 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => onEdit(menuItem)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
