
// Fix specific parts of the fetchVendorRestaurants function to properly type restaurant data
export const fetchVendorRestaurants = async () => {
  if (!user) return;
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', user.id);
    
    if (error) throw error;
    
    // Ensure all fields from RestaurantType are present with proper null values
    const completeRestaurants: RestaurantType[] = data.map((restaurant: any) => ({
      id: restaurant.id,
      created_at: restaurant.created_at,
      name: restaurant.name,
      description: restaurant.description || null,
      address: restaurant.address || null,
      city: restaurant.city || null,
      state: restaurant.state || null,
      zip_code: restaurant.zip_code || null,
      phone_number: restaurant.phone_number || null,
      website: restaurant.website || null,
      owner_id: restaurant.owner_id,
      image_url: restaurant.image_url || null,
      cuisine_type: restaurant.cuisine_type || null,
      rating: restaurant.rating || null,
      number_of_ratings: restaurant.number_of_ratings || null,
      is_open: restaurant.is_open || false,
      opening_time: restaurant.opening_time || null,
      closing_time: restaurant.closing_time || null,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      updated_at: restaurant.updated_at
    }));
    
    setVendorRestaurants(completeRestaurants);
  } catch (error) {
    console.error("Error fetching vendor restaurants:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch your restaurants"
    });
  }
};

// Also fix the updateOrderStatus function to handle all valid status values
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    // Ensure status is valid according to OrderStatus type
    if (status === 'pending' as any) {
      // If 'pending' comes in, convert to a valid status
      status = 'new';
    }
    
    // Check if status is one of the allowed values for orders table
    let finalStatus: OrderStatus = status;
    
    // Map any status that doesn't exist in the database to an appropriate one
    if (status === 'preparing') finalStatus = 'cooking';
    if (status === 'cancelled' && !['new', 'confirmed', 'cooking', 'ready', 'dispatched', 'delivered'].includes(status)) {
      finalStatus = 'new'; // Default fallback
    }
    
    const { error } = await supabase
      .from('orders')
      .update({ status: finalStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Update local state with proper typing
    const updatedOrders = vendorOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: finalStatus,
          updated_at: new Date().toISOString()
        };
      }
      return order;
    });
    
    setVendorOrders(updatedOrders);
    
    toast({
      title: "Order updated",
      description: `Order status changed to ${finalStatus}`
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update order status"
    });
  }
};
