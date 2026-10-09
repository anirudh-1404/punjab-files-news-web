/**
 * Universal Multilingual Search Engine for Punjab Files (Frontend Client)
 * Bridges English (Roman), Punjabi (Gurmukhi), and Hindi (Devanagari)
 */

// 1. Script Conversion Mappings
const GURMUKHI_TO_DEVANAGARI = {
  "ੳ": "उ", "ਅ": "अ", "ਆ": "आ", "ਇ": "इ", "ਈ": "ई", "ਉ": "उ", "ਊ": "ऊ", "ਏ": "ए", "ਐ": "ऐ", "ਓ": "ओ", "ਔ": "औ",
  "ਕ": "क", "ਖ": "ख", "ਗ": "ग", "ਘ": "घ", "ਙ": "ङ",
  "ਚ": "च", "ਛ": "छ", "ਜ": "ज", "ਝ": "झ", "ਞ": "ञ",
  "ਟ": "ट", "ਠ": "ठ", "ਡ": "ड", "ਢ": "ढ", "ਣ": "ण",
  "ਤ": "त", "ਥ": "थ", "ਦ": "द", "ਧ": "ध", "ਨ": "न",
  "ਪ": "प", "ਫ": "फ", "ਬ": "ब", "ਭ": "भ", "ਮ": "म",
  "ਯ": "य", "ਰ": "र", "ਲ": "ल", "ਵ": "व", "ੜ": "ड़",
  "ਸ਼": "श", "ਖ਼": "ख़", "ਗ਼": "ग़", "ਜ਼": "ज़", "ਫ਼": "फ़", "ਲ਼": "ळ",
  "ਸ": "स", "ਹ": "ह",
  "ਾ": "ा", "ਿ": "ि", "ੀ": "ी", "ੁ": "ु", "ੂ": "ू", "ੇ": "े", "ੈ": "ै", "ੋ": "ो", "ੌ": "ौ",
  "ੰ": "ं", "ਂ": "ं", "ੱ": "", "੍": "्"
};

const DEVANAGARI_TO_GURMUKHI = {
  "उ": "ਉ", "ਅ": "ਅ", "आ": "ਆ", "इ": "ਇ", "ई": "ਈ", "ऊ": "ਊ", "ए": "ਏ", "ऐ": "ਐ", "ओ": "ਓ", "औ": "ਔ",
  "क": "ਕ", "ਖ": "ਖ", "ग": "ਗ", "घ": "ਘ", "ङ": "ਙ",
  "च": "ਚ", "छ": "ਛ", "ज": "ਜ", "झ": "ਝ", "ञ": "ਞ",
  "ट": "ਟ", "ठ": "ਠ", "ड": "ਡ", "ढ": "ਢ", "ण": "ਣ",
  "त": "ਤ", "थ": "ਥ", "द": "ਦ", "ध": "ਧ", "न": "ਨ",
  "प": "ਪ", "फ": "ਫ", "ब": "ਬ", "भ": "ਭ", "म": "ਮ",
  "य": "ਯ", "र": "ਰ", "ल": "ਲ", "व": "ਵ", "ड़": "ੜ",
  "श": "ਸ਼", "ष": "ਸ਼", "स": "ਸ", "ह": "ਹ",
  "ख़": "ਖ਼", "ग़": "ਗ਼", "ज़": "ਜ਼", "फ़": "ਫ਼",
  "ा": "ਾ", "ि": "ਿ", "ी": "ੀ", "ु": "ੁ", "ू": "ੂ", "े": "ੇ", "ै": "ੈ", "ो": "ੋ", "ौ": "ੌ",
  "ृ": "੍ਰਿ", "ं": "ੰ", "ँ": "ਂ", "्": "੍"
};

export function gurmukhiToDevanagari(text = "") {
  return text.split("").map((c) => GURMUKHI_TO_DEVANAGARI[c] || c).join("");
}

export function devanagariToGurmukhi(text = "") {
  return text.split("").map((c) => DEVANAGARI_TO_GURMUKHI[c] || c).join("");
}

// 2. Comprehensive Multilingual Synonyms & Equivalence Clusters
const WORD_CLUSTERS = [
  // Punjab Regions, Districts & Cities
  ["punjab", "panjab", "ਪੰਜਾਬ", "पंजाब"],
  ["amritsar", "ambarsar", "ਅੰਮ੍ਰਿਤਸਰ", "अमृतसर"],
  ["ludhiana", "ਲੁਧਿਆਣਾ", "लुधियाना"],
  ["jalandhar", "ਜਲੰਧਰ", "जालंधर"],
  ["bathinda", "bhatinda", "ਬਠਿੰਡਾ", "बठिंडा"],
  ["patiala", "ਪਟਿਆਲਾ", "पटियाला"],
  ["mohali", "ਮੋਹਾਲੀ", "ਸਾਸ ਨਗਰ", "मोहाली"],
  ["chandigarh", "ਚੰਡੀਗੜ੍ਹ", "चंडीगढ़"],
  ["tarntaran", "tarn taran", "tarn", "ਤਰਨਤਾਰਨ", "ਤਰਨ-ਤਾਰਨ", "ਤਰਨ", "तरनतारन"],
  ["gurdaspur", "ਗੁਰਦਾਸਪੁਰ", "गुरदासपुर"],
  ["hoshiarpur", "hushiarpur", "ਹੁਸ਼ਿਆਰਪੁਰ", "होशियारपुर"],
  ["kapurthala", "ਕਪੂਰਥਲਾ", "कपूरथला"],
  ["sangrur", "ਸੰਗਰੂਰ", "संगरूर"],
  ["barnala", "ਬਰਨਾਲਾ", "बरनाला"],
  ["mansa", "ਮਾਨਸਾ", "मानसा"],
  ["faridkot", "ਫ਼ਰੀਦਕੋਟ", "ਫਰੀਦਕੋਟ", "फरीदकोट"],
  ["moga", "ਮੋਗਾ", "मोगा"],
  ["ferozepur", "firozpur", "ਫ਼ਿਰੋਜ਼ਪੁਰ", "ਫਿਰੋਜ਼ਪੁਰ", "फिरोजपुर"],
  ["fazilka", "ਫ਼ਾਜ਼ਿਲਕਾ", "ਫਾਜ਼ਿਲਕਾ", "फाजिल्का"],
  ["muktsar", "ਮੁਕਤਸਰ", "ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ", "मुक्तसर"],
  ["rupnagar", "ropar", "ਰੂਪਨਗਰ", "ਰੋਪੜ", "रूपनगर", "रोपड़"],
  ["fatehgarh", "fatehgarh sahib", "ਫ਼ਤਹਿਗੜ੍ਹ", "ਫਤਹਿਗੜ੍ਹ", "ਫਤਹਿਗੜ੍ਹ ਸਾਹਿਬ", "फतेहगढ़"],
  ["malerkotla", "ਮਲੇਰਕੋਟਲਾ", "मलेरकोटला"],
  ["pathankot", "ਪਠਾਨਕੋਟ", "पठानकोट"],
  ["batala", "ਬਟਾਲਾ", "बटाला"],
  ["khanna", "ਖੰਨਾ", "खन्ना"],
  ["phagwara", "ਫਗਵਾੜਾ", "ਫ਼ਗਵਾੜਾ", "फगवाड़ा"],
  ["sunam", "ਸੁਨਾਮ", "सुनाम"],
  ["samana", "ਸਮਾਣਾ", "ਸਮਾਨਾ", "समाना"],
  ["dhuri", "ਧੂਰੀ", "धूरी"],
  ["majha", "ਮਾਝਾ", "माझा"],
  ["malwa", "ਮਾਲਵਾ", "मालवा"],
  ["doaba", "ਦੋਆਬਾ", "दोआबा"],
  ["delhi", "dilli", "ਦਿੱਲੀ", "दिल्ली"],
  ["haryana", "ਹਰਿਆਣਾ", "हरियाणा"],
  ["rajasthan", "ਰਾਜਸਥਾਨ", "राजस्थान"],
  ["himachal", "ਹਿਮਾਚਲ", "हिमाचल"],
  ["jammu", "kashmir", "ਜੰਮੂ", "ਕਸ਼ਮੀਰ", "जम्मू", "कश्मीर"],
  ["india", "bharat", "ਭਾਰਤ", "ਇੰਡੀਆ", "भारत", "इंडिया"],
  ["canada", "kanada", "ਕੈਨੇਡਾ", "ਕੈਨੇਡੀਅਨ", "कनाडा", "कनाडाई"],
  ["surrey", "ਸਰੀ", "सरी"],
  ["brampton", "ਬਰੈਂਪਟਨ", "ब्रैम्पटन"],
  ["toronto", "ਟੋਰਾਂਟੋ", "टोरंटो"],
  ["vancouver", "ਵੈਨਕੂਵਰ", "वैंकूवर"],
  ["america", "usa", "us", "ਅਮਰੀਕਾ", "ਅਮਰੀਕੀ", "ਯੂਐਸਏ", "अमेरिका", "अमेरिकी"],
  ["uk", "england", "london", "ਇੰਗਲੈਂਡ", "ਲੰਡਨ", "ਯੂਕੇ", "इंग्लैंड", "लंदन", "यूके"],
  ["australia", "sydney", "ਆਸਟ੍ਰੇਲੀਆ", "ਸਿਡਨੀ", "ऑस्ट्रेलिया", "सिडनी"],
  ["saudi", "ਸਊਦੀ", "ਸਊਦੀ ਅਰਬ", "सऊदी", "सऊदी अरब"],
  ["israel", "ਇਜ਼ਰਾਈਲ", "ਇਜ਼ਰਾਈਲ", "इजराइल"],

  // Prominent Figures & Political Leaders
  ["mann", "bhagwant mann", "bhagwant", "ਮਾਨ", "ਭਗਵੰਤ ਮਾਨ", "ਭਗਵੰਤ", "मान", "भगवंत मान"],
  ["modi", "narendra modi", "pm modi", "ਮੋਦੀ", "ਨਰਿੰਦਰ ਮੋਦੀ", "मोदी", "नरेंद्र मोदी"],
  ["rahul", "rahul gandhi", "ਰਾਹੁਲ", "ਰਾਹੁਲ ਗਾਂਧੀ", "राहुल", "राहुल गांधी"],
  ["priyanka", "priyanka gandhi", "ਪ੍ਰਿਅੰਕਾ", "ਪ੍ਰਿਯੰਕਾ", "ਪ੍ਰਿਅੰਕਾ ਗਾਂਧੀ", "प्रियंका", "प्रियंका गांधी"],
  ["kejriwal", "arvind kejriwal", "ਕੇਜਰੀਵਾਲ", "ਅਰਵਿੰਦ ਕੇਜਰੀਵਾਲ", "केजरीवाल", "अरविंद केजरीवाल"],
  ["channi", "charanjit channi", "ਚੰਨੀ", "ਚਰਨਜੀਤ ਚੰਨੀ", "ਚਰਨਜੀਤ ਸਿੰਘ ਚੰਨੀ", "चन्नी"],
  ["badal", "sukhbir badal", "parkash singh badal", "ਬਾਦਲ", "ਸੁਖਬੀਰ ਬਾਦਲ", "ਪ੍ਰਕਾਸ਼ ਸਿੰਘ ਬਾਦਲ", "बादल", "सुखबीर बादल"],
  ["majithia", "bikram majithia", "ਮਜੀਠੀਆ", "ਬਿਕਰਮ ਮਜੀਠੀਆ", "मजीठिया", "बिक्रम मजीठिया"],
  ["khaira", "sukhpal khaira", "ਖਹਿਰਾ", "ਸੁਖਪਾਲ ਖਹਿਰਾ", "ਖਹਿਰਾ", "खैरा", "सुखपाल खैरा"],
  ["warring", "raja warring", "ਵੜਿੰਗ", "ਰਾਜਾ ਵੜਿੰਗ", "वड़िंग", "राजा वड़िंग"],
  ["sidhu", "navjot sidhu", "ਸਿੱਧੂ", "ਨਵਜੋਤ ਸਿੱਧੂ", "सिद्धू", "नवजोत सिद्धू"],
  ["moosewala", "sidhu moosewala", "ਮੂਸੇਵਾਲਾ", "ਸਿੱਧੂ ਮੂਸੇਵਾਲਾ", "मूसेवाला", "सिद्धू मूसेवाला"],
  ["diljit", "diljeet", "dosanjh", "diljit dosanjh", "doanjh", "ਦਿਲਜੀਤ", "ਦਿਲਜਿਤ", "ਦੋਸਾਂਝ", "ਦੋਸਾਂਜ", "ਦਿਲਜੀਤ ਦੋਸਾਂਝ", "दिलजीत", "दोसांझ", "दिलजीत दोसांझ"],
  ["amritpal", "amritpal singh", "waris punjab de", "ਅੰਮ੍ਰਿਤਪਾਲ", "ਅੰਮ੍ਰਿਤਪਾਲ ਸਿੰਘ", "ਵਾਰਿਸ ਪੰਜਾਬ ਦੇ", "अमृतपाल", "अमृतपाल सिंह"],
  ["rajoana", "rajoaana", "balwant singh rajoana", "ਰਾਜੋਆਣਾ", "ਰਾਜੋਆਨਾ", "ਬਲਵੰਤ ਸਿੰਘ ਰਾਜੋਆਣਾ", "राजोआना", "राजोआणा"],
  ["bishnoi", "lawrence bishnoi", "ਬਿਸ਼ਨੋਈ", "ਲਾਰੈਂਸ ਬਿਸ਼ਨੋਈ", "बिश्नोई", "लॉरेंस बिश्नोई"],
  ["nana", "patekar", "nana patekar", "ਨਾਨਾ", "ਪਾਟੇਕਰ", "ਨਾਨਾ ਪਾਟੇਕਰ", "नाना", "पाटेकर", "नाना पाटेकर"],
  ["salman", "salman khan", "ਸਲਮਾਨ", "ਸਲਮਾਨ ਖਾਨ", "सलमान", "सलमान खान"],
  ["ghuman", "rajbir ghuman", "ਘੁੰਮਣ", "ਰਾਜਬੀਰ ਘੁੰਮਣ", "घुम्मन", "राजबीर घुम्मन"],
  ["dhami", "advocate dhami", "ਧਾਮੀ", "ਐਡਵੋਕੇਟ ਧਾਮੀ", "ਧਾਮੀ", "धामी", "एडवोकेट धामी"],
  ["chugh", "tarun chugh", "ਚੁੱਘ", "ਤਰੁਣ ਚੁੱਘ", "चुघ", "तरुण चुघ"],
  ["yadav", "gaurav yadav", "ਯਾਦਵ", "ਗੌਰਵ ਯਾਦਵ", "यादव", "गौरव यादव"],
  ["pope", "pope leo", "ਪੋਪ", "ਪੋਪ ਲਿਓ", "पोप"],
  ["harmanpreet", "harmanpreet kaur", "ਹਰਮਨਪ੍ਰੀਤ", "ਹਰਮਨਪ੍ਰੀਤ ਕੌਰ", "हरमनप्रीत", "हरमनप्रीत कौर"],
  ["boota", "boota mohammad", "ਬੂਟਾ", "ਬੂਟਾ ਮੁਹੰਮਦ", "बूटा", "बूटा मोहम्मद"],
  ["sandhu", "mad sandhu", "ਸੰਧੂ", "ਮੈਡ ਸੰਧੂ", "संधू", "मैड संधू"],

  // Government, Law & Institutions
  ["police", "cop", "cops", "sho", "dgp", "asi", "ssp", "ਪੁਲਿਸ", "ਪੁਲਸ", "ਪੁਲਿਸ ਅਫ਼ਸਰ", "ਡੀਜੀਪੀ", "ਐਸਐਚਓ", "ਪੁਲਿਸ ਕਰਮੀ", "पुलिस", "डीजीपी", "एसएचओ"],
  ["cbi", "ਸੀਬੀਆਈ", "ਸੀ.ਬੀ.ਆਈ", "CBI", "सीबीआई"],
  ["ed", "enforcement directorate", "ਈਡੀ", "ED", "ईडी"],
  ["court", "high court", "highcourt", "supreme court", "adalat", "judge", "justice", "ਅਦਾਲਤ", "ਕੋਰਟ", "ਹਾਈ ਕੋਰਟ", "ਸੁਪਰੀਮ ਕੋਰਟ", "ਜੱਜ", "ਜਸਟਿਸ", "अदालत", "कोर्ट", "हाई कोर्ट", "सुप्रीम कोर्ट", "जज"],
  ["jail", "prison", "custody", "remand", "ਜੇਲ੍ਹ", "ਜੇਲ", "ਹਿਰਾਸਤ", "ਰਿਮਾਂਡ", "जेल", "हिरासत", "रिमांड"],
  ["fir", "case", "chawla", "chawla case", "ਐਫਆਈਆਰ", "ਕੇਸ", "ਪਰਚਾ", "ਮਾਮਲਾ", "ਚਾਵਲਾ", "ਚਾਵਲਾ ਕੇਸ", "ਚਾਵਲਾ ਮਾਮਲੇ", "एफआईआर", "केस", "मामला", "चावला"],
  ["sgpc", "shromani committee", "ਐਸਜੀਪੀਸੀ", "ਸ਼੍ਰੋਮਣੀ ਕਮੇਟੀ", "ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ", "SGPC", "एसजीपीसी", "शिरोमणि कमेटी"],
  ["takht", "akal takht", "jathedar", "ਅਕਾਲ ਤਖ਼ਤ", "ਤਖ਼ਤ", "ਜਥੇਦਾਰ", "तख्त", "अकाल तख्त", "जत्थेदार"],
  ["election", "vote", "voter", "bypoll", "chunav", "chonan", "ਚੋਣ", "ਚੋਣਾਂ", "ਵੋਟ", "ਵੋਟਾਂ", "ਉਪ ਚੋਣ", "ਵੋਟਰ", "चुनाव", "वोट", "उपचुनाव"],
  ["bjp", "bhajpa", "ਭਾਜਪਾ", "BJP", "भाजपा"],
  ["congress", "ਕਾਂਗਰਸ", "ਕਾਂਗਰਸੀ", "कांग्रेस"],
  ["aap", "aam aadmi party", "ਆਪ", "ਆਮ ਆਦਮੀ ਪਾਰਟੀ", "AAP", "आप", "आम आदमी पार्टी"],
  ["akali", "akali dal", "sad", "ਅਕਾਲੀ", "ਅਕਾਲੀ ਦਲ", "ਸ਼੍ਰੋਮਣੀ ਅਕਾਲੀ ਦਲ", "अकाली", "अकाली दल"],
  ["government", "sarkar", "governor", "ਸਰਕਾਰ", "ਸਰਕਾਰੀ", "ਰਾਜਪਾਲ", "ਕੇਂਦਰ ਸਰਕਾਰ", "ਪੰਜਾਬ ਸਰਕਾਰ", "सरकार", "सरकारी", "राज्यपाल"],
  ["minister", "mantri", "cm", "chief minister", "pm", "prime minister", "cabinet", "ਮੰਤਰੀ", "ਮੁੱਖ ਮੰਤਰੀ", "ਪ੍ਰਧਾਨ ਮੰਤਰੀ", "ਕੈਬਨਿਟ", "ਵਜ਼ੀਰ", "मंत्री", "मुख्यमंत्री", "प्रधानमंत्री", "कैबिनेट"],
  ["vidhan", "vidhan sabha", "parliament", "lok sabha", "assembly", "ਵਿਧਾਨ ਸਭਾ", "ਲੋਕ ਸਭਾ", "ਸੰਸਦ", "ਵਿਧਾਨ", "विधान सभा", "लोक सभा", "संसद"],

  // Incidents, Accidents, Crime & Law
  ["accident", "crash", "collision", "hadsa", "road accident", "ਹਾਦਸਾ", "ਹਾਦਸੇ", "ਸੜਕ ਹਾਦਸਾ", "ਐਕਸੀਡੈਂਟ", "ਟੱਕਰ", "ਭਿਆਨਕ ਐਕਸੀਡੈਂਟ", "हादसा", "हादसे", "एक्सीडेंट", "टक्कर"],
  ["road", "highway", "flyover", "ਸੜਕ", "ਹਾਈਵੇਅ", "ਹਾਈਵੇ", "HIGHWAY", "ਸੜਕੀ", "ਫਲਾਈਓਵਰ", "सड़क", "हाईवे"],
  ["car", "vehicle", "gaddi", "ਕਾਫ਼ਲਾ", "ਕਾਰ", "ਗੱਡੀ", "ਵਾਹਨ", "कार", "गाड़ी"],
  ["bus", "e-bus", "ਬੱਸ", "ਈ-ਬੱਸ", "बस", "ई-बस"],
  ["train", "rail", "ਰੇਲ", "ਟਰੇਨ", "ਟ੍ਰੇਨ", "ਰੇਲਵੇ", "ट्रेन", "रेल"],
  ["flight", "plane", "airplane", "pilot", "ਫ਼ਲਾਈਟ", "ਫਲਾਈਟ", "ਜਹਾਜ਼", "ਪਾਇਲਟ", "ਫਲਾਈਟਾਂ", "फ्लाइट", "जहाज", "पायलट"],
  ["murder", "killed", "katal", "qatl", "hatya", "killer", "ਕਤਲ", "ਕ*ਤ*ਲ", "ਕਾਤਲ", "ਹੱਤਿਆ", "ਕਤਲਕਾਂਡ", "ਮਾਰ ਦਿੱਤਾ", "कत्ल", "हत्या", "कातिल"],
  ["death", "died", "dead", "demise", "maut", "dihant", "ਮੌਤ", "ਮੌ*ਤ", "ਮੌਤਾਂ", "ਦਿਹਾਂਤ", "ਸਵਰਗਵਾਸ", "ਮਾਰੇ ਗਏ", "मौत", "निधन", "मृत्यु"],
  ["suicide", "khudkushi", "ਖ਼ੁਦਕੁਸ਼ੀ", "ਖ਼ੁ*ਦਕੁ*ਸ਼ੀ", "ਆਤਮ ਹੱਤਿਆ", "ਖੁਦਕੁਸ਼ੀ", "खुदकुशी", "आत्महत्या"],
  ["firing", "shooting", "bullet", "goli", "encounter", "ਗੋਲੀ", "ਗੋਲੀਆਂ", "ਫਾਇਰਿੰਗ", "ਗੋਲੀਬਾਰੀ", "ਐਨਕਾਊਂਟਰ", "गोली", "फायरिंग", "गोलीबारी"],
  ["arrest", "custody", "nabbed", "girftar", "kabu", "ਗ੍ਰਿਫ਼ਤਾਰ", "ਗ੍ਰਿਫਤਾਰ", "ਹਿਰਾਸਤ", "ਕਾਬੂ", "ਗ੍ਰਿਫ਼ਤਾਰੀ", "ਫੜਿਆ", "ਦਬੋਚਿਆ", "गिरफ्तार", "हिरासत", "काबू"],
  ["suspend", "suspended", "ਸਸਪੈਂਡ", "ਮੁਅੱਤਲ", "ਬਰਖ਼ਾਸਤ", "सस्पेंड", "निलंबित"],
  ["gangster", "gang", "gangsters", "ਗੈਂਗਸਟਰ", "ਗੈਂਗ", "ਗਰੋਹ", "ਗੈਂਗਸਟਰਾਂ", "गैंगस्टर", "गैंग"],
  ["crime", "criminal", "jurm", "apradh", "ਜੁਰਮ", "ਅਪਰਾਧ", "ਗੁਨਾਹ", "ਅਪਰਾਧਕ", "ਅਪਰਾਧੀ", "जुर्म", "अपराध", "अपराधी"],
  ["theft", "stolen", "thief", "chori", "loot", "ਚੋਰੀ", "ਚੋਰ", "ਲੁੱਟ", "ਲੁੱਟਮਾਰ", "ਡਕੈਤੀ", "ਚੋਰੀਆਂ", "चोरी", "चोर", "लूट"],
  ["drugs", "smuggler", "smuggling", "nasha", "chitta", "heroin", "opium", "afeem", "ਨਸ਼ਾ", "ਚਿੱਟਾ", "ਤਸਕਰ", "ਨਸ਼ੀਲੇ", "ਅਫ਼ੀਮ", "ਹੈਰੋਇਨ", "ਤਸਕਰੀ", "ਨਸ਼ਿਆਂ", "नशा", "चिट्टा", "तस्कर", "अफीम"],
  ["protest", "dharna", "morcha", "strike", "jam", "agitation", "gherao", "andolan", "ਧਰਨਾ", "ਮੋਰਚਾ", "ਅੰਦੋਲਨ", "ਰੋਸ", "ਘਿਰਾਓ", "ਹੜਤਾਲ", "ਜਾਮ", "JAM", "ਰੋਸ ਪ੍ਰਦਰਸ਼ਨ", "धरना", "मोर्चा", "आंदोलन", "हड़ताल", "जाम", "घेराव"],
  ["fire", "agg", "aag", "blast", "explosion", "ਅੱਗ", "ਧਮਾਕਾ", "ਬਲਾਸਟ", "ਆਗ", "धमाका"],

  // Farmers, Agriculture & Economy
  ["farmer", "farmers", "kisan", "kisana", "kheti", "agriculture", "farming", "crop", "fasal", "ਕਿਸਾਨ", "ਕਿਸਾਨਾਂ", "ਖੇਤੀ", "ਖੇਤੀਬਾੜੀ", "ਫ਼ਸਲ", "ਫਸਲਾਂ", "ਅੰਨਦਾਤਾ", "किसान", "किसानों", "खेती", "कृषि", "फसल"],
  ["wheat", "kanak", "gehun", "ਕਣਕ", "ਗੇਹੂੰ", "गेहूं"],
  ["paddy", "dhan", "jhona", "ਝੋਨਾ", "ਜੀਰੀ", "ਝੋਨੇ", "ਧਾਨ", "धान"],
  ["water", "canal", "pani", "nahar", "ਪਾਣੀ", "ਨਹਿਰ", "ਨਹਿਰੀ", "ਨਹਿਰੀ ਪਾਣੀ", "ਦਰਿਆ", "पानी", "नहर"],
  ["electricity", "power", "powercom", "bijli", "pspcl", "bill", "ਬਿਜਲੀ", "ਪਾਵਰਕੌਮ", "ਬਿੱਲ", "ਬਿਜਲੀ ਬੋਰਡ", "बिजली", "पावरकॉम", "बिल"],

  // Education, Health & Society
  ["school", "schools", "skool", "principal", "education", "shiksha", "ਪ੍ਰਿੰਸੀਪਲ", "ਸਕੂਲ", "ਸਕੂਲਾਂ", "ਪ੍ਰਿੰਸੀਪਲਾਂ", "ਸਿੱਖਿਆ", "ਪੜ੍ਹਾਈ", "ਅਧਿਆਪਕ", "स्कूल", "प्रिंसिपल", "शिक्षा", "अध्यापक"],
  ["college", "colleges", "university", "varsity", "ਕਾਲਜ", "ਕਾਲਜਾਂ", "ਯੂਨੀਵਰਸਿਟੀ", "ਵਰਸਿਟੀ", "कॉलेज", "यूनिवर्सिटी"],
  ["student", "students", "youth", "vidyarthi", "ਵਿਦਿਆਰਥੀ", "ਵਿਦਿਆਰਥੀਆਂ", "ਨੌਜਵਾਨ", "ਨੌਜਵਾਨਾਂ", "ਛਾਤਰ", "विद्यार्थी", "छात्र", "युवा"],
  ["health", "hospital", "doctor", "doctors", "patient", "sehat", "aspataal", "bimari", "ਸਿਹਤ", "ਹਸਪਤਾਲ", "ਅਸਪਤਾਲ", "ਡਾਕਟਰ", "ਮਰੀਜ਼", "ਬਿਮਾਰੀ", "ਇਲਾਜ", "ਦਵਾਈ", "सेहत", "अस्पताल", "डॉक्टर", "मरीज", "इलाज"],

  // Religion, Heritage & Culture
  ["darbar", "darbar sahib", "golden temple", "harmandir sahib", "sachkhand", "ਦਰਬਾਰ", "ਦਰਬਾਰ ਸਾਹਿਬ", "ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ", "ਸੱਚਖੰਡ", "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ", "ਹਰਿਮੰਦਰ", "ਗੋਲਡਨ ਟੈਂਪਲ", "दरबार साहिब", "श्री हरिमंदिर साहिब", "स्वर्ण मंदिर"],
  ["gurdwara", "gurdwara sahib", "ਗੁਰਦੁਆਰਾ", "ਗੁਰਦੁਆਰੇ", "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ", "गुरुद्वारा", "गुरुद्वारा साहिब"],
  ["mandir", "temple", "ਮੰਦਰ", "ਮੰਦਰਾਂ", "मंदिर"],
  ["mukhwak", "hukamnama", "gurbani", "shabad", "ਮੁੱਖਵਾਕ", "ਹੁਕਮਨਾਮਾ", "ਸ਼ਬਦ", "ਗੁਰਬਾਣੀ", "ਕੀਰਤਨ", "मुखवाक", "हुकमनामा", "गुरबाणी"],
  ["virsa", "heritage", "history", "ਵਿਰਾਸਤ", "ਵਿਰਸਾ", "ਸੱਭਿਆਚਾਰ", "ਇਤਿਹਾਸ", "ਹੈਰੀਟੇਜ", "विरासत", "इतिहास", "संस्कृति"],
  ["mela", "fair", "langur", "langur mela", "festival", "ਮੇਲਾ", "ਮੇਲੇ", "ਲੰਗੂਰ", "ਲੰਗੂਰ ਮੇਲਾ", "ਤਿਉਹਾਰ", "मेला", "लंगूर", "लंगूर मेला", "त्योहार"],
  ["dera", "dera sacha sauda", "ਡੇਰਾ", "ਡੇਰਾ ਸੱਚਾ ਸੌਦਾ", "डेरा", "डेरा सच्चा सौदा"],

  // Sports & Entertainment
  ["sports", "sport", "games", "game", "match", "khed", "khedan", "khel", "ਖੇਡ", "ਖੇਡਾਂ", "ਖਿਡਾਰੀ", "ਮੈਚ", "ਟੂਰਨਾਮੈਂਟ", "खेल", "खिलाड़ी", "मैच"],
  ["cricket", "cricketer", "captain", "ਕ੍ਰਿਕਟ", "ਕ੍ਰਿਕਟਰ", "ਕਪਤਾਨ", "ਕਪਤਾਨੀ", "क्रिकेट", "कप्तान"],
  ["kabaddi", "ਕਬੱਡੀ", "कबड्डी"],
  ["cinema", "film", "movie", "theater", "sinema", "ਸਿਨੇਮਾ", "ਫ਼ਿਲਮ", "ਫਿਲਮ", "ਸਿਨੇਮੇ", "ਫ਼ਿਲਮਾਂ", "ਫਿਲਮਾਂ", "ਨਿਰਮਾਤਾ", "सिनेमा", "फिल्म", "मूवी"],
  ["entertainment", "manoranjan", "ਮਨੋਰੰਜਨ", "मनोरंजन"],
  ["singer", "artist", "actor", "actress", "song", "geet", "gaana", "ਗਾਇਕ", "ਗਾਇਕਾ", "ਗਾਇਕੀ", "ਸਿੰਗਰ", "ਗੀਤ", "ਗਾਣੇ", "ਅਦਾਕਾਰ", "ਕਲਾਕਾਰ", "गायक", "गीत", "कलाकार"],

  // Immigration, Visa & Overseas
  ["card", "kard", "green card", "green kard", "greencard", "ਕਾਰਡ", "ਗ੍ਰੀਨ ਕਾਰਡ", "ਗਰੀਨ ਕਾਰਡ", "ਅਮਰੀਕੀ ਗ੍ਰੀਨ ਕਾਰਡ", "ਗ੍ਰੀਨ", "ਗਰੀਨ", "कार्ड", "ग्रीन कार्ड", "ग्रीन"],
  ["visa", "study visa", "pr", "work permit", "ਵੀਜ਼ਾ", "ਸਟੱਡੀ ਵੀਜ਼ਾ", "ਵੀਜ਼ੇ", "ਪੀਆਰ", "ਵਰਕ ਪਰਮਿਟ", "ਵੀਜ਼ਾ", "ਵੀਜ਼ੇ", "वीजा", "वर्क परमिट", "पीआर"],
  ["agent", "travel agent", "fraud", "ਏਜੰਟ", "ਟ੍ਰੈਵਲ ਏਜੰਟ", "ਠੱਗੀ", "ਧੋਖਾਧੜੀ", "ਘੁਟਾਲਾ", "ਏਜੰਟਾਂ", "एजेंट", "ठगी", "घोटाला"]
];

// Compile index map from clusters
const MULTILINGUAL_INDEX = new Map();
WORD_CLUSTERS.forEach((cluster) => {
  cluster.forEach((word) => {
    const key = word.toLowerCase().trim();
    if (!MULTILINGUAL_INDEX.has(key)) {
      MULTILINGUAL_INDEX.set(key, new Set());
    }
    cluster.forEach((w) => MULTILINGUAL_INDEX.get(key).add(w));
  });
});

// 3. Algorithmic English-to-Indic Phonetic Transliteration
export function englishToIndicPhonetic(rawWord = "") {
  const w = rawWord.toLowerCase().trim();
  if (!w) return { gurmukhi: "", devanagari: "" };

  const cMap = [
    ["chh", "ਛ", "छ"], ["kh", "ਖ", "ख"], ["gh", "ਘ", "घ"], ["ch", "ਚ", "च"],
    ["jh", "ਝ", "झ"], ["th", "ਥ", "थ"], ["dh", "ਧ", "ध"], ["ph", "ਫ", "फ"],
    ["bh", "ਭ", "भ"], ["sh", "ਸ਼", "श"], ["k", "ਕ", "क"], ["g", "ਗ", "ग"],
    ["c", "ਕ", "क"], ["j", "ਜ", "ज"], ["z", "ਜ਼", "ज़"], ["t", "ਤ", "त"],
    ["d", "ਦ", "द"], ["n", "ਨ", "न"], ["p", "ਪ", "प"], ["f", "ਫ਼", "फ़"],
    ["b", "ਬ", "ब"], ["m", "ਮ", "म"], ["y", "ਯ", "य"], ["r", "ਰ", "र"],
    ["l", "ਲ", "ल"], ["v", "ਵ", "व"], ["w", "ਵ", "व"], ["s", "ਸ", "स"],
    ["h", "ਹ", "ह"]
  ];

  const vMatraMap = [
    ["ee", "ੀ", "ी"], ["oo", "ੂ", "ू"], ["aa", "ਾ", "ा"],
    ["ai", "ੈ", "ै"], ["au", "ੌ", "ौ"], ["a", "ਾ", "ा"],
    ["i", "ਿ", "ि"], ["u", "ੁ", "ु"], ["e", "ੇ", "े"], ["o", "ੋ", "ो"]
  ];

  const vStartMap = [
    ["aa", "ਆ", "आ"], ["ee", "ਈ", "ई"], ["oo", "ਊ", "ऊ"],
    ["ai", "ਐ", "ऐ"], ["au", "ਔ", "औ"], ["a", "ਅ", "अ"],
    ["i", "ਇ", "इ"], ["u", "ਉ", "उ"], ["e", "ਏ", "ए"], ["o", "ਓ", "ओ"]
  ];

  let i = 0;
  let gurmukhi = "";
  let devanagari = "";
  let prevIsConsonant = false;

  while (i < w.length) {
    let matchedVowel = false;

    if (!prevIsConsonant) {
      for (const [rom, g, d] of vStartMap) {
        if (w.startsWith(rom, i)) {
          gurmukhi += g;
          devanagari += d;
          i += rom.length;
          matchedVowel = true;
          prevIsConsonant = false;
          break;
        }
      }
      if (matchedVowel) continue;
    } else {
      for (const [rom, g, d] of vMatraMap) {
        if (w.startsWith(rom, i)) {
          gurmukhi += (rom === "a" && i + rom.length < w.length) ? "" : g;
          devanagari += (rom === "a" && i + rom.length < w.length) ? "" : d;
          i += rom.length;
          matchedVowel = true;
          prevIsConsonant = false;
          break;
        }
      }
      if (matchedVowel) continue;
    }

    let matchedConsonant = false;
    for (const [rom, g, d] of cMap) {
      if (w.startsWith(rom, i)) {
        gurmukhi += g;
        devanagari += d;
        i += rom.length;
        matchedConsonant = true;
        prevIsConsonant = true;
        break;
      }
    }
    if (matchedConsonant) continue;

    i++;
  }

  return { gurmukhi, devanagari };
}

// 4. Generate English phonetic variations
export function getEnglishPhoneticVariants(word = "") {
  const w = word.toLowerCase().trim();
  const variants = new Set([w]);

  // ee <-> i
  if (w.includes("ee")) variants.add(w.replace(/ee/g, "i"));
  if (w.includes("i")) variants.add(w.replace(/i/g, "ee"));

  // oo <-> u
  if (w.includes("oo")) variants.add(w.replace(/oo/g, "u"));
  if (w.includes("u")) variants.add(w.replace(/u/g, "oo"));

  // aa <-> a
  if (w.includes("aa")) variants.add(w.replace(/aa/g, "a"));

  // card <-> kard
  if (w.includes("card")) variants.add(w.replace(/card/g, "kard"));
  if (w.includes("kard")) variants.add(w.replace(/kard/g, "card"));

  // dosanjh <-> doanjh / dosanj
  if (w === "dosanjh") {
    variants.add("doanjh");
    variants.add("dosanj");
  }
  if (w === "doanjh") {
    variants.add("dosanjh");
  }

  // rajoana <-> rajoaana
  if (w === "rajoana") variants.add("rajoaana");
  if (w === "rajoaana") variants.add("rajoana");

  // diljit <-> diljeet
  if (w === "diljit") variants.add("diljeet");
  if (w === "diljeet") variants.add("diljit");

  return Array.from(variants);
}

/**
 * Universal Query Expander
 * Given ANY search input in English, Gurmukhi, or Devanagari,
 * returns a comprehensive list of search tokens across all 3 languages.
 */
export function expandSearchTerms(searchString = "") {
  if (!searchString || typeof searchString !== "string") return [];

  const rawClean = searchString.trim();
  if (!rawClean) return [];

  const lower = rawClean.toLowerCase();
  const terms = new Set([rawClean, lower]);

  // If query contains Gurmukhi characters, cross-convert to Devanagari
  if (/[\u0A00-\u0A7F]/.test(rawClean)) {
    const devanagariVersion = gurmukhiToDevanagari(rawClean);
    if (devanagariVersion) terms.add(devanagariVersion);
  }

  // If query contains Devanagari characters, cross-convert to Gurmukhi
  if (/[\u0900-\u097F]/.test(rawClean)) {
    const gurmukhiVersion = devanagariToGurmukhi(rawClean);
    if (gurmukhiVersion) terms.add(gurmukhiVersion);
  }

  // Check combined string in index
  const cleanNoHyphen = lower.replace(/[-_]/g, " ").trim();
  if (MULTILINGUAL_INDEX.has(cleanNoHyphen)) {
    MULTILINGUAL_INDEX.get(cleanNoHyphen).forEach((t) => terms.add(t));
  }
  const cleanCondensed = lower.replace(/[-_\s]/g, "");
  if (MULTILINGUAL_INDEX.has(cleanCondensed)) {
    MULTILINGUAL_INDEX.get(cleanCondensed).forEach((t) => terms.add(t));
  }

  // Tokenize words
  const tokens = lower
    .replace(/[^\w\s\u0A00-\u0A7F\u0900-\u097F-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  tokens.forEach((token) => {
    terms.add(token);

    // 1. English phonetic variants
    const englishVariants = getEnglishPhoneticVariants(token);
    englishVariants.forEach((v) => terms.add(v));

    // 2. Multilingual cluster lookup
    if (MULTILINGUAL_INDEX.has(token)) {
      MULTILINGUAL_INDEX.get(token).forEach((t) => terms.add(t));
    }

    // 3. Script cross-translation for tokens
    if (/[\u0A00-\u0A7F]/.test(token)) {
      terms.add(gurmukhiToDevanagari(token));
      const d = gurmukhiToDevanagari(token);
      if (MULTILINGUAL_INDEX.has(d)) {
        MULTILINGUAL_INDEX.get(d).forEach((t) => terms.add(t));
      }
    }
    if (/[\u0900-\u097F]/.test(token)) {
      terms.add(devanagariToGurmukhi(token));
      const g = devanagariToGurmukhi(token);
      if (MULTILINGUAL_INDEX.has(g)) {
        MULTILINGUAL_INDEX.get(g).forEach((t) => terms.add(t));
      }
    }

    // 4. Phonetic transliteration from English to Indic
    if (/^[a-z0-9]+$/i.test(token) && token.length >= 3) {
      const { gurmukhi, devanagari } = englishToIndicPhonetic(token);
      if (gurmukhi && gurmukhi.length >= 2) terms.add(gurmukhi);
      if (devanagari && devanagari.length >= 2) terms.add(devanagari);
    }
  });

  return Array.from(terms).filter((t) => t && t.length >= 2);
}

/**
 * Calculates a relevance score for an article against a search query
 */
export function scoreArticleRelevance(art = {}, searchString = "", expandedTerms = []) {
  let score = 0;
  const title = (art.title || "").toLowerCase();
  const slug = (art.slug || "").toLowerCase();
  const excerpt = (art.excerpt || "").toLowerCase();
  const content = (art.content || "").toLowerCase();
  const category = (art.category || "").toLowerCase();
  const author = (art.authorName || art.author || "").toLowerCase();

  const sLower = searchString.toLowerCase().trim();
  if (!sLower) return 1;

  // Exact phrase match in Title (Massive boost)
  if (title.includes(sLower)) score += 120;
  if (slug.includes(sLower.replace(/\s+/g, "-"))) score += 70;
  if (excerpt.includes(sLower)) score += 50;

  // Check multi-word phrase expansions (e.g. ਗ੍ਰੀਨ ਕਾਰਡ, ਦਿਲਜੀਤ ਦੋਸਾਂਝ)
  expandedTerms.forEach((term) => {
    const t = term.toLowerCase().trim();
    if (!t) return;

    if (t.includes(" ")) {
      if (title.includes(t)) score += 90;
      if (slug.includes(t.replace(/\s+/g, "-"))) score += 60;
      if (excerpt.includes(t)) score += 40;
    } else {
      // Single token match
      if (title.includes(t)) score += 25;
      else if (slug.includes(t)) score += 18;
      else if (excerpt.includes(t)) score += 12;
      else if (category.includes(t)) score += 8;
      else if (author.includes(t)) score += 6;
      else if (content.includes(t)) score += 3;
    }
  });

  // Token completeness bonus: boost articles that match multiple terms from user query
  const tokens = sLower.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    let matchedTokenCount = 0;
    tokens.forEach((tok) => {
      const tokExpanded = expandSearchTerms(tok);
      const isMatched = tokExpanded.some(
        (t) =>
          title.includes(t.toLowerCase()) ||
          slug.includes(t.toLowerCase()) ||
          excerpt.includes(t.toLowerCase())
      );
      if (isMatched) matchedTokenCount++;
    });

    if (matchedTokenCount === tokens.length) {
      score += 80;
    } else if (matchedTokenCount > 1) {
      score += matchedTokenCount * 25;
    }
  }

  return score;
}
