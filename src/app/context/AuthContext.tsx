import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check initial session
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleUserSession(session.user);
      } else {
        setUser(null);
      }
    };

    syncSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await handleUserSession(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (authUser: any) => {
    let role: 'client' | 'admin' = 'client';

    // Attempt to fetch profile role from Supabase
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (profile?.role === 'admin') {
        role = 'admin';
      }
    } catch (_) {}

    const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Pet Parent';
    const formattedUser: User = {
      id: authUser.id,
      name,
      email: authUser.email || '',
      role,
    };

    setUser(formattedUser);
    localStorage.setItem('user', JSON.stringify(formattedUser));
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        console.error('Supabase login error:', error?.message);
        return false;
      }

      await handleUserSession(data.user);
      return true;
    } catch (err) {
      console.error('Login exception:', err);
      return false;
    }
  };

  // Registration is routed through the Express backend so the service-role key
  // is used server-side. This gives us a reliable, accurate error when the
  // email is already taken (the anon-key signUp can silently succeed or return
  // misleading results when email confirmation is enabled).
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { api } = await import('../utils/api');
      await api.auth.register(name, email, password);

      // Backend created the account – sign the user in via Supabase client
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr || !data.user) {
        // Account exists but auto-login failed; caller can redirect to /login
        return { success: true };
      }
      await handleUserSession(data.user);
      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please try again.';
      console.error('Registration error:', message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
