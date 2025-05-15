import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemType } from "@/types/models";
import MenuItemForm from "./MenuItemForm";
import MenuItemCard from "./MenuItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

interface MenuManagementProps {
  restaurantId: string;
}

const MenuManagement = ({ restaurantId }: MenuManagementProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category', { ascending: true });
      
      if (error) throw error;
      
      setMenuItems(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      setCategories(uniqueCategories);
      
      if (uniqueCategories.length > 0 && activeCategory === 'all') {
        setActiveCategory('all');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch menu items"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = "name,description,price,category,is_available,image_url";
    const templateData = "Burger,Delicious beef burger,10.99,Main,true,\nFries,Crispy fries,4.99,Sides,true,";
    const csvContent = `${templateHeaders}\n${templateData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const nameIndex = headers.indexOf('name');
        const descriptionIndex = headers.indexOf('description');
        const priceIndex = headers.indexOf('price');
        const categoryIndex = headers.indexOf('category');
        const isAvailableIndex = headers.indexOf('is_available');
        const imageUrlIndex = headers.indexOf('image_url');
        
        if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
          toast({
            variant: "destructive",
            title: "Invalid CSV format",
            description: "CSV must include name, price, and category columns"
          });
          setIsUploading(false);
          return;
        }
        
        const menuItems = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const columns = rows[i].split(',');
          
          // Ensure all required fields are provided and properly typed
          const name = columns[nameIndex].trim();
          const price = parseFloat(columns[priceIndex]);
          const category = columns[categoryIndex].trim();
          
          if (isNaN(price) || !name || !category) continue;
          
          const menuItem = {
            restaurant_id: restaurantId,
            name: name,
            price: price,
            category: category,
            description: descriptionIndex !== -1 ? columns[descriptionIndex].trim() : null,
            is_available: isAvailableIndex !== -1 ? columns[isAvailableIndex].toLowerCase() === 'true' : true,
            image_url: imageUrlIndex !== -1 && columns[imageUrlIndex] ? columns[imageUrlIndex].trim() : null
          };
          
          menuItems.push(menuItem);
        }
        
        if (menuItems.length === 0) {
          toast({
            variant: "destructive",
            title: "No valid items",
            description: "No valid menu items found in the CSV"
          });
          setIsUploading(false);
          return;
        }
        
        const { error } = await supabase
          .from('menu_items')
          .insert(menuItems);
        
        if (error) throw error;
        
        toast({
          title: "Upload successful",
          description: `${menuItems.length} menu items imported`
        });
        
        // Refresh menu items
        fetchMenuItems();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading menu items:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not upload menu items"
      });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleSaveMenuItem = async (menuItem: Partial<MenuItemType>) => {
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            category: menuItem.category,
            is_available: menuItem.is_available,
            image_url: menuItem.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        toast({
          title: "Item updated",
          description: `${menuItem.name} has been updated`
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert({
            ...menuItem,
            restaurant_id: restaurantId
          });
        
        if (error) throw error;
        
        toast({
          title: "Item added",
          description: `${menuItem.name} has been added to your menu`
        });
      }
      
      // Refresh menu items
      fetchMenuItems();
      setIsAddingItem(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save menu item"
      });
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Item deleted",
        description: "Menu item has been deleted"
      });
      
      // Refresh menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete menu item"
      });
    }
  };

  const handleEditMenuItem = (item: MenuItemType) => {
    setEditingItem(item);
    setIsAddingItem(true);
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !isAvailable })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Availability updated",
        description: `Item is now ${!isAvailable ? 'available' : 'unavailable'}`
      });
      
      // Refresh menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update item availability"
      });
    }
  };

  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6">
      {isAddingItem ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuItemForm 
              initialValues={editingItem || undefined}
              onSubmit={handleSaveMenuItem}
              onCancel={() => {
                setIsAddingItem(false);
                setEditingItem(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">Bulk Import Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    Download our template CSV file, fill it with your menu items, and upload it back to update your menu.
                  </p>
                  <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
                    Download Template
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Menu CSV</label>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    "Upload & Update Menu"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">Manage Menu Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Manually add, edit, or remove menu items. Toggle availability to temporarily hide items.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setIsAddingItem(true)} 
                  className="w-full"
                  variant="default"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Menu Item
                </Button>
              </CardFooter>
            </Card>
          </div>

          {menuItems.length > 0 ? (
            <div className="space-y-4">
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
                <div className="overflow-x-auto pb-2">
                  <TabsList>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <TabsContent value={activeCategory}>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredMenuItems.map((item) => (
                      <MenuItemCard 
                        key={item.id}
                        menuItem={item} 
                        onEdit={handleEditMenuItem}
                        onDelete={handleDeleteMenuItem}
                        onToggleAvailability={handleToggleAvailability}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No menu items found.</p>
                  <Button onClick={() => setIsAddingItem(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Menu Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MenuManagement;
