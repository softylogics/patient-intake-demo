import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Landing page
  'tell_your_doctor': { en: "Tell Your Doctor What You're Experiencing", ur: "اپنے ڈاکٹر کو بتائیں کہ آپ کیا محسوس کر رہے ہیں" },
  'describe_problem': { en: "Describe your problem before your consultation. Your doctor can review the information in advance.", ur: "اپنی مشکل بیان کریں آپ کی مشورہ سے پہلے۔ آپ کے ڈاکٹر معلومات کا پیشگی جائزہ لے سکتے ہیں۔" },
  'start_button': { en: "Start", ur: "شروع کریں" },
  'language_toggle': { en: "اردو / English", ur: "English / اردو" },
  'demo_notice': { en: "Demo only — not for emergency medical care", ur: "صرف ڈیمو — ایمرجنسی طبی علاج کے لیے نہیں" },
  'patient_demo': { en: "Patient Demo", ur: "مریض ڈیمو" },
  'doctor_demo': { en: "Doctor Demo", ur: "ڈاکٹر ڈیمو" },
  
  // Body map
  'select_problem_area': { en: "Select the Problem Area", ur: "مشکل کا علاقہ منتخب کریں" },
  'click_body_region': { en: "Click on the body area where you're experiencing the problem", ur: "جسم کے اس حصہ پر کلک کریں جہاں آپ کو تکلیف ہے" },
  'front_view': { en: "Front View", ur: "سامنے کا منظر" },
  'back_view': { en: "Back View", ur: "پیچھے کا منظر" },
  'selected_area': { en: "Selected area:", ur: "منتخب علاقہ:" },
  'continue': { en: "Continue", ur: "جاری رکھیں" },
  'cant_find': { en: "Can't find the exact area? Choose the closest area.", ur: "بالکل درست علاقہ نہیں مل رہا؟ سب سے قریب کا علاقہ منتخب کریں۔" },
  
  // Body regions
  'head': { en: "Head", ur: "سر" },
  'neck': { en: "Neck", ur: "گردن" },
  'chest': { en: "Chest", ur: "چھاتی" },
  'abdomen': { en: "Abdomen", ur: "پیٹ" },
  'shoulder': { en: "Shoulder", ur: "کندھا" },
  'arm': { en: "Arm", ur: "بازو" },
  'hand': { en: "Hand", ur: "ہاتھ" },
  'upper_back': { en: "Upper Back", ur: "اوپر کی پٹھ" },
  'lower_back': { en: "Lower Back", ur: "نیچے کی پٹھ" },
  'hip': { en: "Hip", ur: "کولہا" },
  'leg': { en: "Leg", ur: "ٹانگ" },
  'knee': { en: "Knee", ur: "گھٹنا" },
  'foot': { en: "Foot", ur: "پاؤں" },
  
  // Demographics
  'your_name': { en: "Your Name", ur: "آپ کا نام" },
  'your_name_placeholder': { en: "Enter your name (optional)", ur: "اپنا نام درج کریں (اختیاری)" },
  'age_placeholder': { en: "Enter your age", ur: "اپنی عمر درج کریں" },
  'select_gender': { en: "Select gender", ur: "جنس منتخب کریں" },
  'gender_preference': { en: "Doctor Gender Preference", ur: "ڈاکٹر کا جنس کا ترجیحی انتخاب" },
  'gender_preference_any': { en: "Any", ur: "کوئ بھی" },
  'gender_preference_male': { en: "Male Doctor", ur: "مرد ڈاکٹر" },
  'gender_preference_female': { en: "Female Doctor", ur: "خواتین ڈاکٹر" },

  // Privacy
  'privacy_notice': { en: "Your information is kept private and secure. Only your doctor can see this data.", ur: "آپ کی معلومات خفیہ اور محفوظ ہیں۔ صرف آپ کا ڈاکٹر یہ بيانات دیکھ سکتا ہے۔" },

  // Emergency
  'emergency': { en: "Emergency", ur: "ایمرجنسی" },
  'emergency_number': { en: "Emergency: 1122", ur: "ایمرجنسی: 1122" },
  'emergency_notice': { en: "⚠ If you have chest pain, difficulty breathing, or severe symptoms — seek emergency care immediately.", ur: "⚠ اگر سینے درد، سانس کی مشکل، یا شدید علامات ہیں — فوری طور پر ایمرجنسی کیر حاصل کریں۔" },

  // Telemedicine
  'telemedicine': { en: "Telemedicine Option", ur: "ٹیلی میڈیسن آپشن" },
  'telemedicine_desc': { en: "Consult a doctor via video call from home.", ur: "گھر بیٹھے ڈاکٹر سے ویڈیو کال سے مشورہ لیں۔" },
  'connect_doctor': { en: "Connect to Doctor", ur: "ڈاکٹر سے جڑیں" },

  // Symptoms
  'symptoms': { en: "Any other symptoms?", ur: "کوئی اور علامات؟" },
  'symptoms_placeholder': { en: "Select all that apply", ur: "سب منتخب کریں جو لگیں" },
  'symptom_tingling': { en: "Tingling", ur: "پکڑے کے شوق" },
  'symptom_stiffness': { en: "Stiffness", ur: "سکڑاوٹ" },
  'symptom_swelling': { en: "Swelling", ur: "پھنسی ہوئی" },
  'symptom_nausea': { en: "Nausea", ur: "بعضی" },
  'symptom_itching': { en: "Itching", ur: "خراش" },
  'symptom_redness': { en: "Redness", ur: "خون کی پھینک" },
  'symptom_pain_when_bending': { en: "Pain when bending", ur: "مڑنے درد" },
  'symptom_pain_when_walking': { en: "Pain when walking", ur: "چلتے ہیں درد" },
  'symptom_fever': { en: "Fever", ur: "بخار" },
  'symptom_bloating': { en: "Bloating", ur: "پھولا ہوا" },
  'symptom_fatigue': { en: "Fatigue", ur: "تھکاوٹ" },
  'symptom_headache': { en: "Headache", ur: "سر درد" },
  'symptom_visual_changes': { en: "Visual changes", ur: "نظر میں تبدیلی" },
  'symptom_weakness': { en: "Weakness", ur: "کمزوری" },
  'symptom_numbness': { en: "Numbness", ur: "سنسنی کمی" },
  'symptom_rash': { en: "Rash", ur: "تہج" },
  'symptom_cough': { en: "Cough", ur: "کھانسی" },
  'symptom_shortness_of_breath': { en: "Shortness of breath", ur: "سانس کی تنگی" },
  'symptom_vomiting': { en: "Vomiting", ur: "استیصال" },
  'symptom_diarrhea': { en: "Diarrhea", ur: "اسہال" },
  'symptom_loss_of_appetite': { en: "Loss of appetite", ur: "بخور کمی" },
  'symptom_joint_pain': { en: "Joint pain", ur: "جوڑوں کا درد" },
  'symptom_muscle_pain': { en: "Muscle pain", ur: "پٹھوں کا درد" },

  // Red flags
  'red_flags': { en: "Important: Are any of these true?", ur: "اہم: کوئ یہ درست ہے?" },
  'red_flag_chest_pain': { en: "Chest pain or pressure", ur: "سینے درد یا دباؤ" },
  'red_flag_severe_headache': { en: "Severe sudden headache", ur: "شدید آچانک سر درد" },
  'red_flag_difficulty_breathing': { en: "Difficulty breathing", ur: "سانس لینے میں مشکل" },
  'red_flag_confusion': { en: "Confusion or slurred speech", ur: "الجھا ہوا یا بولنے میں مشکل" },
  'red_flag_severe_pain': { en: "Severe pain (can't tolerate)", ur: "شدید درد (برداشت نہیں)" },
  'red_flag_fever_high': { en: "High fever (>38.5°C)", ur: "اونچا بخار (>38.5°C)" },
  'red_flag_bleeding': { en: "Unexplained bleeding", ur: "بیجلی خون‌ریزی" },
  'red_flag_none': { en: "None of these", ur: "کوئ نہیں" },

  // Add info
  'add_more_info': { en: "Add More Information", ur: "مزید معلومات شامل کریں" },
  'add_photo': { en: "Add a photo", ur: "تصویر شامل کریں" },
  'add_document': { en: "Add another document", ur: "دوسری دستاویز شامل کریں" },
  'record_description': { en: "Record your description", ur: "اپنی تفصیل ریکارڈ کریں" },
  'recording': { en: "Recording... (demo only)", ur: "ریکارڈنگ... (صرف ڈیمو)" },
  'recording_note': { en: "This is a demonstration of voice capture. No audio is actually recorded in this prototype.", ur: "یہ آواز ریکارڈ کرنے کا ایک مظاہرہ ہے۔ اس پروٹوٹائپ میں کوئی آڈیو حقیقت میں ریکارڈ نہیں ہوتی۔" },
  'skip': { en: "Skip", ur: "چھوڑ دیں" },

  // Review
  'review_information': { en: "Review Your Information", ur: "اپنی معلومات کا جائزہ لیں" },
  'patient_complaint': { en: "PATIENT COMPLAINT", ur: "مریض کی شکایت" },
  'body_area': { en: "BODY AREA", ur: "جسم کا علاقہ" },
  'duration': { en: "DURATION", ur: "مدت" },
  'severity_label': { en: "SEVERITY", ur: "شدت" },
  'character': { en: "CHARACTER", ur: "نوعیت" },
  'radiation_label': { en: "RADIATION", ur: "پھیلاؤ" },
  'patient_description': { en: "PATIENT DESCRIPTION", ur: "مریض کی تفصیل" },
  'attachments': { en: "ATTACHMENTS", ur: "ملحقات" },
  'edit': { en: "Edit", ur: "ترمیم کریں" },
  'submit_information': { en: "Submit Information", ur: "معلومات جمع کرائیں" },
  'symptoms_label': { en: "SYMPTOMS", ur: "علامات" },
  'red_flags_label': { en: "RED FLAGS", ur: "خطرہ نشانے" },

  // Submission
  'information_submitted': { en: "Information Submitted", ur: "معلومات جمع کرائی گئیں" },
  'doctor_review': { en: "Your doctor can now review your information before the consultation.", ur: "آپ کے ڈاکٹر اب مشورہ سے پہلے آپ کی معلومات کا جائزہ لے سکتے ہیں۔" },
  'view_doctor_dashboard': { en: "View Doctor Dashboard", ur: "ڈاکٹر ڈیش بورڈ دیکھیں" },
  'telemedicine_option': { en: "Or consult via video call", ur: "یا ویڈیو کال سے مشورہ لیں" },

  // Doctor Dashboard
  'dashboard': { en: "Dashboard", ur: "ڈیش بورڈ" },
  'patient_cases': { en: "Patient Cases", ur: "مریض کی کیسز" },
  'demo_patient': { en: "Demo Patient", ur: "ڈیمو مریض" },
  'settings': { en: "Settings", ur: "تنظیمات" },
  'new_cases': { en: "New Cases", ur: "نئی کیسز" },
  'todays_patients': { en: "Today's Patients", ur: "آج کے مریض" },
  'pending_review': { en: "Pending Review", ur: "جائزے کا انتظار" },
  'followups': { en: "Follow-ups", ur: "فالو اپ" },
  'name': { en: "Name", ur: "نام" },
  'complaint': { en: "Complaint", ur: "شکایت" },
  'status': { en: "Status", ur: "حالت" },
  'new': { en: "New", ur: "نئی" },
  'reviewed': { en: "Reviewed", ur: "جائزہ لیا گیا" },
  'triaged': { en: "Triaged", ur: "ٹرائیج کیا گیا" },

  // Patient Case View
  'patient': { en: "PATIENT", ur: "مریض" },
  'age': { en: "Age", ur: "عمر" },
  'gender': { en: "Gender", ur: "جنس" },
  'case_label': { en: "CASE", ur: "کیس" },
  'body_location': { en: "BODY LOCATION", ur: "جسم کی مقام" },
  'pain_type_label': { en: "Pain type", ur: "درد کی نوعیت" },
  'radiation_label2': { en: "Radiation", ur: "پھیلاؤ" },
  'associated_info': { en: "Associated information", ur: "متعلقہ معلومات" },
  'patient_description_label': { en: "Patient description", ur: "مریض کی تفصیل" },
  'attachments_label': { en: "Attachments", ur: "ملحقات" },
  'ai_summary': { en: "AI-Generated Summary", ur: "اے آئی سے پیدا کردہ خلاصہ" },
  'demo_ai_summary': { en: "DEMO — AI SUMMARY", ur: "ڈیمو — اے آئی خلاصہ" },
  'urgent': { en: "URGENT", ur: "فوری" },
  'routine': { en: "ROUTINE", ur: "معمولی" },

  // Doctor Feedback
  'doctor_feedback': { en: "Doctor Feedback", ur: "ڈاکٹر کی رائے" },
  'useful': { en: "Useful", ur: "مفید" },
  'somewhat_useful': { en: "Somewhat Useful", ur: "کچھ حد تک مفید" },
  'not_useful': { en: "Not Useful", ur: "غیر مفید" },
  'what_would_you_change': { en: "What would you change or add?", ur: "آپ کیا تبدیل یا شامل کریں گے؟" },
  'submit_feedback': { en: "Submit Feedback", ur: "رائے جمع کرائیں" },
  'feedback_thanks': { en: "Thank you. Your feedback has been recorded for this demo.", ur: "شکریہ۔ آپ کی رائے اس ڈیمو کے لیے ریکارڈ ہو گئی ہے۔" },

  // Disclaimer
  'disclaimer': { en: "Demo only. This prototype does not provide medical diagnosis or treatment.", ur: "صرف ڈیمو۔ یہ پروٹوٹائپ طبی تشخیص یا علاج فراہم نہیں کرتا۔" },

  // Reset
  'reset_demo': { en: "Reset Demo", ur: "ڈیمو دوبارہ شروع کریں" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}