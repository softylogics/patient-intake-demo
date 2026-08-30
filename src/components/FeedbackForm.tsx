import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FeedbackFormProps {
  onClose: () => void;
  onSubmit: (feedback: { rating: string; comment: string }) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState<'useful' | 'somewhat_useful' | 'not_useful' | ''>('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment });
  };

  const ratings: { value: 'useful' | 'somewhat_useful' | 'not_useful'; label: string }[] = [
    { value: 'useful', label: t('useful') },
    { value: 'somewhat_useful', label: t('somewhat_useful') },
    { value: 'not_useful', label: t('not_useful') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">{t('doctor_feedback')}</p>
        <div className="flex flex-wrap gap-3">
          {ratings.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRating(r.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                rating === r.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('what_would_you_change')}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your feedback..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!rating}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {t('submit_feedback')}
        </button>
      </div>
    </form>
  );
};