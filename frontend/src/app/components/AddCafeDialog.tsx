import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useLanguage } from '../contexts/LanguageContext';

type PlaceResult = {
  place_id: string;
  display_name: string;
  name: string;
};

interface AddCafeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cafeData: {
    name: string;
    nameJP: string;
    address: string;
    phone: string;
    coverImage: string;
    amenities: {
      hasWifi: boolean;
      hasAC: boolean;
      hasOutlet: boolean;
      noSmoking: boolean;
      hasSnacks: boolean;
      hasCoffee: boolean;
    };
    lat: string;
    lon: string;
    place_id: string;
  }) => void;
}

export function AddCafeDialog({ open, onClose, onSubmit }: AddCafeDialogProps) {
  // Lấy API Key từ biến môi trường Vite
  const API_KEY = import.meta.env.VITE_OPENMAP_API_KEY;

  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: string; lng: string; id: string } | null>(null);

  const [name, setName] = useState('');
  const [nameJP, setNameJP] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [amenities, setAmenities] = useState({
    hasWifi: false,
    hasAC: false,
    hasOutlet: false,
    noSmoking: false,
    hasSnacks: false,
    hasCoffee: false,
  });
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchPlace(address);
    }, 500);

    return () => clearTimeout(timeout);
  }, [address]);

  // 1. API Autocomplete kèm API Key
  async function searchPlace(keyword: string) {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://mapapis.openmap.vn/v1/autocomplete?text=${encodeURIComponent(keyword)}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.features) {
        const mappedSuggestions = data.features.map((feature: any) => ({
          place_id: feature.properties.id,
          display_name: feature.properties.label,
          name: feature.properties.name,
        }));
        setSuggestions(mappedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    }
  }

  // 2. API Place Detail kèm API Key
  async function fetchPlaceDetail(placeId: string) {
    try {
      const url = `https://mapapis.openmap.vn/v1/place?ids=${placeId}&format=google&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 'OK' && data.result) {
        const location = data.result.geometry.location;
        setSelectedCoordinates({
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          id: placeId
        });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL as string}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !nameJP || !address || !phone) {
      setError(language === 'jp' ? '必須項目を入力してください' : 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    let imageUrl = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';

    try {
      if (coverImage) {
        const uploadResult = await uploadImage(coverImage);
        imageUrl = uploadResult.url;
      }

      onSubmit({
        name,
        nameJP,
        address,
        phone,
        coverImage: imageUrl,
        amenities,
        lat: selectedCoordinates ? selectedCoordinates.lat : '',
        lon: selectedCoordinates ? selectedCoordinates.lng : '',
        place_id: selectedCoordinates ? selectedCoordinates.id : '',
      });

      // Reset form
      setName('');
      setNameJP('');
      setAddress('');
      setPhone('');
      setCoverImage(null);
      setPreviewImage('');
      setSelectedCoordinates(null);
      setAmenities({
        hasWifi: false,
        hasAC: false,
        hasOutlet: false,
        noSmoking: false,
        hasSnacks: false,
        hasCoffee: false,
      });
    } catch (err) {
      console.error(err);
      setError(language === 'jp' ? 'エラーが発生しました' : 'Có lỗi xảy ra khi xử lý dữ liệu');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {language === 'jp' ? 'カフェ情報を入力' : 'Nhập thông tin quán'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nameJP">
              {language === 'jp' ? 'カフェ名（日本語）' : 'Tên quán (Tiếng Nhật)'} *
            </Label>
            <Input
              id="nameJP"
              type="text"
              value={nameJP}
              onChange={(e) => setNameJP(e.target.value)}
              placeholder={language === 'jp' ? 'コーヒーハウス' : 'Coffee House'}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="name">
              {language === 'jp' ? 'カフェ名（ベトナム語）' : 'Tên quán (Tiếng Việt)'} *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coffee House"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="address">
              {language === 'jp' ? '住所' : 'Địa chỉ'} *
            </Label>

            <div className="relative mt-2">
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="1 Tràng Tiền, Hoàn Kiếm, Hà Nội"
                required
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                  {suggestions.map((place) => (
                    <div
                      key={place.place_id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => {
                        setAddress(place.display_name);
                        setShowSuggestions(false);
                        // Fetch details with the API key
                        fetchPlaceDetail(place.place_id);
                      }}
                    >
                      <div className="font-medium text-sm">
                        {place.name || 'Unnamed'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {place.display_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">
              {language === 'jp' ? '電話番号' : 'Số điện thoại'} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="024 3825 7959"
              required
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <Label>{language === 'jp' ? '設備・サービス' : 'Tiện ích'}</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasWifi"
                  checked={amenities.hasWifi}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, hasWifi: checked as boolean })
                  }
                />
                <Label htmlFor="hasWifi" className="cursor-pointer font-normal">
                  {t('hasWifi')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAC"
                  checked={amenities.hasAC}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, hasAC: checked as boolean })
                  }
                />
                <Label htmlFor="hasAC" className="cursor-pointer font-normal">
                  {t('hasAC')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOutlet"
                  checked={amenities.hasOutlet}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, hasOutlet: checked as boolean })
                  }
                />
                <Label htmlFor="hasOutlet" className="cursor-pointer font-normal">
                  {t('hasOutlet')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noSmoking"
                  checked={amenities.noSmoking}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, noSmoking: checked as boolean })
                  }
                />
                <Label htmlFor="noSmoking" className="cursor-pointer font-normal">
                  {t('noSmoking')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSnacks"
                  checked={amenities.hasSnacks}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, hasSnacks: checked as boolean })
                  }
                />
                <Label htmlFor="hasSnacks" className="cursor-pointer font-normal">
                  {t('hasSnacks')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCoffee"
                  checked={amenities.hasCoffee}
                  onCheckedChange={(checked) =>
                    setAmenities({ ...amenities, hasCoffee: checked as boolean })
                  }
                />
                <Label htmlFor="hasCoffee" className="cursor-pointer font-normal">
                  {t('hasCoffee')}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{language === 'jp' ? 'カバー画像' : 'Ảnh bìa'}</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Cover"
                className="w-full h-40 object-cover mt-2"
              />
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === 'jp' ? 'キャンセル' : 'Hủy'}
            </Button>
            <Button type="submit">
              {language === 'jp' ? '登録' : 'Đăng ký'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}