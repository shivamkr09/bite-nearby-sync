
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-semibold text-xl text-primary">
            Bite<span className="text-foreground">Nearby</span>
          </div>
          <div className="flex space-x-2">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover and Order from Restaurants Near You
            </h1>
            <p className="text-xl text-muted-foreground">
              Find nearby restaurants, check food availability in real-time, and order delicious meals with just a few taps.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3270&auto=format&fit=crop" 
                alt="Food delivery" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Nearby Restaurants</h3>
              <p className="text-muted-foreground">
                Enable location services to discover restaurants within 1km of your position.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Availability</h3>
              <p className="text-muted-foreground">
                Send real-time availability requests to restaurants before placing your order.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order & Track</h3>
              <p className="text-muted-foreground">
                Place your order and track its progress in real-time until delivery.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">For Restaurant Owners</h2>
          <div className="bg-primary/5 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h3 className="text-2xl font-semibold">
                Grow your business with BiteNearby
              </h3>
              <p className="text-muted-foreground">
                Join our platform and connect with nearby customers, manage orders in real-time,
                and easily update your menu through our simple template system.
              </p>
              <div className="pt-4">
                <Link to="/signup">
                  <Button variant="default">Register Your Restaurant</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="font-semibold text-lg text-primary mb-2 md:mb-0">
              Bite<span className="text-foreground">Nearby</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/legal" className="text-muted-foreground hover:underline">Legal & Compliance</Link>
              <Link to="/fssai-guide" className="text-muted-foreground hover:underline">FSSAI Registration Guide</Link>
              <Link to="/report-issue" className="text-muted-foreground hover:underline">Report Issue</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BiteNearby. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
