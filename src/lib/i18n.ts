export type Language = 'en' | 'hi';

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.schemes': { en: 'Schemes', hi: 'योजनाएं' },
  'nav.search': { en: 'Search', hi: 'खोजें' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
  'nav.admin': { en: 'Admin Panel', hi: 'एडमिन पैनल' },
  'nav.login': { en: 'Login', hi: 'लॉगिन' },
  'nav.register': { en: 'Register', hi: 'पंजीकरण' },
  'nav.logout': { en: 'Logout', hi: 'लॉगआउट' },
  'nav.eligibility': { en: 'Eligibility', hi: 'पात्रता जाँच' },
  'nav.compare': { en: 'Compare', hi: 'तुलना करें' },
  'nav.saved': { en: 'Saved', hi: 'सहेजे गए' },
  'nav.eligibilityChecker': { en: 'Eligibility Checker', hi: 'पात्रता जाँचकर्ता' },
  'nav.compareSchemes': { en: 'Compare Schemes', hi: 'योजनाओं की तुलना' },
  'nav.savedSchemes': { en: 'Saved Schemes', hi: 'सहेजी गई योजनाएं' },

  // Landing
  'landing.title': { en: 'Rural Services Portal', hi: 'ग्रामीण सेवा पोर्टल' },
  'landing.subtitle': { en: 'Empowering Rural India with Government Schemes & Services', hi: 'सरकारी योजनाओं और सेवाओं से ग्रामीण भारत को सशक्त बनाना' },
  'landing.cta': { en: 'Explore Schemes', hi: 'योजनाएं देखें' },
  'landing.login': { en: 'Login / Register', hi: 'लॉगिन / पंजीकरण' },

  // Categories
  'category.farmers': { en: 'Farmers', hi: 'किसान' },
  'category.students': { en: 'Students', hi: 'छात्र' },
  'category.women': { en: 'Women', hi: 'महिलाएं' },
  'category.general': { en: 'General', hi: 'सामान्य' },
  'category.farmers.desc': { en: 'Agriculture schemes, subsidies & support', hi: 'कृषि योजनाएं, सब्सिडी और सहायता' },
  'category.students.desc': { en: 'Scholarships, education & skill development', hi: 'छात्रवृत्ति, शिक्षा और कौशल विकास' },
  'category.women.desc': { en: 'Women welfare, empowerment & safety', hi: 'महिला कल्याण, सशक्तिकरण और सुरक्षा' },
  'category.general.desc': { en: 'General welfare & development schemes', hi: 'सामान्य कल्याण और विकास योजनाएं' },

  // Scheme labels
  'scheme.apply': { en: 'Apply Now', hi: 'अभी आवेदन करें' },
  'scheme.eligibility': { en: 'Eligibility', hi: 'पात्रता' },
  'scheme.funding': { en: 'Funding', hi: 'वित्तपोषण' },
  'scheme.type': { en: 'Type', hi: 'प्रकार' },
  'scheme.central': { en: 'Central', hi: 'केंद्रीय' },
  'scheme.state': { en: 'State', hi: 'राज्य' },
  'scheme.details': { en: 'Details', hi: 'विवरण' },
  'scheme.benefits': { en: 'Benefits', hi: 'लाभ' },
  'scheme.documents': { en: 'Required Documents', hi: 'आवश्यक दस्तावेज़' },
  'scheme.helpline': { en: 'Helpline', hi: 'हेल्पलाइन' },
  'scheme.popular': { en: 'Popular', hi: 'लोकप्रिय' },
  'scheme.faq': { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  'scheme.category': { en: 'Category', hi: 'श्रेणी' },
  'scheme.save': { en: 'Save Scheme', hi: 'योजना सहेजें' },
  'scheme.saved': { en: 'Saved', hi: 'सहेजा गया' },
  'scheme.removedFromSaved': { en: 'Removed from saved', hi: 'सहेजे गए से हटाया गया' },
  'scheme.schemeSaved': { en: 'Scheme saved!', hi: 'योजना सहेजी गई!' },
  'scheme.loginToSave': { en: 'Please login to save schemes', hi: 'योजनाएं सहेजने के लिए लॉगिन करें' },
  'scheme.notFound': { en: 'Scheme not found', hi: 'योजना नहीं मिली' },

  // Search
  'search.placeholder': { en: 'Search schemes...', hi: 'योजनाएं खोजें...' },
  'search.voice': { en: 'Voice Search', hi: 'वॉइस खोज' },
  'search.filter': { en: 'Filter', hi: 'फ़िल्टर' },
  'search.noResults': { en: 'No schemes found', hi: 'कोई योजना नहीं मिली' },
  'search.allCategories': { en: 'All Categories', hi: 'सभी श्रेणियाँ' },
  'search.allTypes': { en: 'All Types', hi: 'सभी प्रकार' },
  'search.allStates': { en: 'All States', hi: 'सभी राज्य' },
  'search.schemesFound': { en: 'scheme(s) found', hi: 'योजना(एं) मिलीं' },
  'search.loadMore': { en: 'Load More', hi: 'और लोड करें' },
  'search.remaining': { en: 'remaining', hi: 'शेष' },

  // Auth
  'auth.email': { en: 'Email', hi: 'ईमेल' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड' },
  'auth.fullName': { en: 'Full Name', hi: 'पूरा नाम' },
  'auth.loginTitle': { en: 'Welcome Back', hi: 'स्वागत है' },
  'auth.registerTitle': { en: 'Create Account', hi: 'खाता बनाएं' },
  'auth.noAccount': { en: "Don't have an account?", hi: 'खाता नहीं है?' },
  'auth.hasAccount': { en: 'Already have an account?', hi: 'पहले से खाता है?' },

  // Admin
  'admin.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'admin.schemes': { en: 'Manage Schemes', hi: 'योजना प्रबंधन' },
  'admin.upload': { en: 'Upload Excel', hi: 'एक्सेल अपलोड' },
  'admin.addScheme': { en: 'Add Scheme', hi: 'योजना जोड़ें' },
  'admin.editScheme': { en: 'Edit Scheme', hi: 'योजना संपादित करें' },
  'admin.totalSchemes': { en: 'Total Schemes', hi: 'कुल योजनाएं' },

  // Eligibility Checker
  'eligibility.enterDetails': { en: 'Enter Your Details', hi: 'अपना विवरण दर्ज करें' },
  'eligibility.selectCategory': { en: 'Select category', hi: 'श्रेणी चुनें' },
  'eligibility.gender': { en: 'Gender', hi: 'लिंग' },
  'eligibility.selectGender': { en: 'Select gender', hi: 'लिंग चुनें' },
  'eligibility.male': { en: 'Male', hi: 'पुरुष' },
  'eligibility.female': { en: 'Female', hi: 'महिला' },
  'eligibility.other': { en: 'Other', hi: 'अन्य' },
  'eligibility.income': { en: 'Annual Income Range', hi: 'वार्षिक आय सीमा' },
  'eligibility.selectIncome': { en: 'Select income', hi: 'आय चुनें' },
  'eligibility.below1l': { en: 'Below ₹1,00,000', hi: '₹1,00,000 से कम' },
  'eligibility.above10l': { en: 'Above ₹10,00,000', hi: '₹10,00,000 से अधिक' },
  'eligibility.selectState': { en: 'Select state', hi: 'राज्य चुनें' },
  'eligibility.occupation': { en: 'Occupation', hi: 'व्यवसाय' },
  'eligibility.occupationPlaceholder': { en: 'e.g. Farmer, Student, Self-employed', hi: 'जैसे किसान, छात्र, स्वरोजगार' },
  'eligibility.checkButton': { en: 'Check Eligibility', hi: 'पात्रता जाँचें' },
  'eligibility.schemesFound': { en: 'Eligible Scheme(s) Found', hi: 'पात्र योजना(एं) मिलीं' },

  // Common
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.save': { en: 'Save', hi: 'सहेजें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.delete': { en: 'Delete', hi: 'हटाएं' },
  'common.edit': { en: 'Edit', hi: 'संपादित करें' },
  'common.back': { en: 'Back', hi: 'वापस' },

  // Carousel
  'carousel.farmerTitle': { en: 'Empowering Farmers', hi: 'किसानों को सशक्त बनाना' },
  'carousel.farmerSubtitle': { en: 'Access subsidies, loans & agricultural support schemes', hi: 'सब्सिडी, ऋण और कृषि सहायता योजनाएं प्राप्त करें' },
  'carousel.studentTitle': { en: 'Bright Futures for Students', hi: 'छात्रों के लिए उज्ज्वल भविष्य' },
  'carousel.studentSubtitle': { en: 'Scholarships, skill development & education support', hi: 'छात्रवृत्ति, कौशल विकास और शिक्षा सहायता' },
  'carousel.womenTitle': { en: 'Women Empowerment', hi: 'महिला सशक्तिकरण' },
  'carousel.womenSubtitle': { en: 'Safety, welfare & financial independence schemes', hi: 'सुरक्षा, कल्याण और वित्तीय स्वतंत्रता योजनाएं' },

  // Footer
  'footer.portal': { en: 'Portal', hi: 'पोर्टल' },
  'footer.home': { en: 'Home', hi: 'होम' },
  'footer.searchSchemes': { en: 'Search Schemes', hi: 'योजनाएँ खोजें' },
  'footer.allSchemes': { en: 'All Schemes', hi: 'सभी योजनाएँ' },
  'footer.categories': { en: 'Categories', hi: 'श्रेणियाँ' },
  'footer.information': { en: 'Information', hi: 'जानकारी' },
  'footer.about': { en: 'About', hi: 'हमारे बारे में' },
  'footer.contact': { en: 'Contact', hi: 'संपर्क' },
  'footer.disclaimer': { en: 'Disclaimer', hi: 'अस्वीकरण' },
  'footer.privacyPolicy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
  'footer.dataSources': { en: 'Data Sources', hi: 'डेटा स्रोत' },
  'footer.copyright': { en: 'For informational purposes only.', hi: 'केवल जानकारी के उद्देश्य से।' },
};

// Dynamic value translation map — translates DB values to Hindi
const dynamicTranslations: Record<string, Record<Language, string>> = {
  // Categories
  'Farmers': { en: 'Farmers', hi: 'किसान' },
  'Students': { en: 'Students', hi: 'छात्र' },
  'Women': { en: 'Women', hi: 'महिलाएं' },
  'General': { en: 'General', hi: 'सामान्य' },

  // Types
  'Central': { en: 'Central', hi: 'केंद्रीय' },
  'State': { en: 'State', hi: 'राज्य' },

  // Indian states
  'All India': { en: 'All India', hi: 'संपूर्ण भारत' },
  'Andhra Pradesh': { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' },
  'Arunachal Pradesh': { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश' },
  'Assam': { en: 'Assam', hi: 'असम' },
  'Bihar': { en: 'Bihar', hi: 'बिहार' },
  'Chhattisgarh': { en: 'Chhattisgarh', hi: 'छत्तीसगढ़' },
  'Goa': { en: 'Goa', hi: 'गोवा' },
  'Gujarat': { en: 'Gujarat', hi: 'गुजरात' },
  'Haryana': { en: 'Haryana', hi: 'हरियाणा' },
  'Himachal Pradesh': { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश' },
  'Jharkhand': { en: 'Jharkhand', hi: 'झारखंड' },
  'Karnataka': { en: 'Karnataka', hi: 'कर्नाटक' },
  'Kerala': { en: 'Kerala', hi: 'केरल' },
  'Madhya Pradesh': { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' },
  'Maharashtra': { en: 'Maharashtra', hi: 'महाराष्ट्र' },
  'Manipur': { en: 'Manipur', hi: 'मणिपुर' },
  'Meghalaya': { en: 'Meghalaya', hi: 'मेघालय' },
  'Mizoram': { en: 'Mizoram', hi: 'मिज़ोरम' },
  'Nagaland': { en: 'Nagaland', hi: 'नागालैंड' },
  'Odisha': { en: 'Odisha', hi: 'ओडिशा' },
  'Punjab': { en: 'Punjab', hi: 'पंजाब' },
  'Rajasthan': { en: 'Rajasthan', hi: 'राजस्थान' },
  'Sikkim': { en: 'Sikkim', hi: 'सिक्किम' },
  'Tamil Nadu': { en: 'Tamil Nadu', hi: 'तमिलनाडु' },
  'Telangana': { en: 'Telangana', hi: 'तेलंगाना' },
  'Tripura': { en: 'Tripura', hi: 'त्रिपुरा' },
  'Uttar Pradesh': { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' },
  'Uttarakhand': { en: 'Uttarakhand', hi: 'उत्तराखंड' },
  'West Bengal': { en: 'West Bengal', hi: 'पश्चिम बंगाल' },
  'Delhi': { en: 'Delhi', hi: 'दिल्ली' },
  'Jammu and Kashmir': { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर' },
  'Ladakh': { en: 'Ladakh', hi: 'लद्दाख' },
  'Puducherry': { en: 'Puducherry', hi: 'पुदुचेरी' },
  'Chandigarh': { en: 'Chandigarh', hi: 'चंडीगढ़' },

  // Common labels used in data
  'Yes': { en: 'Yes', hi: 'हाँ' },
  'No': { en: 'No', hi: 'नहीं' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}

/** Translate a dynamic database value (category, type, state, etc.) */
export function td(value: string | null | undefined, lang: Language): string {
  if (!value) return '';
  return dynamicTranslations[value]?.[lang] ?? value;
}
