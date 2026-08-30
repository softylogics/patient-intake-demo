import { useState } from 'react';
import { PatientDemo } from './components/PatientDemo';
import { DoctorDashboard } from './components/DoctorDashboard';
import { LandingPage } from './components/LandingPage';
import { LanguageProvider } from './context/LanguageContext';
import { DemoDataProvider } from './context/DemoDataContext';

function App() {
  const [view, setView] = useState<'landing' | 'patient' | 'doctor'>('landing');

  return (
    <LanguageProvider>
      <DemoDataProvider>
        <div className="min-h-screen bg-gray-50">
          {view === 'landing' && (
            <LandingPage onPatientDemo={() => setView('patient')} onDoctorDemo={() => setView('doctor')} />
          )}
          {view === 'patient' && <PatientDemo onBack={() => setView('landing')} onSubmit={() => setView('doctor')} />}
          {view === 'doctor' && <DoctorDashboard onBack={() => setView('landing')} />}
        </div>
      </DemoDataProvider>
    </LanguageProvider>
  );
}

export default App;