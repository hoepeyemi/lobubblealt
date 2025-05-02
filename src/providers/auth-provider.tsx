"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string) => Promise<void>;
  logout: () => void;
  refreshUserData: (userId: number) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from localStorage on client
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Function to fetch the latest user data from server if needed
  const refreshUserData = async (userId: number) => {
    if (!userId) return null;
    
    try {
      setIsLoading(true);
      console.log("Fetching latest user data for ID:", userId);
      
      const url = `/api/trpc/users.getUserById?batch=1&input=${encodeURIComponent(JSON.stringify({
        "0": { json: { userId } }
      }))}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-trpc-source': 'nextjs-react',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh user data: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (Array.isArray(json) && json[0]?.result?.data) {
        let refreshedUser: User | null = null;
        
        // Extract user data from response
        let rawUserData = json[0].result.data;
        if (rawUserData.json && typeof rawUserData.json === 'object') {
          refreshedUser = rawUserData.json;
        } else {
          refreshedUser = rawUserData;
        }
        
        if (refreshedUser) {
          // Update localStorage and state with fresh data
          const existingData = localStorage.getItem("auth_user");
          if (existingData) {
            // Merge with existing data to preserve client-side flags
            const existingUser = JSON.parse(existingData);
            const mergedUser = { ...existingUser, ...refreshedUser };
            localStorage.setItem("auth_user", JSON.stringify(mergedUser));
            setUser(mergedUser);
            return mergedUser;
          } else {
            localStorage.setItem("auth_user", JSON.stringify(refreshedUser));
            setUser(refreshedUser);
            return refreshedUser;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string) => {
    setIsLoading(true);
    
    try {
      if (!identifier) {
        throw new Error("Email or phone is required");
      }
      
      const isEmail = identifier.includes("@");
      let userData: User | null = null;
      
      // Get user by identifier (email or phone)
      if (isEmail) {
        try {
          // Format the URL based on tRPC client configuration
          const url = `/api/trpc/users.getUserByEmail?batch=1&input=${encodeURIComponent(JSON.stringify({
            "0": { json: { email: identifier } }
          }))}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'x-trpc-source': 'nextjs-react',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const json = await response.json();
          
          // Format is a batch response array
          if (Array.isArray(json) && json[0]?.result?.data) {
            // The API might return data in a nested format with json property
            let rawUserData = json[0].result.data;
            
            // If the user data has a nested json property, extract it
            if (rawUserData.json && typeof rawUserData.json === 'object') {
              userData = rawUserData.json;
            } else {
              userData = rawUserData;
            }
            
            if (userData) {
              // Validate user data has required fields
              if (!userData.id) {
                const userDataObj = userData as any;
                const possibleIdFields = ['ID', 'Id', '_id', 'userId', 'user_id'];
                
                for (const field of possibleIdFields) {
                  if (userDataObj[field]) {
                    userData.id = Number(userDataObj[field]);
                    break;
                  }
                }
                
                // If still no ID, generate a temporary one
                if (!userData.id) {
                  // Generate a deterministic ID based on the email/phone
                  userData.id = parseInt(identifier.split('').reduce((acc, char) => 
                    acc + char.charCodeAt(0), 0).toString().slice(0, 9));
                }
              }
            } else {
              throw new Error('Invalid user data from server');
            }
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      } else {
        try {
          // Format the URL based on tRPC client configuration
          const url = `/api/trpc/users.getUserByPhone?batch=1&input=${encodeURIComponent(JSON.stringify({
            "0": { json: { phone: identifier } }
          }))}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'x-trpc-source': 'nextjs-react',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const json = await response.json();
          
          // Format is a batch response array
          if (Array.isArray(json) && json[0]?.result?.data) {
            // The API might return data in a nested format with json property
            let rawUserData = json[0].result.data;
            
            // If the user data has a nested json property, extract it
            if (rawUserData.json && typeof rawUserData.json === 'object') {
              userData = rawUserData.json;
            } else {
              userData = rawUserData;
            }
            
            if (userData) {
              // Validate user data has required fields
              if (!userData.id) {
                const userDataObj = userData as any;
                const possibleIdFields = ['ID', 'Id', '_id', 'userId', 'user_id'];
                
                for (const field of possibleIdFields) {
                  if (userDataObj[field]) {
                    userData.id = Number(userDataObj[field]);
                    break;
                  }
                }
                
                // If still no ID, generate a temporary one
                if (!userData.id) {
                  // Generate a deterministic ID based on the phone
                  userData.id = parseInt(identifier.split('').reduce((acc, char) => 
                    acc + char.charCodeAt(0), 0).toString().slice(0, 9));
                }
              }
            } else {
              throw new Error('Invalid user data from server');
            }
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      }
      
      if (!userData) {
        throw new Error("User not found");
      }
      
      // Create a display name
      if (userData.firstName) {
        userData.name = userData.firstName + (userData.lastName ? ` ${userData.lastName}` : '');
      }
      
      // Store user data in local storage
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      // Update state
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    router.push("/auth/signin");
  };

  // Auth redirection logic
  useEffect(() => {
    if (isLoading) return; // Skip during initial load

    const isAuthRoute = pathname.startsWith("/auth/");
    const isPublicRoute = pathname === "/" || isAuthRoute;

    if (!user && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push("/auth/signin");
    } else if (user && isAuthRoute) {
      // Already authenticated but trying to access auth routes
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 