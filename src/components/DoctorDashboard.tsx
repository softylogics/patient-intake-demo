import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDemoData, PatientCase } from '../context/DemoDataContext';
import { DoctorCaseList } from './DoctorCaseList';
import { DoctorCaseView } from './DoctorCaseView';

interface DoctorDashboardProps {
  onBack: () => void;
}

const navItems = ['dashboard', 'patient_cases', 'demo_patient', 'settings'] as const;

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onBack }) => {
  const { t, toggleLanguage } = useLanguage();
  const { cases, addFeedback, resetDemo } = useDemoData();
  const [activeNav, setActiveNav] = useState<'dashboard' | 'patient_cases' | 'demo_patient' | 'settings'>('dashboard');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);

  const newCases = 8;
  const todaysPatients = 12;
  const pendingReview = 4;
  const followups = 3;

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">{t('new_cases')}</p>
                <p className="text-3xl font-bold text-gray-900">{newCases}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">{t('todays_patients')}</p>
                <p className="text-3xl font-bold text-gray-900">{todaysPatients}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">{t('pending_review')}</p>
                <p className="text-3xl font-bold text-gray-900">{pendingReview}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-500 mb-1">{t('followups')}</p>
                <p className="text-3xl font-bold text-gray-900">{followups}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t('patient_cases')}</h3>
              </div>
              <DoctorCaseList cases={cases} onSelectCase={setSelectedCase} />
            </div>
          </div>
        );

      case 'patient_cases':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{t('patient_cases')}</h3>
            </div>
            <DoctorCaseList cases={cases} onSelectCase={setSelectedCase} />
          </div>
        );

      case 'demo_patient':
        return (
          <div className="space-y-6">
            <p className="text-gray-600">Demo patient view - shows the patient intake flow</p>
            <button onClick={() => setActiveNav('dashboard')} className="text-blue-600 hover:text-blue-700">
              Back to Dashboard
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('settings')}</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Settings panel - configure demo preferences</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold text-gray-900">Doctor Portal</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">DEMO MODE</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Remote Patient Intake</p>
        </div>

        <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item as typeof activeNav)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeNav === item
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {t(item)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('language_toggle')}
            </button>
            <button
              onClick={() => { resetDemo(); setSelectedCase(null); }}
              className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              {t('reset_demo')}
            </button>
          </div>
          <button
            onClick={onBack}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Switch to Patient Demo
          </button>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-800">{t('emergency')}</p>
            <p className="text-sm text-green-700 font-medium">{t('emergency_number')}</p>
          </div>
          <button className="w-full px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
            {t('telemedicine')}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t(activeNav)}</h2>
          <p className="text-gray-500 mt-1">{t('disclaimer')}</p>
        </header>

        {selectedCase && (
          <DoctorCaseView
            case={selectedCase}
            onClose={() => setSelectedCase(null)}
            onFeedbackSubmit={(fb) => {
              addFeedback(fb);
            }}
          />
        )}

        {!selectedCase && renderContent()}
      </main>
    </div>
  );
};