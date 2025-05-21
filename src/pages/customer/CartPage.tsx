
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import CartItem from "@/components/customer/CartItem";
import { useOrder } from "@/contexts/OrderContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";


declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    cart, 
    clearCart, 
    currentRestaurantId, 
    sendAvailabilityRequest, 
    availabilityResponse,
    placeOrder
  } = useOrder();
  
  const [estimatedTimeQuery, setEstimatedTimeQuery] = useState("How long will my order take?");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Ensure prices are properly calculated
  const total = cart.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  function loadScript(src:any) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  
  const handleCheckAvailability = async () => {
    if (!currentRestaurantId) {
      toast({
        variant: "destructive",
        title: "No restaurant selected",
        description: "Please select a restaurant first"
      });
      return;
    }
    
    setIsCheckingAvailability(true);
    try {
      await sendAvailabilityRequest(estimatedTimeQuery);
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not check availability"
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both delivery address and phone number"
      });
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

      if (!res){
        alert('Razropay failed to load!!');
        setIsPlacingOrder(false);
        return 
      }
      let isProd=import.meta.env.VITE_ENV === 'production';
      const prodUrl = 'https://msfzehtlunkptuegwukh.supabase.co/functions/v1/razorpay-payment-handler';
      const devUrl = '/api/functions/v1/razorpay-payment-handler';
      const actualUrl = isProd ? prodUrl : devUrl;

      const data = await fetch(`${actualUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: "5000",
          currency: "INR",
          receipt: "fffff",
          payment_capture: 1,
        }),
      }).then((t) => t.json());

     const {id} = data;

    const options = {
      "key": "rzp_test_s5u7dIraqdLSFW", // Enter the Key ID generated from the Dashboard
      "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "BiteNearBy",
      "description": "Test Transaction",
      "image": "https://res.cloudinary.com/dtoms8pva/image/upload/v1747807087/Screenshot_2025-05-21_112626_iql7r6.png",
      "order_id": id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      },
      handler: async function (response: any) {
        console.log(response);
         let isProd=import.meta.env.VITE_ENV === 'production';
      const prodUrl = 'https://msfzehtlunkptuegwukh.supabase.co/functions/v1/razorpay-payment-verification';
      const devUrl = '/razorpay-payment-verification';
      const actualUrl = isProd ? prodUrl : devUrl;
        // Verify payment on your backend
        const verifyRes = await fetch(`${actualUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        console.log(verifyData);
        if (verifyData.success) {
          // Place the order after successful payment verification
          // await useOrder().placeOrder(address, phone);
          await placeOrder(address, phone);
            setShowCheckoutDialog(false);
            navigate('/customer/orders');
            toast({
              title: "Order placed successfully!",
              description: "You can track your order status in the Orders page"
            });
          setShowCheckoutDialog(false);
          navigate('/customer/orders');
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      }
  };
  const paymentObject = new window.Razorpay(options); 
  paymentObject.open();
      
     
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: "Please try again later"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="py-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add items from restaurants to get started</p>
          <Button onClick={() => navigate('/customer/restaurants')}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="ghost" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-lg font-semibold">${total.toFixed(2)}</div>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Check Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="query">Ask about your order</Label>
                  <Input 
                    id="query"
                    value={estimatedTimeQuery}
                    onChange={(e) => setEstimatedTimeQuery(e.target.value)}
                    placeholder="How long will my order take?"
                    className="mt-1"
                  />
                </div>
                
                {availabilityResponse ? (
                  <div className={`p-4 rounded-md ${availabilityResponse.isAvailable ? 'bg-success-50 border border-success-200' : 'bg-destructive/10'}`}>
                    <h4 className="font-medium mb-1">
                      {availabilityResponse.isAvailable 
                        ? 'All items are available!' 
                        : 'Some items are unavailable'}
                    </h4>
                    <p className="text-sm">
                      {availabilityResponse.isAvailable 
                        ? `Estimated time: ${availabilityResponse.estimatedTime}` 
                        : 'The restaurant cannot fulfill your order at this time.'}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleCheckAvailability}
                    disabled={isCheckingAvailability}
                    className="w-full"
                  >
                    {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                  </Button>
                )}
              </CardContent>
              
              {availabilityResponse?.isAvailable && (
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowCheckoutDialog(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Enter your delivery information to complete your order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apartment 4B"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(total + 2.99).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCheckoutDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !address || !phone}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPage;
