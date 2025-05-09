
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userType: 'customer' | 'vendor' | null;
  isLoading: boolean;
  signUp: (email: string, password: string, userType: 'customer' | 'vendor', userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'customer' | 'vendor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // This would typically be implemented with the Supabase client
    // We'll implement this after connecting to Supabase
    console.log("Auth provider initialized");
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userType: 'customer' | 'vendor', userData: any) => {
    try {
      setIsLoading(true);
      // This would typically be implemented with the Supabase client
      // We'll implement this after connecting to Supabase
      console.log("Sign up:", { email, userType, userData });
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification",
      });
      navigate('/signin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message || "An error occurred during sign up",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would typically be implemented with the Supabase client
      // We'll implement this after connecting to Supabase
      console.log("Sign in:", { email });
      
      // Mock successful sign in
      const mockUser = { id: '123', email };
      const mockUserType = email.includes('vendor') ? 'vendor' : 'customer';
      
      setUser(mockUser as User);
      setUserType(mockUserType as 'customer' | 'vendor');
      toast({
        title: "Signed in successfully",
      });
      
      if (mockUserType === 'customer') {
        navigate('/customer/restaurants');
      } else {
        navigate('/vendor/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "An error occurred during sign in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // This would typically be implemented with the Supabase client
      // We'll implement this after connecting to Supabase
      setUser(null);
      setUserType(null);
      setSession(null);
      toast({
        title: "Signed out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An error occurred during sign out",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userType,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
