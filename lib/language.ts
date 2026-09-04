export type LanguageCode = "en" | "kn" | "ml";

type LanguageChangeHandler = (language: LanguageCode) => void;

export const LANGUAGE_STORAGE_KEY = "sdit-language";
export const LANGUAGE_EVENT = "sdit-language-change";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  kn: "ಕನ್ನಡ (Kannada)",
  ml: "മലയാളം (Malayalam)",
};

export const NAV_TRANSLATIONS: Record<
  LanguageCode,
  Record<string, string>
> = {
  en: {
    "AI COMMAND": "AI COMMAND",
    CAMPUS: "CAMPUS",
    INFORMATION: "INFORMATION",
    SUPPORT: "SUPPORT",
    "Start Chat": "Start Chat",
    "Explore Campus": "Explore Campus",
    "Campus Facilities": "Campus Facilities",
    Admissions: "Admissions",
    Courses: "Courses",
    Placements: "Placements",
    "Clubs & Activities": "Clubs & Activities",
    Research: "Research",
    Complaints: "Complaints",
    Feedback: "Feedback",
    "Help & Support": "Help & Support",
    "Ask SDIT SmartBot": "Ask SDIT SmartBot",
    "Discover SDIT": "Discover SDIT",
    "Labs, library & more": "Labs, library & more",
    "Eligibility & process": "Eligibility & process",
    "Programs & departments": "Programs & departments",
    "Training & careers": "Training & careers",
    "Student life": "Student life",
    "Innovation & projects": "Innovation & projects",
    "Report an issue": "Report an issue",
    "Share your experience": "Share your experience",
    "Get assistance": "Get assistance",
  },
  kn: {
    "AI COMMAND": "AI ಕಮಾಂಡ್",
    CAMPUS: "ಕ್ಯಾಂಪಸ್",
    INFORMATION: "ಮಾಹಿತಿ",
    SUPPORT: "ಸಹಾಯ",
    "Start Chat": "ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ",
    "Explore Campus": "ಕ್ಯಾಂಪಸ್ ಅನ್ವೇಷಿಸಿ",
    "Campus Facilities": "ಕ್ಯಾಂಪಸ್ ಸೌಲಭ್ಯಗಳು",
    Admissions: "ಪ್ರವೇಶಗಳು",
    Courses: "ಕೋರ್ಸ್‌ಗಳು",
    Placements: "ಉದ್ಯೋಗ ನಿಯೋಜನೆಗಳು",
    "Clubs & Activities": "ಕ್ಲಬ್‌ಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳು",
    Research: "ಸಂಶೋಧನೆ",
    Complaints: "ದೂರುಗಳು",
    Feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
    "Help & Support": "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
    "Ask SDIT SmartBot": "SDIT SmartBot ಅನ್ನು ಕೇಳಿ",
    "Discover SDIT": "SDIT ಅನ್ವೇಷಿಸಿ",
    "Labs, library & more": "ಪ್ರಯೋಗಾಲಯಗಳು, ಗ್ರಂಥಾಲಯ ಮತ್ತು ಇನ್ನಷ್ಟು",
    "Eligibility & process": "ಅರ್ಹತೆ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ",
    "Programs & departments": "ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ವಿಭಾಗಗಳು",
    "Training & careers": "ತರಬೇತಿ ಮತ್ತು ವೃತ್ತಿ",
    "Student life": "ವಿದ್ಯಾರ್ಥಿ ಜೀವನ",
    "Innovation & projects": "ನಾವೀನ್ಯತೆ ಮತ್ತು ಯೋಜನೆಗಳು",
    "Report an issue": "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    "Share your experience": "ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ",
    "Get assistance": "ಸಹಾಯ ಪಡೆಯಿರಿ",
  },
  ml: {
    "AI COMMAND": "AI കമാൻഡ്",
    CAMPUS: "ക്യാമ്പസ്",
    INFORMATION: "വിവരങ്ങൾ",
    SUPPORT: "സഹായം",
    "Start Chat": "ചാറ്റ് ആരംഭിക്കുക",
    "Explore Campus": "ക്യാമ്പസ് പര്യവേക്ഷണം ചെയ്യുക",
    "Campus Facilities": "ക്യാമ്പസ് സൗകര്യങ്ങൾ",
    Admissions: "പ്രവേശനം",
    Courses: "കോഴ്സുകൾ",
    Placements: "പ്ലേസ്‌മെന്റുകൾ",
    "Clubs & Activities": "ക്ലബ്ബുകളും പ്രവർത്തനങ്ങളും",
    Research: "ഗവേഷണം",
    Complaints: "പരാതികൾ",
    Feedback: "അഭിപ്രായം",
    "Help & Support": "സഹായവും പിന്തുണയും",
    "Ask SDIT SmartBot": "SDIT SmartBot-നോട് ചോദിക്കുക",
    "Discover SDIT": "SDIT കണ്ടെത്തുക",
    "Labs, library & more": "ലാബുകൾ, ലൈബ്രറി എന്നിവയും മറ്റും",
    "Eligibility & process": "യോഗ്യതയും നടപടിക്രമവും",
    "Programs & departments": "പ്രോഗ്രാമുകളും വകുപ്പുകളും",
    "Training & careers": "പരിശീലനവും കരിയറും",
    "Student life": "വിദ്യാർത്ഥി ജീവിതം",
    "Innovation & projects": "നവീകരണവും പദ്ധതികളും",
    "Report an issue": "ഒരു പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
    "Share your experience": "നിങ്ങളുടെ അനുഭവം പങ്കിടുക",
    "Get assistance": "സഹായം നേടുക",
  },
};

export function translate(language: LanguageCode, text: string) {
  return NAV_TRANSLATIONS[language][text] ?? text;
}

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "en" || value === "kn" || value === "ml";
}

export function subscribeToLanguageChange(handler: LanguageChangeHandler) {
  const onLanguageChange = (event: Event) => {
    const language = (event as CustomEvent<LanguageCode>).detail;
    if (isLanguageCode(language)) handler(language);
  };

  window.addEventListener(LANGUAGE_EVENT, onLanguageChange);
  return () => window.removeEventListener(LANGUAGE_EVENT, onLanguageChange);
}
