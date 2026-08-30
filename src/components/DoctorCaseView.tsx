import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PatientCase } from '../context/DemoDataContext';
import { BodyMap } from './BodyMap';
import { FeedbackForm } from './FeedbackForm';

interface DoctorCaseViewProps {
  case: PatientCase;
  onClose: () => void;
  onFeedbackSubmit: (feedback: { rating: string; comment: string }) => void;
}

export const DoctorCaseView: React.FC<DoctorCaseViewProps> = ({ case: case_, onClose, onFeedbackSubmit }) => {
  const { t } = useLanguage();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const aiSummary = `Patient reports ${case_.bodyArea.toLowerCase()} pain for approximately ${case_.duration.toLowerCase()}, rated ${case_.severity}/10, with radiation toward ${case_.radiation.toLowerCase()}. Patient reports ${case_.painType.toLowerCase()}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">{t('patient')} — {case_.name}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('patient')}</p>
                <div className="flex items-center gap-4 text-gray-900 flex-wrap">
                  <span>{case_.name}</span>
                  {case_.age > 0 && (
                    <>
                      <span className="text-gray-400">|</span>
                      <span>{t('age')}: {case_.age}</span>
                    </>
                  )}
                  <span className="text-gray-400">|</span>
                  <span>{t('gender')}: {t(case_.gender.toLowerCase())}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('case_label')}</p>
                <p className="text-lg font-medium text-gray-900">{case_.complaint}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('body_location')}</p>
                <BodyMap selectedArea={case_.bodyArea.toLowerCase().replace(' ', '_')} onSelectArea={() => {}} highlightOnly />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('duration')}</p>
                  <p className="text-gray-900">{case_.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('severity_label')}</p>
                  <p className="text-gray-900">{case_.severity}/10</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('pain_type_label')}</p>
                  <p className="text-gray-900">{case_.painType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('radiation_label2')}</p>
                  <p className="text-gray-900">{case_.radiation}</p>
                </div>
              </div>

              {case_.associatedInfo && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('associated_info')}</p>
                  <p className="text-gray-900">{case_.associatedInfo}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('patient_description_label')}</p>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{case_.description}</p>
              </div>

              {case_.attachments.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('attachments_label')}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {case_.attachments.map((att, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-700">{att}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">{t('demo_ai_summary')}</span>
                </div>
                <p className="text-blue-900 text-sm">{aiSummary}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('doctor_feedback')}</p>
                
                {feedbackSubmitted ? (
                  <div className="text-center py-4">
                    <svg className="w-12 h-12 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700">{t('feedback_thanks')}</p>
                  </div>
                ) : (
                  <FeedbackForm
                    onClose={onClose}
                    onSubmit={(fb) => {
                      onFeedbackSubmit(fb);
                      setFeedbackSubmitted(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};