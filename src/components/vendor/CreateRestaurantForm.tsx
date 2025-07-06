import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { MapPin } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  latitude: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRestaurantFormProps {
  onSuccess: () => void;
}

const CreateRestaurantForm = ({ onSuccess }: CreateRestaurantFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  const { createRestaurant } = useRestaurant();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      latitude: "",
      longitude: "",
      imageUrl: "",
    },
  });

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      form.setValue('latitude', latitude.toString());
      form.setValue('longitude', longitude.toString());

      toast({
        title: "Location detected",
        description: "Coordinates have been filled automatically."
      });
    } catch (error: any) {
      console.error('Error getting location:', error);
      toast({
        variant: "destructive",
        title: "Location error",
        description: error.message || "Failed to get current location"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await createRestaurant({
        name: data.name,
        address: data.address,
        description: data.description,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        image_url: data.imageUrl || null,
      });
      
      toast({
        title: "Restaurant created",
        description: `${data.name} has been successfully created.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        variant: "destructive",
        title: "Failed to create restaurant",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter restaurant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter restaurant address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter restaurant description" 
                  {...field}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Location</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isGettingLocation ? "Getting location..." : "Get Current Location"}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 51.5074" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., -0.1278" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Restaurant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateRestaurantForm;
