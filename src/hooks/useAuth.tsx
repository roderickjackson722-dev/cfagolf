import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  has_paid_access: boolean;
  program_type?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData?: {
    full_name?: string;
    graduation_year?: number;
    high_school?: string;
    state?: string;
    city?: string;
    handicap?: number;
    phone?: string;
    program_type?: string;
  }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasPaidAccess: boolean;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return data;
  };

  // Check subscription status for digital members
  const checkSubscription = useCallback(async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        return;
      }

      // If subscription status changed, refresh the profile
      if (data && profile) {
        const currentAccess = profile.has_paid_access;
        const newAccess = data.subscribed;
        
        if (currentAccess !== newAccess) {
          console.log('Subscription status changed, refreshing profile');
          const updatedProfile = await fetchProfile(profile.user_id);
          if (updatedProfile) setProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Failed to check subscription:', err);
    }
  }, [session, profile]);

  // Expose for manual refresh (e.g., after returning from Stripe)
  const refreshSubscription = useCallback(async () => {
    if (!user) return;
    const updatedProfile = await fetchProfile(user.id);
    if (updatedProfile) setProfile(updatedProfile);
    await checkSubscription();
  }, [user, checkSubscription]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        if (isMounted) setProfile(profileData);
      }
      
      if (isMounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            if (!isMounted) return;
            const profileData = await fetchProfile(session.user.id);
            if (isMounted) setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Periodically check subscription for digital members (every 60 seconds)
  useEffect(() => {
    if (!profile || profile.program_type !== 'digital' || !session) return;

    // Check on mount/login
    checkSubscription();

    const interval = setInterval(checkSubscription, 60_000);
    return () => clearInterval(interval);
  }, [profile?.program_type, session, checkSubscription]);

  const signUp = async (
    email: string, 
    password: string,
    profileData?: {
      full_name?: string;
      graduation_year?: number;
      high_school?: string;
      state?: string;
      city?: string;
      handicap?: number;
      phone?: string;
      program_type?: string;
    }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (!error && data.user && profileData) {
      await supabase
        .from('profiles')
        .update({
          ...profileData,
          email,
        })
        .eq('user_id', data.user.id);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const hasPaidAccess = profile?.has_paid_access ?? false;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      hasPaidAccess,
      refreshSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
