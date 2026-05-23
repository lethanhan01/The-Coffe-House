import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { createPromotion } from '../services/promotionService';

interface AddPromotionDialogProps {
  open: boolean;
  onClose: () => void;
  cafeId: string;
  onSubmit?: (data: {
    title: string;
    titleJP: string;
    description: string;
    descriptionJP: string;
    image: string;
    duration: string;
  }) => void;
  onSuccess?: () => void;
}

export function AddPromotionDialog({ open, onClose, cafeId, onSubmit, onSuccess }: AddPromotionDialogProps) {
  const { language } = useLanguage();
  const [titleVN, setTitleVN] = useState('');
  const [titleJP, setTitleJP] = useState('');
  const [descriptionVN, setDescriptionVN] = useState('');
  const [descriptionJP, setDescriptionJP] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('7');
  const [error, setError] = useState('');
  const [inputLanguage, setInputLanguage] = useState<'vn' | 'jp'>('vn');
  const [isLoading, setIsLoading] = useState(false);

  const durations = [
    { value: '1', label: language === 'jp' ? '24時間' : '24 giờ' },
    { value: '3', label: language === 'jp' ? '3日間' : '3 ngày' },
    { value: '7', label: language === 'jp' ? '1週間' : '1 tuần' },
    { value: '14', label: language === 'jp' ? '2週間' : '2 tuần' },
    { value: '30', label: language === 'jp' ? '1ヶ月' : '1 tháng' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(language === 'jp' ? '画像ファイルを選択してください' : 'Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'jp' ? 'ファイルサイズは5MB以下にしてください' : 'Kích thước file tối đa 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titleVN.trim() || !titleJP.trim()) {
      setError(language === 'jp' ? 'タイトルを入力してください' : 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!descriptionVN.trim() || !descriptionJP.trim()) {
      setError(language === 'jp' ? '説明を入力してください' : 'Vui lòng nhập mô tả');
      return;
    }

    if (!image.trim()) {
      setError(language === 'jp' ? '画像URLを入力してください' : 'Vui lòng nhập URL hình ảnh');
      return;
    }

    const daysToAdd = parseInt(duration);
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + daysToAdd);
    const validUntil = validUntilDate.toISOString().split('T')[0];

    setIsLoading(true);

    try {
      const result = await createPromotion({
        cafe_id: parseInt(cafeId),
        title: titleVN.trim(),
        title_jp: titleJP.trim(),
        description: descriptionVN.trim(),
        description_jp: descriptionJP.trim(),
        image_url: image.trim(),
        valid_until: validUntil
      });

      if (!result) {
        setError(language === 'jp' ? 'プロモーションの作成に失敗しました' : 'Thêm khuyến mãi thất bại');
        setIsLoading(false);
        return;
      }

      if (onSubmit) {
        onSubmit({
          title: titleVN.trim(),
          titleJP: titleJP.trim(),
          description: descriptionVN.trim(),
          descriptionJP: descriptionJP.trim(),
          image: image.trim(),
          duration,
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      setTitleVN('');
      setTitleJP('');
      setDescriptionVN('');
      setDescriptionJP('');
      setImage('');
      setDuration('7');
      setError('');
      handleClose();
    } catch (err) {
      setError(language === 'jp' ? 'エラーが発生しました' : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitleVN('');
    setTitleJP('');
    setDescriptionVN('');
    setDescriptionJP('');
    setImage('');
    setDuration('7');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="size-5 text-amber-700" />
            {language === 'jp' ? 'プロモーション追加' : 'Thêm khuyến mãi mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Selection Buttons */}
          <div>
            <Label>{language === 'jp' ? '入力言語' : 'Ngôn ngữ nhập liệu'}</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={inputLanguage === 'vn' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputLanguage('vn')}
                className={inputLanguage === 'vn' ? 'bg-amber-700 hover:bg-amber-800' : ''}
              >
                {language === 'jp' ? 'ベトナム語' : 'Tiếng Việt'}
              </Button>
              <Button
                type="button"
                variant={inputLanguage === 'jp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputLanguage('jp')}
                className={inputLanguage === 'jp' ? 'bg-amber-700 hover:bg-amber-800' : ''}
              >
                {language === 'jp' ? '日本語' : 'Tiếng Nhật'}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">
              {language === 'jp' ? 'タイトル' : 'Tiêu đề'} *
            </Label>
            <input
              id="title"
              type="text"
              value={inputLanguage === 'vn' ? titleVN : titleJP}
              onChange={(e) => {
                if (inputLanguage === 'vn') {
                  setTitleVN(e.target.value);
                } else {
                  setTitleJP(e.target.value);
                }
              }}
              placeholder={
                inputLanguage === 'vn' 
                  ? 'Ví dụ: Giảm 20% tất cả đồ uống' 
                  : '例: 全ドリンク20%オフ'
              }
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              {language === 'jp' ? '説明' : 'Mô tả'} *
            </Label>
            <textarea
              id="description"
              value={inputLanguage === 'vn' ? descriptionVN : descriptionJP}
              onChange={(e) => {
                if (inputLanguage === 'vn') {
                  setDescriptionVN(e.target.value);
                } else {
                  setDescriptionJP(e.target.value);
                }
              }}
              placeholder={
                inputLanguage === 'vn'
                  ? 'Mô tả chi tiết về chương trình khuyến mãi...'
                  : 'プロモーションの詳細を入力...'
              }
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent min-h-[80px] resize-y"
            />
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">
              {language === 'jp' ? '画像URL' : 'URL hình ảnh'} *
            </Label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
            {image && (
              <div className="mt-2">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp' 
                ? 'Unsplashなどから画像URLを入力（オプション）' 
                : 'URL từ Unsplash hoặc nguồn ảnh khác (tùy chọn)'}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageUpload">
              {language === 'jp' ? '画像アップロード' : 'Tải ảnh lên'}
            </Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
            {imageFile && (
              <div className="mt-2">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp'
                ? '5MB以下の画像ファイルを選択（オプション）' 
                : 'Chọn file ảnh dưới 5MB (tùy chọn)'}
            </p>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">
              {language === 'jp' ? '有効期間' : 'Thời gian hiệu lực'} *
            </Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              {language === 'jp' ? 'キャンセル' : 'Hủy'}
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isLoading}>
              <ImagePlus className="size-4 mr-2" />
              {language === 'jp' ? '追加' : 'Thêm khuyến mãi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
