import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Cafe } from "../services/cafeService";
import { useLanguage } from '../contexts/LanguageContext';

export interface MapViewProps {
  cafes: Cafe[];
  onCafeClick?: (cafeId: string) => void;
  height?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function MapView({
  cafes,
  onCafeClick,
  height = 'h-96',
  onLocationChange
}: MapViewProps) {
  const { language } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Default center on Hanoi
  const defaultCenter: [number, number] = [21.028333, 105.85361];

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    // Create map
    const map = L.map(containerRef.current).setView(defaultCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc: [number, number] = [latitude, longitude];
          setUserLocation(userLoc);
          setLocationError(null);
          onLocationChange?.(latitude, longitude);

          // Center map on user location
          if (mapRef.current) {
            mapRef.current.setView(userLoc, 15);
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setLocationError(error.message);
          // Use default location as fallback for demo
          setUserLocation(defaultCenter);
          if (mapRef.current) {
            mapRef.current.setView(defaultCenter, 15);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      // Geolocation not available, use default
      setUserLocation(defaultCenter);
      if (mapRef.current) {
        mapRef.current.setView(defaultCenter, 15);
      }
    }
  }, [onLocationChange]);

  // Add markers to map
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add user location marker with circular icon
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(userLocation, { icon: userIcon })
        .bindPopup(
          `<div class="w-32"><h3 class="font-bold text-sm">Vị trí của bạn</h3><p class="text-xs text-gray-600">${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}</p></div>`
        )
        .addTo(mapRef.current);
    }

    // Get today's day name for opening hours
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];

    // Add cafe markers
    cafes.forEach((cafe) => {

      if (!mapRef.current) return;

      const todayHours =
        cafe.openingHours.find(
          h => h.day === today
        );

      const hoursText =
        todayHours
          ? todayHours.hours
          : 'Closed';

      const tooltipHtml = `
    <div class="w-64">

      <img
        src="${cafe.images[0]}"
        alt="${cafe.name}"
        class="w-full h-24 object-cover rounded mb-2"
      />

      <h3 class="font-bold text-sm mb-1">
        ${language === 'jp'
          ? cafe.nameJP
          : cafe.name}
      </h3>

      <p class="text-xs text-gray-600 mb-2 break-words whitespace-normal">
        ${cafe.address}
      </p>

      <div class="flex gap-2">

        <span class="text-xs font-semibold text-yellow-600">
          ⭐ ${cafe.rating}
        </span>

        <span class="text-xs text-gray-500">
          (${cafe.reviewCount} reviews)
        </span>

      </div>

    </div>
  `;

      const marker = L.marker([
        cafe.lat,
        cafe.lng
      ]).addTo(mapRef.current);

      marker.bindPopup(tooltipHtml);

      marker.on('mouseover', () => {

        if (!mapRef.current) return;

        // TÍNH LẠI VỊ TRÍ KHI HOVER
        const markerPoint =
          mapRef.current.latLngToContainerPoint(
            marker.getLatLng()
          );

        let direction = 'top';
        if (markerPoint.y > 249) {
          direction = 'top';
        }
        else if (markerPoint.y < 219) {
          direction = 'bottom';
        }
        else {
          direction = 'right';
          if (markerPoint.x > 1000) {
            direction = 'left';
          }
        }

        console.log(
          `hover x=${markerPoint.x},
       y=${markerPoint.y},
       direction=${direction}`
        );

        // REBIND TOOLTIP
        marker.unbindTooltip();

        marker.bindTooltip(
          tooltipHtml,
          {
            direction,
            offset: [0, 0],
            permanent: false
          }
        );

        marker.openTooltip();
      });

      marker.on('click', () => {
        onCafeClick?.(cafe.id);
      });

    });

    // Keep map centered on user location instead of fitting bounds
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [cafes, userLocation, language, onCafeClick]);

  return (
    <div className={`${height} rounded-lg overflow-hidden shadow-md relative z-0`}>
      <div ref={containerRef} className="w-full h-full z-0" />
      {locationError && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 text-xs p-2 rounded-b z-10">
          Không thể lấy vị trí của bạn. Vui lòng bật định vị trong trình duyệt.
        </div>
      )}
    </div>
  );
}
