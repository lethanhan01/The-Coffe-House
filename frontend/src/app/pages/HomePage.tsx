import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllCafes as getCafes, type Cafe } from '../services/cafeService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Filter, MapPin, Star, X, Wifi, Wind, Plug, Armchair } from 'lucide-react';
import ProfileDialog from '../components/ProfileDialog';
import NotificationsDialog from '../components/NotificationsDialog';
import MapView from '../components/MapView';
import { getActivePromotions, type Promotion, formatPromotionDate } from '../services/promotionService';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24';

type BackendCafe = {
  id: number | string;
  owner_id: number | string;
  name_jp?: string | null;
  name_vn?: string | null;
  address?: string | null;
  phone_number?: string | null;
  open_hours?: string | null;
  is_open?: boolean | number | null;
  is_crowded?: boolean | number | null;
  average_rating?: number | null;
  review_count?: number | null;
  cover_image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  lat?: string | null;
  lon?: string | null;
  has_wifi?: boolean | number | null;
  has_ac?: boolean | number | null;
  has_outlets?: boolean | number | null;
  is_non_smoking?: boolean | number | null;
  has_snacks?: boolean | number | null;
  has_coffee?: boolean | number | null;
};

type CafeFilters = {
  hasWifi: boolean;
  hasAC: boolean;
  hasOutlet: boolean;
  noSmoking: boolean;
  hasSnacks: boolean;
  isOpen: boolean;
};

const defaultFilters: CafeFilters = {
  hasWifi: false,
  hasAC: false,
  hasOutlet: false,
  noSmoking: false,
  hasSnacks: false,
  isOpen: false,
};

const toBoolean = (value: boolean | number | null | undefined) => value === true || value === 1;

const mapBackendCafe = (cafe: BackendCafe): Cafe => ({
  id: String(cafe.id),
  owner_id: cafe.owner_id ?? 0,
  name: cafe.name_vn || cafe.name_jp || '',
  nameJP: cafe.name_jp || cafe.name_vn || '',
  address: cafe.address || '',
  phone: cafe.phone_number || '',
  openingHours: [{ day: 'Mon-Sun', hours: cafe.open_hours || '07:00 - 22:00' }],
  isOpen: toBoolean(cafe.is_open),
  status: toBoolean(cafe.is_crowded) ? 'crowded' : 'normal',
  amenities: {
    hasWifi: toBoolean(cafe.has_wifi),
    hasAC: toBoolean(cafe.has_ac),
    hasOutlet: toBoolean(cafe.has_outlets),
    noSmoking: toBoolean(cafe.is_non_smoking),
    hasSnacks: toBoolean(cafe.has_snacks),
    hasCoffee: toBoolean(cafe.has_coffee),
  },
  menu: [],
  rating: cafe.average_rating ?? 0,
  reviewCount: cafe.review_count ?? 0,
  images: [cafe.cover_image_url || DEFAULT_CAFE_IMAGE],
  lat: (() => { const v = Number(cafe.lat ?? cafe.latitude); return isNaN(v) ? 0 : v; })(),
  lng: (() => { const v = Number(cafe.lon ?? cafe.longitude); return isNaN(v) ? 0 : v; })(),
});

const applyCafeFilters = (items: Cafe[], keywordValue: string, filterValue: CafeFilters) => {
  let result = [...items];
  const keyword = keywordValue.trim().toLowerCase();

  if (keyword) {
    result = result.filter(cafe =>
      cafe.name.toLowerCase().includes(keyword) ||
      cafe.nameJP.toLowerCase().includes(keyword) ||
      cafe.address.toLowerCase().includes(keyword)
    );
  }

  if (filterValue.hasWifi) result = result.filter(c => c.amenities.hasWifi);
  if (filterValue.hasAC) result = result.filter(c => c.amenities.hasAC);
  if (filterValue.hasOutlet) result = result.filter(c => c.amenities.hasOutlet);
  if (filterValue.noSmoking) result = result.filter(c => c.amenities.noSmoking);
  if (filterValue.hasSnacks) result = result.filter(c => c.amenities.hasSnacks);
  if (filterValue.isOpen) result = result.filter(c => c.isOpen);

  return result;
};

export default function HomePage() {
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const [filters, setFilters] = useState<CafeFilters>(defaultFilters);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(5); // default 5km

  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Temporarily disabled auth check for development
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    const loadPromotions = async () => {
      const activePromos = await getActivePromotions();
      setPromotions(activePromos || []);
    };
    loadPromotions();
  }, []);

  const searchCafes = async (keywordValue = searchQuery, filterValue = filters) => {
    const params = new URLSearchParams();
    const keyword = keywordValue.trim();

    if (keyword) params.set('keyword', keyword);
    if (filterValue.hasWifi) params.set('has_wifi', 'true');
    if (filterValue.hasAC) params.set('has_ac', 'true');
    if (filterValue.hasOutlet) params.set('has_outlets', 'true');

    try {
      if (keyword.length > 0 || filterValue.hasWifi || filterValue.hasAC || filterValue.hasOutlet || filterValue.noSmoking || filterValue.hasSnacks || filterValue.isOpen) {
        const response = await fetch(`${API_BASE_URL}/cafes/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch cafes');
        }

        const result = await response.json();
        const nextCafes = applyCafeFilters((result.data || []).map(mapBackendCafe), keywordValue, filterValue);
        setFilteredCafes(nextCafes);
      } else {
        // No keyword/filters: load nearby using selected radius
        callAPINearbyCafes(nearbyRadiusKm);
      }
    } catch (error) {
      // setFilteredCafes(applyCafeFilters(getCafes(), keywordValue, filterValue));
    }
  };
  function callAPINearbyCafes(radiusKm: number) {
    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const { latitude, longitude } =
            position.coords;

          try {

            const response = await fetch(
              `${API_BASE_URL}/search/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
            );

            if (!response.ok) {
              throw new Error('Failed to fetch cafes');
            }

            const result = await response.json();
            const nextCafes = applyCafeFilters((result.data || []).map(mapBackendCafe), "", defaultFilters);
            setFilteredCafes(nextCafes);

          } catch (error) {

            console.error(error);
          }
        },

        (error) => {

          console.log(error.message);
        },

        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {

      console.log('Geolocation is not supported by this browser.');
    }
  }
  useEffect(() => {
    // On mount, load nearby cafes with the current radius
    callAPINearbyCafes(nearbyRadiusKm);
  }, [nearbyRadiusKm]);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleCafeClick = (cafeId: string) => {
    navigate(`/cafe/${cafeId}`);
  };

  // Temporarily disabled user check for development
  // if (!user) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search and Filter */}
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            searchCafes();
          }}
        >
          <div className="flex-1 flex gap-2">
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="size-4" />
            </Button>
          </div>
          <Button type="button" variant="outline" onClick={() => setShowFilter(true)}>
            <Filter className="size-4 mr-2" />
            {t('filter')}
          </Button>
        </form>

        {/* Promotions Highlight */}
        {promotions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="font-bold mb-4">{t('promotions')}</h2>
              <div className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPromotion(promotions[currentPromoIndex]);
                    setShowPromotion(true);
                  }}
                >
                  <img
                    src={promotions[currentPromoIndex].imageUrl}
                    alt="Promotion"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold">
                      {language === 'jp' ? promotions[currentPromoIndex].titleJp : promotions[currentPromoIndex].title}
                    </h3>
                    <p className="text-white text-sm">
                      {language === 'jp' ? promotions[currentPromoIndex].descriptionJp : promotions[currentPromoIndex].description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={prevPromo}>←</Button>
                  <div className="flex items-center gap-1">
                    {promotions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`size-2 rounded-full ${idx === currentPromoIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={nextPromo}>→</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-white rounded-lg shadow-md p-4 relative z-0">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="size-5 text-blue-600" />
            <span className="font-medium">{t('location')}</span>

            <select
              value={nearbyRadiusKm}
              onChange={(e) => setNearbyRadiusKm(Number(e.target.value))}
              className="ml-4 border rounded px-2 py-1 text-sm"
              aria-label="Radius (km)"
            >
              <option value={1}>1 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
            </select>
          </div>
          <MapView
            cafes={filteredCafes}
            onCafeClick={handleCafeClick}
            height="h-96"
          />
        </div>

        {/* Cafe List */}
        <div>
          <h2 className="font-bold mb-4">{t('cafes')} ({filteredCafes.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCafes.map(cafe => (
              <Card
                key={cafe.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => handleCafeClick(cafe.id)}
              >
                <img
                  src={cafe.images[0]}
                  alt={cafe.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold">{language === 'jp' ? cafe.nameJP : cafe.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="size-4" />
                    {cafe.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{cafe.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({cafe.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {cafe.isOpen && (
                      <Badge variant="default" className="bg-green-600">{t('openNow')}</Badge>
                    )}
                    <Badge variant={cafe.status === 'crowded' ? 'destructive' : 'outline'}>{t(cafe.status)}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {cafe.amenities.hasWifi && <Wifi className="size-4 text-gray-600" />}
                    {cafe.amenities.hasAC && <Wind className="size-4 text-gray-600" />}
                    {cafe.amenities.hasOutlet && <Plug className="size-4 text-gray-600" />}
                    {cafe.amenities.hasCoffee && <Armchair className="size-4 text-gray-600" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilter} onOpenChange={setShowFilter}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('filter')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWifi"
                checked={filters.hasWifi}
                onCheckedChange={(checked) => setFilters({ ...filters, hasWifi: checked as boolean })}
              />
              <Label htmlFor="hasWifi" className="cursor-pointer">{t('hasWifi')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAC"
                checked={filters.hasAC}
                onCheckedChange={(checked) => setFilters({ ...filters, hasAC: checked as boolean })}
              />
              <Label htmlFor="hasAC" className="cursor-pointer">{t('hasAC')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOutlet"
                checked={filters.hasOutlet}
                onCheckedChange={(checked) => setFilters({ ...filters, hasOutlet: checked as boolean })}
              />
              <Label htmlFor="hasOutlet" className="cursor-pointer">{t('hasOutlet')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="noSmoking"
                checked={filters.noSmoking}
                onCheckedChange={(checked) => setFilters({ ...filters, noSmoking: checked as boolean })}
              />
              <Label htmlFor="noSmoking" className="cursor-pointer">{t('noSmoking')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSnacks"
                checked={filters.hasSnacks}
                onCheckedChange={(checked) => setFilters({ ...filters, hasSnacks: checked as boolean })}
              />
              <Label htmlFor="hasSnacks" className="cursor-pointer">{t('hasSnacks')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOpen"
                checked={filters.isOpen}
                onCheckedChange={(checked) => setFilters({ ...filters, isOpen: checked as boolean })}
              />
              <Label htmlFor="isOpen" className="cursor-pointer">{t('openNow')}</Label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  searchCafes();
                  setShowFilter(false);
                }}
                className="flex-1"
              >
                {t('applyFilter')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearFilters();
                  searchCafes(searchQuery, defaultFilters);
                }}
                className="flex-1"
              >
                {t('clearFilter')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <ProfileDialog open={showProfile} onClose={() => setShowProfile(false)} />

      {/* Notifications Dialog */}
      <NotificationsDialog open={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Promotion Dialog */}
      <Dialog open={showPromotion} onOpenChange={setShowPromotion}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={() => setShowPromotion(false)}
          >
            <X className="size-4" />
          </Button>

          <DialogHeader>
            <DialogTitle>{t('promotion')}</DialogTitle>
          </DialogHeader>

          {selectedPromotion && (
            <div className="space-y-4">
              <img
                src={selectedPromotion.imageUrl}
                alt="Promotion"
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (selectedPromotion?.cafeId) {
                    setShowPromotion(false);
                    navigate(`/cafe/${selectedPromotion.cafeId}`);
                  }
                }}
              />
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {language === 'jp' ? selectedPromotion.titleJp : selectedPromotion.title}
                </h3>
                <p className="text-gray-600">
                  {language === 'jp' ? selectedPromotion.descriptionJp : selectedPromotion.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {language === 'jp' ? '有効期限: ' : 'Có hiệu lực đến: '}
                  {formatPromotionDate(selectedPromotion.validUntil, language === 'jp' ? 'jp' : 'vn')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
