import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent } from './ui/dialog';
import { Clock } from 'lucide-react';
import { type Promotion, formatPromotionDate } from '../services/promotionService';

interface PromotionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  promotion: Promotion;
}

export function PromotionDetailDialog({ open, onClose, promotion }: PromotionDetailDialogProps) {
  const { language } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden" aria-describedby={undefined}>
        {/* Promotion Image */}
        <div className="w-full h-[40vh]">
          <img
            src={promotion.imageUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4'}
            alt={language === 'jp' ? promotion.titleJp : promotion.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Promotion Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">
            {language === 'jp' ? promotion.titleJp : promotion.title}
          </h2>
          
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {language === 'jp' ? promotion.descriptionJp : promotion.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="size-4" />
            <span>
              {language === 'jp' ? '有効期限: ' : 'Có hiệu lực đến: '}
              {formatPromotionDate(promotion.validUntil, language === 'jp' ? 'jp' : 'vn')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
