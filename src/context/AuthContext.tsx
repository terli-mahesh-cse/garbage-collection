"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { SEED_USERS } from "@/lib/data/seedData";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, pass?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  awardPoints: (amount: number, reason: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "citizen",
  isAuthenticated: false,
  loginWithPhone: async () => false,
  loginWithEmail: async () => false,
  loginWithGoogle: async () => false,
  logout: () => {},
  switchRole: () => {},
  awardPoints: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to citizen demo user so app is immediately usable on load
  const [user, setUser] = useState<User | null>(SEED_USERS[0]);
  const [role, setRole] = useState<UserRole>("citizen");

  useEffect(() => {
    const savedUser = localStorage.getItem("gc_current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role);
      } catch (e) {
        setUser(SEED_USERS[0]);
      }
    } else {
      setUser(SEED_USERS[0]);
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) {
      setRole(u.role);
      localStorage.setItem("gc_current_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("gc_current_user");
    }
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    // Verify 6-digit OTP
    if (otp.length === 6) {
      const u: User = {
        ...SEED_USERS[0],
        phone,
        name: phone === "+91 94401 23456" ? "Dr. K. Srinivas Rao" : "Ravi Kumar",
        role: phone === "+91 94401 23456" ? "officer" : "citizen",
      };
      persistUser(u);
      return true;
    }
    return false;
  };

  const loginWithEmail = async (email: string, pass?: string): Promise<boolean> => {
    const isOfficer = email.includes("officer") || email.includes("ghmc") || email.includes("gov");
    const isAdmin = email.includes("admin");
    const chosen = isAdmin ? SEED_USERS[2] : isOfficer ? SEED_USERS[1] : SEED_USERS[0];
    const u: User = { ...chosen, email };
    persistUser(u);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    persistUser(SEED_USERS[0]);
    return true;
  };

  const logout = () => {
    persistUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const matching = SEED_USERS.find((u) => u.role === newRole) || {
      ...SEED_USERS[0],
      role: newRole,
    };
    persistUser(matching);
  };

  const awardPoints = (amount: number, reason: string) => {
    if (!user) return;
    const newPoints = user.points + amount;
    let newLevel = user.level;
    if (newPoints >= 2000) newLevel = "Green Champion";
    else if (newPoints >= 1000) newLevel = "Eco Hero";
    else if (newPoints >= 400) newLevel = "Cleaner";

    const updated = {
      ...user,
      points: newPoints,
      level: newLevel,
    };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        loginWithPhone,
        loginWithEmail,
        loginWithGoogle,
        logout,
        switchRole,
        awardPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
