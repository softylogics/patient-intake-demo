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
  symptoms: string[];
  redFlags: string[];
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
  patientAge: number;
  setPatientAge: (age: number) => void;
  patientGender: 'Male' | 'Female' | '';
  setPatientGender: (gender: 'Male' | 'Female' | '') => void;
  genderPreference: 'Male' | 'Female' | 'Any';
  setGenderPreference: (pref: 'Male' | 'Female' | 'Any') => void;
  answers: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  symptoms: string[];
  toggleSymptom: (symptom: string) => void;
  redFlags: string[];
  toggleRedFlag: (flag: string) => void;
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
const initialPatientAge = 0;
const initialPatientGender: 'Male' | 'Female' | '' = '';
const initialGenderPreference: 'Male' | 'Female' | 'Any' = 'Any';
const initialAnswers: Record<string, string> = {};
const initialDescription = '';
const initialSymptoms: string[] = [];
const initialRedFlags: string[] = [];
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
    symptoms: ['Tingling', 'Stiffness', 'Pain when bending'],
    redFlags: [],
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
    symptoms: ['Itching', 'Redness', 'Dry skin'],
    redFlags: [],
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
    symptoms: ['Swelling', 'Stiffness', 'Pain when walking'],
    redFlags: [],
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
    symptoms: ['Nausea', 'Visual changes', 'Fatigue'],
    redFlags: [],
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
    symptoms: ['Nausea', 'Bloating', 'Fever'],
    redFlags: ['red_flag_severe_pain'],
    description: 'Pet ke nichle hissay mein tej dard...',
    attachments: ['scan_report.pdf'],
    status: 'New',
    timestamp: Date.now() - 432000000,
  },
  {
    id: '6',
    name: 'Zara Butt',
    age: 26,
    gender: 'Female',
    complaint: 'Dengue Fever',
    bodyArea: 'Whole body',
    duration: '3 days',
    severity: 8,
    painType: 'Body aches',
    radiation: 'None',
    symptoms: ['Fever', 'Fatigue', 'Rash', 'Joint pain'],
    redFlags: ['red_flag_fever_high'],
    description: 'Jism mein dard hai, bakhri hui hoon...',
    attachments: [],
    status: 'New',
    timestamp: Date.now() - 259200000,
  },
  {
    id: '7',
    name: 'Hassan Ahmed',
    age: 52,
    gender: 'Male',
    complaint: 'Hypertension',
    bodyArea: 'Head',
    duration: '30 days',
    severity: 6,
    painType: 'Throbbing',
    radiation: 'None',
    symptoms: ['Headache', 'Fatigue'],
    redFlags: [],
    description: 'Sar dard hai aur baar baar blood pressure high rehta hai...',
    attachments: ['bp_log.pdf'],
    status: 'Reviewed',
    timestamp: Date.now() - 604800000,
  },
  {
    id: '8',
    name: 'Nadia Khan',
    age: 31,
    gender: 'Female',
    complaint: 'Typhoid',
    bodyArea: 'Abdomen',
    duration: '7 days',
    severity: 7,
    painType: 'Cramping',
    radiation: 'None',
    symptoms: ['Fever', 'Nausea', 'Diarrhea', 'Loss of appetite'],
    redFlags: [],
    description: 'Pet mein dard aur baakhor ki issue hai...',
    attachments: [],
    status: 'New',
    timestamp: Date.now() - 604800000,
  },
];

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [selectedBodyArea, setSelectedBodyArea] = useState<string | null>(initialBodyArea);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [patientAge, setPatientAge] = useState(initialPatientAge);
  const [patientGender, setPatientGender] = useState(initialPatientGender);
  const [genderPreference, setGenderPreference] = useState(initialGenderPreference);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [description, setDescription] = useState(initialDescription);
  const [symptoms, setSymptoms] = useState<string[]>(initialSymptoms);
  const [redFlags, setRedFlags] = useState<string[]>(initialRedFlags);
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

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const toggleRedFlag = (flag: string) => {
    setRedFlags(prev =>
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
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
    setPatientAge(initialPatientAge);
    setPatientGender(initialPatientGender);
    setGenderPreference(initialGenderPreference);
    setAnswers(initialAnswers);
    setDescription(initialDescription);
    setSymptoms(initialSymptoms);
    setRedFlags(initialRedFlags);
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
      patientAge,
      setPatientAge,
      patientGender,
      setPatientGender,
      genderPreference,
      setGenderPreference,
      answers,
      setAnswer,
      description,
      setDescription,
      symptoms,
      toggleSymptom,
      redFlags,
      toggleRedFlag,
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