import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserType = 'customer' | 'vendor' | 'admin' | null;

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userType: UserType;
  isLoading: boolean;
  signUp: (email: string, password: string, userType: UserType, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserType(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserType(session.user.id);
      } else {
        setUserType(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchUserType = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user type:', error);
        setIsLoading(false);
        return;
      }
      
      console.log("User profile data:", data);
      setUserType(data.user_type as UserType);
    } catch (error) {
      console.error('Error fetching user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userType: UserType, userData: any) => {
    try {
      setIsLoading(true);
      
      if (!userType) {
        throw new Error("User type is required");
      }
      
      console.log("Signing up with user type:", userType);
      console.log("User data:", userData);

      // Validate user_type before sending to the API
      if (userType !== 'customer' && userType !== 'vendor' && userType !== 'admin') {
        throw new Error("Invalid user type");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            first_name: userData.name?.split(' ')[0] || '',
            last_name: userData.name?.split(' ').slice(1).join(' ') || '',
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification",
      });
      
      navigate('/signin');
    } catch (error: any) {
      console.error("Signup error:", error);
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
      });
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();
          
        console.log("Profile data after signin:", profile);
        
        if (profile?.user_type === 'admin') {
          navigate('/admin/dashboard');
        } else if (profile?.user_type === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/customer/restaurants');
        }
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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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
