
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, MapPin, Phone, Clock, CheckCircle, AlertCircle, Trash2, CreditCard, Loader2, Package, Shield, Receipt } from "lucide-react";
import CartItem from "@/components/customer/CartItem";
import { useOrder } from "@/contexts/OrderContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  
  // Calculate totals with marked up prices
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  
  function loadScript(src: any) {
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

      if (!res) {
        alert('Razorpay failed to load!!');
        setIsPlacingOrder(false);
        return 
      }
      
      let isProd = import.meta.env.VITE_ENV === 'production';
      const prodUrl = 'https://msfzehtlunkptuegwukh.supabase.co/functions/v1/razorpay-payment-handler';
      const devUrl = '/api/functions/v1/razorpay-payment-handler';
      const actualUrl = isProd ? prodUrl : devUrl;

      // Convert total to paise (multiply by 100)
      const amountInPaise = Math.round(total * 100);

      const data = await fetch(`${actualUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `order_${Date.now()}`,
          payment_capture: 1,
        }),
      }).then((t) => t.json());
      
      setShowCheckoutDialog(false);

      const { id } = data;

      const options = {
        "key": "rzp_test_s5u7dIraqdLSFW",
        "amount": amountInPaise,
        "currency": "INR",
        "name": "BiteNearBy",
        "description": "Food Order Payment",
        "image": "https://res.cloudinary.com/dtzsujhps/image/upload/t_Logo/v1747841549/ChatGPT_Image_May_21_2025_08_51_00_PM_lrukyz.png",
        "order_id": id,
        "notes": {
          "address": address,
          "phone": phone
        },
        "theme": {
          "color": "#3399cc"
        },
        handler: async function (response: any) {
          console.log(response);
          let isProd = import.meta.env.VITE_ENV === 'production';
          const prodUrl = 'https://msfzehtlunkptuegwukh.supabase.co/functions/v1/razorpay-payment-verification';
          const devUrl = '/razorpay-payment-verification';
          const actualUrl = isProd ? prodUrl : devUrl;
          
          // Verify payment on backend
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
            await placeOrder(address, phone);
            
            toast({
              title: "Payment successful!",
              description: `Order placed. Vendor gets ₹${verifyData.splits.vendor_amount}, Admin fee: ₹${verifyData.splits.admin_fee}`
            });
            
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              className="mb-6 pl-0 flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                <ShoppingCart className="h-16 w-16 text-orange-500" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Discover amazing restaurants and delicious food waiting for you
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={() => navigate('/customer/restaurants')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Package className="mr-2 h-5 w-5" />
                Browse Restaurants
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              className="mb-6 pl-0 flex items-center hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8 text-orange-500" />
              Your Cart
            </h1>
            <p className="text-muted-foreground">Review your order and proceed to checkout</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center">
                    <Package className="mr-2 h-5 w-5 text-orange-500" />
                    Order Items
                    <Badge variant="secondary" className="ml-auto">
                      {cart.length} item{cart.length > 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-lg">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="flex items-center hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Subtotal</div>
                    <div className="text-2xl font-bold text-orange-600">₹{subtotal.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      (Includes platform fees)
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Checkout Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Availability Check Card */}
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Check Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="query" className="text-sm font-medium">Ask about your order</Label>
                    <Input 
                      id="query"
                      value={estimatedTimeQuery}
                      onChange={(e) => setEstimatedTimeQuery(e.target.value)}
                      placeholder="How long will my order take?"
                      className="mt-2 bg-white/50 dark:bg-gray-800/50 border-gray-200/50"
                    />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {availabilityResponse ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl backdrop-blur-sm ${
                          availabilityResponse.isAvailable 
                            ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {availabilityResponse.isAvailable ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <h4 className="font-semibold">
                            {availabilityResponse.isAvailable 
                              ? 'All items are available!' 
                              : 'Some items are unavailable'}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {availabilityResponse.isAvailable 
                            ? `Estimated time: ${availabilityResponse.estimatedTime}` 
                            : 'The restaurant cannot fulfill your order at this time.'}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Button
                          onClick={handleCheckAvailability}
                          disabled={isCheckingAvailability}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {isCheckingAvailability ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Check Availability
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                
                <AnimatePresence>
                  {availabilityResponse?.isAvailable && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50">
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                          onClick={() => setShowCheckoutDialog(true)}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Proceed to Checkout
                        </Button>
                      </CardFooter>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Order Summary Card */}
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-green-500" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium">₹{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Platform fees included in item prices
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
              >
                <div className="flex items-center justify-center text-sm text-blue-700 dark:text-blue-300">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure payment powered by Razorpay
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Checkout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your delivery information to complete your order.
            </DialogDescription>
          </DialogHeader>
          
          <motion.div 
            className="space-y-6 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-3">
              <Label htmlFor="address" className="flex items-center text-sm font-medium">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                Delivery Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apartment 4B"
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200/50 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200/50 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 dark:from-gray-800/50 dark:to-orange-900/10 rounded-xl p-6 border border-gray-200/50">
              <h4 className="font-semibold mb-4 flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-green-500" />
                Order Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-3 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Platform fees included in item prices
              </div>
            </div>
          </motion.div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCheckoutDialog(false)}
              className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !address || !phone}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{total.toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPage;
