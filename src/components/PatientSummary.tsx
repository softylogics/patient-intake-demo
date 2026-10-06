import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BodyMap } from './BodyMap';

interface PatientSummaryProps {
  selectedBodyArea: string | null;
  answers: Record<string, string>;
  description: string;
  attachments: File[];
  symptoms: string[];
  redFlags: string[];
  onEdit: () => void;
  onSubmit: () => void;
}

export const PatientSummary: React.FC<PatientSummaryProps> = ({
  selectedBodyArea,
  answers,
  description,
  attachments,
  symptoms,
  redFlags,
  onEdit,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const getAnswer = (key: string) => answers[key] || '—';
  const hasRedFlags = redFlags.length > 0 && !redFlags.includes('red_flag_none');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-900">{t('review_information')}</h3>
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {t('edit')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('patient_complaint')}</p>
          <p className="text-gray-900">{t(selectedBodyArea?.replace(/_/g, ' ') || '')} Pain</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('body_area')}</p>
            <p className="text-gray-900">{t(selectedBodyArea?.replace(/_/g, ' ') || '')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('duration')}</p>
            <p className="text-gray-900">{getAnswer('duration')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('severity_label')}</p>
            <p className="text-gray-900">{getAnswer('severity')}/10</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('character')}</p>
            <p className="text-gray-900">{getAnswer('pain_type')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('radiation_label')}</p>
            <p className="text-gray-900">{getAnswer('radiation')}</p>
          </div>
        </div>

        {symptoms.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('symptoms_label')}</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <span key={s} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{t(s)}</span>
              ))}
            </div>
          </div>
        )}

        {hasRedFlags && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">{t('red_flags_label')}</p>
            <div className="flex flex-wrap gap-2">
              {redFlags.filter(f => f !== 'red_flag_none').map(f => (
                <span key={f} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{t(f)}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('patient_description')}</p>
          <p className="text-gray-900 whitespace-pre-wrap">{description || '—'}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('attachments')}</p>
          <p className="text-gray-900">{attachments.length} {attachments.length === 1 ? 'photo' : 'photos'}</p>
        </div>

        <BodyMap selectedArea={selectedBodyArea} onSelectArea={() => {}} highlightOnly />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onEdit}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('edit')}
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('submit_information')}
        </button>
      </div>
    </div>
  );
};