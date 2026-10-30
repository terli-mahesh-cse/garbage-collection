"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { SEED_USERS } from "@/lib/data/seedData";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithPhone: (phone: string, otp: string, userDetails?: Partial<User>) => Promise<boolean>;
  loginWithEmail: (email: string, pass?: string, userDetails?: Partial<User>) => Promise<boolean>;
  loginWithGoogle: (userDetails?: Partial<User>) => Promise<boolean>;
  loginWithCustomDetails: (details: {
    name: string;
    phone?: string;
    email?: string;
    countryName: string;
    countryCode: string;
    stateName?: string;
    stateCode?: string;
    cityName: string;
    cityId: string;
    place?: string;
    role?: UserRole;
  }) => Promise<boolean>;
  updateUserProfile: (details: Partial<User>) => void;
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
  loginWithCustomDetails: async () => false,
  updateUserProfile: () => {},
  logout: () => {},
  switchRole: () => {},
  awardPoints: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default user profile
  const [user, setUser] = useState<User | null>(SEED_USERS[0]);
  const [role, setRole] = useState<UserRole>("citizen");

  useEffect(() => {
    const savedUser = localStorage.getItem("gc_current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || "citizen");
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

  const loginWithCustomDetails = async (details: {
    name: string;
    phone?: string;
    email?: string;
    countryName: string;
    countryCode: string;
    stateName?: string;
    stateCode?: string;
    cityName: string;
    cityId: string;
    place?: string;
    role?: UserRole;
  }): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: details.name.trim() || "Active Citizen",
      phone: details.phone,
      email: details.email,
      countryName: details.countryName,
      countryCode: details.countryCode,
      stateName: details.stateName,
      stateCode: details.stateCode,
      cityName: details.cityName,
      cityId: details.cityId.toLowerCase(),
      place: details.place || `${details.cityName}, ${details.countryName}`,
      role: details.role || "citizen",
      points: 150,
      level: "Reporter",
      streak: 1,
      trustScore: 99,
      badges: ["First Login", "Global Citizen", "Neighborhood Watch"],
      lang: "en",
      createdAt: new Date().toISOString(),
    };
    persistUser(newUser);
    return true;
  };

  const updateUserProfile = (details: Partial<User>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...details,
      name: details.name !== undefined ? details.name.trim() : user.name,
    };
    persistUser(updated);
  };

  const loginWithPhone = async (phone: string, otp: string, userDetails?: Partial<User>): Promise<boolean> => {
    if (otp.length === 6) {
      const u: User = {
        ...(user || SEED_USERS[0]),
        phone,
        name: userDetails?.name?.trim() || user?.name || (phone === "+91 94401 23456" ? "Dr. K. Srinivas Rao" : "Active Citizen"),
        countryName: userDetails?.countryName || user?.countryName || "India",
        countryCode: userDetails?.countryCode || user?.countryCode || "IN",
        cityName: userDetails?.cityName || user?.cityName || "Hyderabad",
        cityId: userDetails?.cityId || user?.cityId || "hyderabad",
        place: userDetails?.place || user?.place,
        role: phone === "+91 94401 23456" ? "officer" : (userDetails?.role || "citizen"),
      };
      persistUser(u);
      return true;
    }
    return false;
  };

  const loginWithEmail = async (email: string, pass?: string, userDetails?: Partial<User>): Promise<boolean> => {
    const isOfficer = email.includes("officer") || email.includes("ghmc") || email.includes("gov");
    const isAdmin = email.includes("admin");
    const chosenRole: UserRole = isOfficer ? "officer" : isAdmin ? "admin" : (userDetails?.role || "citizen");
    const u: User = { 
      ...(user || SEED_USERS[0]), 
      email,
      name: userDetails?.name?.trim() || user?.name || (email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase())),
      countryName: userDetails?.countryName || user?.countryName || "India",
      countryCode: userDetails?.countryCode || user?.countryCode || "IN",
      cityName: userDetails?.cityName || user?.cityName || "Hyderabad",
      cityId: userDetails?.cityId || user?.cityId || "hyderabad",
      place: userDetails?.place || user?.place,
      role: chosenRole,
    };
    persistUser(u);
    return true;
  };

  const loginWithGoogle = async (userDetails?: Partial<User>): Promise<boolean> => {
    const u: User = {
      ...(user || SEED_USERS[0]),
      name: userDetails?.name?.trim() || user?.name || "Google Citizen",
      countryName: userDetails?.countryName || user?.countryName || "India",
      countryCode: userDetails?.countryCode || user?.countryCode || "IN",
      cityName: userDetails?.cityName || user?.cityName || "Hyderabad",
      cityId: userDetails?.cityId || user?.cityId || "hyderabad",
      place: userDetails?.place || user?.place,
      role: userDetails?.role || "citizen",
    };
    persistUser(u);
    return true;
  };

  const logout = () => {
    persistUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      persistUser({ ...user, role: newRole });
      return;
    }
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
        loginWithCustomDetails,
        updateUserProfile,
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
