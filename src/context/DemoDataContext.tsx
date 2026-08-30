import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Question {
  id: string;
  type: 'text' | 'select' | 'radio' | 'scale';
  label: string;
  options?: string[];
  required: boolean;
}

export interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  complaint: string;
  bodyArea: string;
  duration: string;
  severity: number;
  painType: string;
  radiation: string;
  associatedInfo?: string;
  description: string;
  attachments: string[];
  status: 'New' | 'Reviewed';
  timestamp: number;
}

interface DemoDataContextType {
  // Patient intake state
  selectedBodyArea: string | null;
  setSelectedBodyArea: (area: string | null) => void;
  patientName: string;
  setPatientName: (name: string) => void;
  answers: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  attachments: File[];
  setAttachments: (files: File[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetPatientData: () => void;
  
  // Doctor dashboard state
  cases: PatientCase[];
  addCase: (caseData: Omit<PatientCase, 'id' | 'timestamp'>) => void;
  feedback: { rating: string; comment: string }[];
  addFeedback: (feedback: { rating: string; comment: string }) => void;
  resetDemo: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

const initialBodyArea = null;
const initialPatientName = '';
const initialAnswers: Record<string, string> = {};
const initialDescription = '';
const initialAttachments: File[] = [];

const initialCases: PatientCase[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    age: 34,
    gender: 'Male',
    complaint: 'Lower Back Pain',
    bodyArea: 'Lower Back',
    duration: '6 days',
    severity: 7,
    painType: 'Sharp / Aching',
    radiation: 'Right leg',
    associatedInfo: 'Tingling',
    description: 'Meri kamar ke right side mein dard hai jo kabhi kabhi right tang tak jata hai...',
    attachments: ['photo1.jpg'],
    status: 'New',
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    name: 'Ayesha Malik',
    age: 28,
    gender: 'Female',
    complaint: 'Skin Rash',
    bodyArea: 'Arm',
    duration: '4 days',
    severity: 4,
    painType: 'Itching',
    radiation: 'None',
    description: 'Mere baazoo par lal dane nikal aaye hain jo khujlaate hain...',
    attachments: ['rash_photo.jpg'],
    status: 'New',
    timestamp: Date.now() - 172800000,
  },
  {
    id: '3',
    name: 'Muhammad Ali',
    age: 45,
    gender: 'Male',
    complaint: 'Knee Pain',
    bodyArea: 'Knee',
    duration: '3 days',
    severity: 6,
    painType: 'Dull / Aching',
    radiation: 'Calf',
    description: 'Ghutney mein dard hai jo chalne se barhta hai...',
    attachments: [],
    status: 'Reviewed',
    timestamp: Date.now() - 259200000,
  },
  {
    id: '4',
    name: 'Fatima Hassan',
    age: 32,
    gender: 'Female',
    complaint: 'Headache',
    bodyArea: 'Head',
    duration: '2 days',
    severity: 5,
    painType: 'Throbbing',
    radiation: 'Behind eyes',
    description: 'Sir dard hai jo subah se shuru hota hai...',
    attachments: [],
    status: 'New',
    timestamp: Date.now() - 345600000,
  },
  {
    id: '5',
    name: 'Omar Sheikh',
    age: 39,
    gender: 'Male',
    complaint: 'Abdominal Pain',
    bodyArea: 'Abdomen',
    duration: '5 days',
    severity: 8,
    painType: 'Cramping',
    radiation: 'Back',
    description: 'Pet ke nichle hissay mein tej dard...',
    attachments: ['scan_report.pdf'],
    status: 'New',
    timestamp: Date.now() - 432000000,
  },
];

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [selectedBodyArea, setSelectedBodyArea] = useState<string | null>(initialBodyArea);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [description, setDescription] = useState(initialDescription);
  const [attachments, setAttachments] = useState<File[]>(initialAttachments);
  const [currentStep, setCurrentStep] = useState(1);
  const [cases, setCases] = useState<PatientCase[]>(() => {
    const saved = localStorage.getItem('demo_cases');
    return saved ? JSON.parse(saved) : initialCases;
  });
  const [feedback, setFeedback] = useState<{ rating: string; comment: string }[]>(() => {
    const saved = localStorage.getItem('demo_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('demo_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('demo_feedback', JSON.stringify(feedback));
  }, [feedback]);

  const setAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const addCase = (caseData: Omit<PatientCase, 'id' | 'timestamp'>) => {
    const newCase: PatientCase = {
      ...caseData,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setCases(prev => [newCase, ...prev]);
  };

  const addFeedback = (feedbackData: { rating: string; comment: string }) => {
    setFeedback(prev => [...prev, feedbackData]);
  };

  const resetPatientData = () => {
    setSelectedBodyArea(initialBodyArea);
    setPatientName(initialPatientName);
    setAnswers(initialAnswers);
    setDescription(initialDescription);
    setAttachments(initialAttachments);
    setCurrentStep(1);
  };

  const resetDemo = () => {
    setCases(initialCases);
    setFeedback([]);
    resetPatientData();
    localStorage.removeItem('demo_cases');
    localStorage.removeItem('demo_feedback');
  };

  return (
    <DemoDataContext.Provider value={{
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
      cases,
      addCase,
      feedback,
      addFeedback,
      resetDemo,
    }}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}