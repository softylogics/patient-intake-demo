import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onPatientDemo: () => void;
  onDoctorDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPatientDemo, onDoctorDemo }) => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Remote Patient Intake</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">DEMO MODE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{t('disclaimer')}</span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('language_toggle')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">{t('demo_notice')}</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('tell_your_doctor')}</h2>
          <p className="text-lg text-gray-600 mb-10">{t('describe_problem')}</p>

          <div className="space-y-4">
            <button
              onClick={onPatientDemo}
              className="w-full py-4 px-6 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('patient_demo')}
            </button>
            <button
              onClick={onDoctorDemo}
              className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('doctor_demo')}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>{t('disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
};