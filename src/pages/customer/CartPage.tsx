
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    clearCart, 
    currentRestaurantId, 
    sendAvailabilityRequest, 
    availabilityResponse 
  } = useOrder();
  
  const [estimatedTimeQuery, setEstimatedTimeQuery] = useState("How long will my order take?");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    setIsCheckingAvailability(true);
    try {
      await sendAvailabilityRequest(estimatedTimeQuery);
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!address || !phone) return;
    
    setIsPlacingOrder(true);
    try {
      // await useOrder().placeOrder(address, phone);
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

      if (!res){
        alert('Razropay failed to load!!')
        return 
      }

      const data = await fetch('/api/functions/v1/razorpay-payment-handler', {
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

      console.log(data)

    const options = {
      "key": "rzp_test_s5u7dIraqdLSFW", // Enter the Key ID generated from the Dashboard
      "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Acme Corp",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url":"http://localhost:1769/verify",
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      }
  };
  const paymentObject = new window.Razorpay(options); 
  paymentObject.open();
      
      setShowCheckoutDialog(false);
      navigate('/customer/orders');
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
