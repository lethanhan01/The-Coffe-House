import { useEffect, useRef, useState } from 'react';
import type { Cafe } from "../services/cafeService";
import { useLanguage } from '../contexts/LanguageContext';
// import maplibregl from "@openmapvn/openmapvn-gl";
// import "@openmapvn/openmapvn-gl/dist/maplibre-gl.css";
import ndamapgl from "ndamap-gl";
import "ndamap-gl/dist/ndamap-gl.css";
export interface MapViewProps {
  cafes: Cafe[];
  onCafeClick?: (cafeId: string) => void;
  height?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}
 
export default function MapView({
  cafes,
  onCafeClick,
  height = 'h-[600px]',
  onLocationChange
}: MapViewProps) {
  const { language } = useLanguage();
  const mapRef = useRef<ndamapgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
 
  // Default center on Hanoi
  const defaultCenter: [number, number] = [105.85361, 21.028333];
 
  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;
 
    const apiKey = import.meta.env.VITE_OPENMAP_API_KEY;
    if (!apiKey) {
      console.error('OpenMapVN API key not found in environment variables');
      return;
    }
 
    // Create MapLibre GL map
    const map = new ndamapgl.Map({
      container: containerRef.current,
      style: https://maptiles.openmap.vn/styles/day-v2/style.json?apikey=${apiKey},
      center: defaultCenter,
      zoom: 15,
    });
 
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
          const userLoc: [number, number] = [longitude, latitude];
          setUserLocation(userLoc);
          setLocationError(null);
          onLocationChange?.(latitude, longitude);
 
          // Center map on user location
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: userLoc,
              zoom: 15
            });
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setLocationError(error.message);
          // Use default location as fallback for demo
          setUserLocation(defaultCenter);
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: defaultCenter,
              zoom: 15
            });
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
        mapRef.current.flyTo({
          center: defaultCenter,
          zoom: 15
        });
      }
    }
  }, [onLocationChange]);
 
  // Add markers to map
  useEffect(() => {
    if (!mapRef.current) return;
 
    // Remove existing markers
    const markers = document.querySelectorAll('.ndamap-marker');
    markers.forEach(marker => marker.remove());
 
    // Add user location marker
    if (userLocation) {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `;
 
      const innerDot = document.createElement('div');
      innerDot.style.cssText = `
        width: 4px;
        height: 4px;
        background-color: white;
        border-radius: 50%;
      `;
      el.appendChild(innerDot);
 
      const popup = new ndamapgl.Popup({ offset: 25 }).setHTML(
        <div class="w-32"><h3 class="font-bold text-sm">Vị trí của bạn</h3><p class="text-xs text-gray-600">${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}</p></div>
      );
 
      new ndamapgl.Marker(el)
        .setLngLat(userLocation)
        .setPopup(popup)
        .addTo(mapRef.current);
    }
 
    // Get today's day name for opening hours
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
 
    // Add cafe markers
    cafes.forEach((cafe) => {
      if (!mapRef.current) return;
 
      const todayHours = cafe.openingHours.find(h => h.day === today);
      const hoursText = todayHours ? todayHours.hours : 'Closed';
 
      const tooltipHtml = `
        <div class="w-56 bg-white rounded-lg overflow-hidden shadow-lg">
          <div class="relative">
            <img
              src="${cafe.images[0]}"
              alt="${cafe.name}"
              class="w-full h-24 object-cover"
            />
            <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold">
              ⭐ ${cafe.rating}
            </div>
          </div>
          <div class="p-2">
            <h3 class="font-bold text-sm text-gray-800 mb-1">
              ${language === 'jp' ? cafe.nameJP : cafe.name}
            </h3>
            <a
              href="https://www.google.com/maps/search/${encodeURIComponent(cafe.address)}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-2 break-words line-clamp-2 block"
            >
              📍 ${cafe.address}
            </a>
            <div class="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <span>⭐ ${cafe.rating}</span>
              <span>•</span>
              <span>${cafe.reviewCount} đánh giá</span>
            </div>
            <a
              href="/cafe/${cafe.id}"
              class="block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 px-3 rounded transition-colors"
            >
              Xem chi tiết →
            </a>
          </div>
        </div>
      `;
 
      const markerEl = document.createElement('div');
      markerEl.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        font-size: 18px;
      `;
      markerEl.innerHTML = '☕';
 
      const popup = new ndamapgl.Popup({ offset: 25 }).setHTML(tooltipHtml);
 
      const marker = new ndamapgl.Marker(markerEl)
        .setLngLat([cafe.lng, cafe.lat])
        .setPopup(popup)
        .addTo(mapRef.current);
 
      markerEl.addEventListener('click', () => {
        onCafeClick?.(cafe.id);
        marker.togglePopup();
      });
 
      markerEl.addEventListener('mouseenter', () => {
        marker.togglePopup();
      });
 
      markerEl.addEventListener('mouseleave', () => {
        // Keep popup open only if explicitly clicked
      });
    });
 
    // Keep map centered on user location
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: userLocation,
        zoom: 15
      });
    }
  }, [cafes, userLocation, language, onCafeClick]);

    if (mapError) {
    return (
      <div className={`${height} rounded-lg overflow-hidden shadow-md relative z-0 flex items-center justify-center bg-gray-100`}>
        <div className="text-center p-6">
          <p className="text-gray-500 text-sm">
            {language === 'jp' ? 'マップを読み込めません' : 'Không thể tải bản đồ'}
          </p>
          <p className="text-gray-400 text-xs mt-1">{mapError}</p>
        </div>
      </div>
    );
  }
  
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