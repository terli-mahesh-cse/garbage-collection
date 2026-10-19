"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { City } from "@/types";
import { SEED_CITIES } from "@/lib/data/seedData";
import { mockStore } from "@/lib/data/mockStore";

interface LocationContextType {
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  currentCity: City;
  availableCities: City[];
  setLocation: (countryCode: string, stateCode: string, cityId: string) => void;
  selectCity: (cityId: string) => void;
}

const LocationContext = createContext<LocationContextType>({
  countryCode: "IN",
  countryName: "India",
  stateCode: "TG",
  stateName: "Telangana",
  currentCity: SEED_CITIES[0],
  availableCities: SEED_CITIES,
  setLocation: () => {},
  selectCity: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCode] = useState("IN");
  const [countryName, setCountryName] = useState("India");
  const [stateCode, setStateCode] = useState("TG");
  const [stateName, setStateName] = useState("Telangana");
  const [currentCity, setCurrentCity] = useState<City>(SEED_CITIES[0]);
  const [availableCities, setAvailableCities] = useState<City[]>(SEED_CITIES);

  useEffect(() => {
    const updateCities = () => {
      setAvailableCities(mockStore.getCities());
      const savedCityId = localStorage.getItem("gc_city_id");
      if (savedCityId) {
        const found = mockStore.getCity(savedCityId);
        if (found) {
          setCurrentCity(found);
          setStateCode(found.stateCode);
          setStateName(found.stateName);
          setCountryCode(found.countryCode);
        }
      }
    };

    updateCities();
    const unsub = mockStore.subscribe(updateCities);
    return unsub;
  }, []);

  const selectCity = (cityId: string) => {
    const found = mockStore.getCity(cityId);
    if (found) {
      setCurrentCity(found);
      setStateCode(found.stateCode);
      setStateName(found.stateName);
      setCountryCode(found.countryCode);
      localStorage.setItem("gc_city_id", found.id);
      document.cookie = `gc_city_id=${found.id}; path=/; max-age=31536000`;
    }
  };

  const setLocation = (country: string, state: string, cityId: string) => {
    setCountryCode(country);
    setStateCode(state);
    selectCity(cityId);
  };

  return (
    <LocationContext.Provider
      value={{
        countryCode,
        countryName,
        stateCode,
        stateName,
        currentCity,
        availableCities,
        setLocation,
        selectCity,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
