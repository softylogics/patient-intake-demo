import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDemoData } from '../context/DemoDataContext';
import { BodyMap } from './BodyMap';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionCard } from './QuestionCard';
import { AttachmentUploader } from './AttachmentUploader';
import { PatientSummary } from './PatientSummary';

interface PatientDemoProps {
  onBack: () => void;
  onSubmit: () => void;
}

const steps = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Body Area' },
  { id: 3, label: 'Questions' },
  { id: 4, label: 'Add Info' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Submit' },
];

const getQuestionsForArea = (_area: string, t: (key: string) => string) => {
  const baseQuestions = [
    {
      id: 'duration',
      type: 'select' as const,
      label: t('how_long'),
      options: ['Less than 1 day', '1-3 days', '4-7 days', '1-2 weeks', '2-4 weeks', 'More than 1 month'],
      required: true,
    },
    {
      id: 'severity',
      type: 'scale' as const,
      label: t('severity'),
      required: true,
    },
    {
      id: 'pain_type',
      type: 'radio' as const,
      label: t('pain_type'),
      options: [t('sharp'), t('dull'), t('burning'), t('aching'), t('other')],
      required: true,
    },
    {
      id: 'radiation',
      type: 'radio' as const,
      label: t('radiation'),
      options: [t('yes'), t('no')],
      required: true,
    },
  ];

  return baseQuestions;
};

export const PatientDemo: React.FC<PatientDemoProps> = ({ onBack, onSubmit }) => {
  const { t, toggleLanguage } = useLanguage();
  const {
    selectedBodyArea,
    setSelectedBodyArea,
    patientName,
    setPatientName,
    answers,
    setAnswer,
    description,
    setDescription,
    attachments,
    setAttachments,
    currentStep,
    setCurrentStep,
    resetPatientData,
    addCase,
  } = useDemoData();

  const questions = selectedBodyArea ? getQuestionsForArea(selectedBodyArea, t) : [];

  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const handleNext = () => {
    if (currentStep === 2 && !selectedBodyArea) return;
    if (currentStep === 3) {
      const allAnswered = questions.every(q => answers[q.id]);
      if (!allAnswered) return;
    }
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
      resetPatientData();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (selectedBodyArea) {
      const areaDisplay = selectedBodyArea
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      addCase({
        name: patientName.trim() || 'New Patient',
        age: 0,
        gender: 'Male',
        complaint: `${areaDisplay} Pain`,
        bodyArea: areaDisplay,
        duration: answers['duration'] || '—',
        severity: parseInt(answers['severity']) || 0,
        painType: answers['pain_type'] || '—',
        radiation: answers['radiation'] || '—',
        description: description || '—',
        attachments: attachments.map(f => f.name),
        status: 'New',
      });
    }
    resetPatientData();
    onSubmit();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">{t('disclaimer')}</p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{t('tell_your_doctor')}</h2>
            <p className="text-lg text-gray-600">{t('describe_problem')}</p>
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('start_button')}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('select_problem_area')}</h3>
              <p className="text-gray-600">{t('click_body_region')}</p>
            </div>
            <BodyMap selectedArea={selectedBodyArea} onSelectArea={setSelectedBodyArea} />
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedBodyArea}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {t('continue')}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">{t('selected_area')} {t(selectedBodyArea?.replace(/_/g, ' ') || '')}</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t('your_name')}</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('your_name_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-6">
              {questions.map(q => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  value={answers[q.id] || ''}
                  onChange={(val) => setAnswer(q.id, val)}
                />
              ))}
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">{t('tell_us_more')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('description_placeholder_roman')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={questions.some(q => !answers[q.id])}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {t('continue')}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">{t('add_more_info')}</h3>
            <AttachmentUploader
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <button
                onClick={toggleRecording}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-50 text-red-600 border-2 border-red-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                {isRecording ? t('recording') : t('record_description')}
              </button>
              {isRecording && (
                <p className="mt-3 text-sm text-center text-gray-500">{t('recording_note')}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('skip')}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('continue')}
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <PatientSummary
            selectedBodyArea={selectedBodyArea}
            answers={answers}
            description={description}
            attachments={attachments}
            onEdit={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
          />
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{t('information_submitted')}</h2>
            <p className="text-lg text-gray-600">{t('doctor_review')}</p>
            <button
              onClick={onSubmit}
              className="w-full py-4 px-6 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('view_doctor_dashboard')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Remote Patient Intake</h1>
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

      <nav className="bg-white border-b border-gray-200 px-6 py-3" aria-label="Progress">
        <ProgressIndicator steps={steps} currentStep={currentStep} />
      </nav>

      <main className="flex-1 px-4 py-8">
        {renderStep()}
      </main>

      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>{t('disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
};