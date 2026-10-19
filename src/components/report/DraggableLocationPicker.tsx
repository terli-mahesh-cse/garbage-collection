"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const pinIcon = L.divIcon({
  html: `
    <div class="relative cursor-move" style="width: 32px; height: 42px;">
      <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <div class="w-2 h-2 rotate-45 bg-red-600 border-r border-b border-white mx-auto -mt-1"></div>
    </div>
  `,
  className: "report-picker-pin",
  iconSize: [32, 42],
  iconAnchor: [16, 40],
});

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationPickerProps> = ({ lat, lng, onChange }) => {
  const markerRef = useRef<any>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onChange]
  );

  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      ref={markerRef}
      icon={pinIcon}
    />
  );
};

export const DraggableLocationPicker: React.FC<LocationPickerProps> = ({
  lat,
  lng,
  onChange,
}) => {
  return (
    <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-emerald-200 dark:border-slate-700 shadow-inner relative">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[400] px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white font-semibold">
        Drag pin to adjust exact location
      </div>
    </div>
  );
};

export default DraggableLocationPicker;
