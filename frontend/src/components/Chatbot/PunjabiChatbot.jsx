import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import turbanMascot from '../../assets/turban-mascot.jpg';
import { articleAPI, breakingAPI, mukhwakAPI } from '../../services/api';

export default function PunjabiChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCloud, setShowCloud] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! 🙏 ਮੈਂ ਪੰਜਾਬ ਫਾਈਲਜ਼ (Punjab Files) ਦਾ ਡਿਜੀਟਲ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਤੋਂ ਅੱਜ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ, ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਮੁੱਖ ਵਾਕ, ਪੰਜਾਬ ਦੇ ਖਿੱਤਿਆਂ, ਖੇਡਾਂ ਜਾਂ ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।',
      chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ', '📍 ਮਾਝਾ/ਮਾਲਵਾ/ਦੋਆਬਾ', '📺 ਲਾਈਵ ਟੀਵੀ', '🏏 ਖੇਡਾਂ', '📞 ਦਫ਼ਤਰ ਸੰਪਰਕ']
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Main Intent Resolution & Live Database Search
  const processQuery = async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query) return null;
    const lower = query.toLowerCase();

    // 1. Mukhwak / Hukamnama / Darbar Sahib
    if (
      lower.includes('ਮੁੱਖ ਵਾਕ') ||
      lower.includes('ਮੁੱਖਵਾਕ') ||
      lower.includes('ਹੁਕਮਨਾਮਾ') ||
      lower.includes('ਦਰਬਾਰ ਸਾਹਿਬ') ||
      lower.includes('ਹਰਿਮੰਦਰ ਸਾਹਿਬ') ||
      lower.includes('mukhwak') ||
      lower.includes('hukamnama') ||
      lower.includes('darbar sahib') ||
      lower.includes('golden temple') ||
      lower.includes('gurbani')
    ) {
      try {
        const res = await mukhwakAPI.getToday();
        const data = res?.data;
        if (data && data.gurbani) {
          return {
            text: `ੴ ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ • ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ (${data.date || 'ਅੱਜ'})\n\n📜 ${data.raag || 'ਰਾਗੁ ਸੋਰਠਿ'} • ਅੰਗ: ${data.ang || '੬੫੪'}\n\n"${data.gurbani}"\n\n📌 ਵਿਆਖਿਆ:\n${data.viakhya || 'ਵਿਆਖਿਆ ਹੋਮਪੇਜ ਉੱਤੇ ਉਪਲਬਧ ਹੈ।'}`,
            action: {
              label: 'ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਪੂਰਾ ਮੁੱਖ ਵਾਕ ਦੇਖੋ',
              link: '/'
            },
            chips: ['📰 ਹੋਰ ਖ਼ਬਰਾਂ', '📍 ਪੰਜਾਬ ਖ਼ਬਰਾਂ', '📞 ਦਫ਼ਤਰ ਸੰਪਰਕ']
          };
        }
      } catch (err) {
        console.error('Mukhwak fetch failed in bot:', err);
      }
      return {
        text: "ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ) ਹੋਮਪੇਜ 'ਤੇ ਖੱਬੇ ਪਾਸੇ ਦਿੱਤੇ ਵਿਸ਼ੇਸ਼ ਸੈਕਸ਼ਨ ਵਿੱਚ ਪੂਰੀ ਵਿਆਖਿਆ ਸਮੇਤ ਉਪਲਬਧ ਹੈ।",
        action: { label: 'ਹੋਮਪੇਜ ’ਤੇ ਜਾਓ', link: '/' }
      };
    }

    // 2. Greetings / Introduction / Persona
    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.includes('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ') ||
      lower.includes('sat sri akal') ||
      lower.includes('sasriakal') ||
      lower.includes('namaste') ||
      lower.includes('ਕਿਵੇਂ ਹੋ') ||
      lower.includes('ਕੀ ਹਾਲ') ||
      lower.includes('kaise ho') ||
      lower.includes('kiddan') ||
      lower.includes('who are you') ||
      lower.includes('ਕੌਣ ਹੋ') ||
      lower.includes('kaun ho')
    ) {
      return {
        text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! 🙏 ਮੈਂ ਪੰਜਾਬ ਫਾਈਲਜ਼ ਦਾ ਡਿਜੀਟਲ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਕਿਰਪਾ ਨਾਲ ਸਭ ਚੜ੍ਹਦੀ ਕਲਾ ਹੈ।\n\nਤੁਸੀਂ ਮੇਰੇ ਤੋਂ:\n• 📰 ਤਾਜ਼ਾ ਸੁਰਖੀਆਂ ਤੇ ਬ੍ਰੇਕਿੰਗ ਨਿਊਜ਼\n• ੴ ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਮੁੱਖ ਵਾਕ\n• 📍 ਪੰਜਾਬ (ਮਾਝਾ, ਮਾਲਵਾ, ਦੋਆਬਾ)\n• 🏏 ਖੇਡਾਂ, ਮਨੋਰੰਜਨ, ਸਿਹਤ, ਦੇਸ਼-ਵਿਦੇਸ਼\n• 📺 ਲਾਈਵ ਟੀਵੀ ਬ੍ਰੌਡਕਾਸਟ\n• 📞 ਦਫ਼ਤਰ ਸੰਪਰਕ ਤੇ ਖ਼ਬਰ ਭੇਜਣਾ\n\nਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ!',
        chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ', '🏏 ਖੇਡਾਂ', '📺 ਲਾਈਵ ਟੀਵੀ']
      };
    }

    // 3. Gratitude / Farewell
    if (
      lower.includes('thank') ||
      lower.includes('ਧੰਨਵਾਦ') ||
      lower.includes('dhanwad') ||
      lower.includes('shukriya') ||
      lower.includes('ਮਿਹਰਬਾਨੀ') ||
      lower.includes('bye') ||
      lower.includes('ਅਲਵਿਦਾ') ||
      lower.includes('ਰੱਬ ਰਾਖਾ') ||
      lower.includes('rab rakha')
    ) {
      return {
        text: 'ਜੀ ਆਇਆਂ ਨੂੰ! ਤੁਹਾਡਾ ਬਹੁਤ ਧੰਨਵਾਦ ਜੀ। 🙏 ਪੰਜਾਬ ਫਾਈਲਜ਼ ਨਾਲ ਜੁੜੇ ਰਹੋ। ਜੇਕਰ ਕੋਈ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਬੇਝਿਜਕ ਪੁੱਛੋ। ਰੱਬ ਰਾਖਾ!',
        chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ']
      };
    }

    // 4. Live TV
    if (
      lower.includes('ਲਾਈਵ ਟੀਵੀ') ||
      lower.includes('ਟੀਵੀ') ||
      lower.includes('live tv') ||
      lower.includes('tv') ||
      lower.includes('broadcast') ||
      lower.includes('stream') ||
      lower.includes('video')
    ) {
      return {
        text: '📺 **ਪੰਜਾਬ ਫਾਈਲਜ਼ 24x7 ਲਾਈਵ ਟੀਵੀ (Live Broadcast)**\n\nਸਾਡਾ ਲਾਈਵ ਨਿਊਜ਼ ਬ੍ਰੌਡਕਾਸਟ ਹੋਮਪੇਜ ਦੇ ਸਭ ਤੋਂ ਉੱਪਰਲੇ ਸੈਕਸ਼ਨ ਵਿੱਚ ਲਾਈਵ ਚੱਲ ਰਿਹਾ ਹੈ। ਤੁਸੀਂ 24 ਘੰਟੇ ਬਿਨਾਂ ਕਿਸੇ ਰੁਕਾਵਟ ਦੇ ਹਾਈ-ਡੈਫੀਨੇਸ਼ਨ (HD) ਲਾਈਵ ਸਟ੍ਰੀਮਿੰਗ ਦੇਖ ਸਕਦੇ ਹੋ।',
        action: { label: 'ਲਾਈਵ ਟੀਵੀ ਦੇਖੋ (ਹੋਮਪੇਜ)', link: '/' },
        chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ']
      };
    }

    // 5. Office Contact / Bureau Info
    if (
      lower.includes('ਸੰਪਰਕ') ||
      lower.includes('ਦਫ਼ਤਰ') ||
      lower.includes('contact') ||
      lower.includes('phone') ||
      lower.includes('mobile') ||
      lower.includes('email') ||
      lower.includes('office') ||
      lower.includes('address') ||
      lower.includes('bureau') ||
      lower.includes('ਪਤਾ') ||
      lower.includes('ਨੰਬਰ')
    ) {
      return {
        text: '🏢 **ਦਫ਼ਤਰ ਸੰਪਰਕ ਜਾਣਕਾਰੀ (Head Bureau):**\n\n• **ਮੁੱਖ ਦਫ਼ਤਰ:** SCO 106, 3rd Floor, District Shopping Center, Ranjit Avenue, Amritsar-143001 (Punjab)\n• **ਈਮੇਲ:** info@punjabfiles.com\n• **24x7 ਹੈਲਪਲਾਈਨ:** +91 89093 96233\n\nਤੁਸੀਂ ਸਾਡੇ ਸੰਪਰਕ ਪੰਨੇ ਤੋਂ ਵੀ ਸਿੱਧਾ ਸੁਨੇਹਾ ਜਾਂ ਖ਼ਬਰ ਭੇਜ ਸਕਦੇ ਹੋ।',
        action: { label: 'ਸੰਪਰਕ ਪੰਨੇ ’ਤੇ ਜਾਓ (Contact Us)', link: '/contact' },
        chips: ['✍️ ਖ਼ਬਰ ਕਿਵੇਂ ਭੇਜੀਏ?', '📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ']
      };
    }

    // 6. News Submission / Reporting / Journalist / Staff Login
    if (
      lower.includes('ਖ਼ਬਰ ਭੇਜ') ||
      lower.includes('ਖ਼ਬਰ ਕਿਵੇਂ') ||
      lower.includes('ਪ੍ਰਕਾਸ਼ਕ') ||
      lower.includes('ਰਿਪੋਰਟਰ') ||
      lower.includes('ਲਿਖਣੀ') ||
      lower.includes('publish') ||
      lower.includes('submit news') ||
      lower.includes('journalist') ||
      lower.includes('admin') ||
      lower.includes('login')
    ) {
      return {
        text: '✍️ **ਖ਼ਬਰ ਭੇਜਣ ਅਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਨ ਦਾ ਤਰੀਕਾ:**\n\n1. **ਆਮ ਪਾਠਕ / ਦਰਸ਼ਕ:** ਤੁਸੀਂ ਸਾਡੇ "ਸੰਪਰਕ ਕਰੋ" ਪੰਨੇ ਉੱਤੇ ਜਾ ਕੇ ਆਪਣੀ ਜ਼ਮੀਨੀ ਖ਼ਬਰ ਜਾਂ ਸੁਨੇਹਾ ਸਿੱਧਾ ਸੰਪਾਦਕੀ ਟੀਮ ਨੂੰ ਭੇਜ ਸਕਦੇ ਹੋ।\n2. **ਸਟਾਫ਼ ਪੱਤਰਕਾਰ / ਰਿਪੋਰਟਰ:** ਰਜਿਸਟਰਡ ਰਿਪੋਰਟਰ `/admin` ਪੋਰਟਲ ਤੋਂ ਲੌਗਇਨ ਕਰਕੇ ਆਪਣੀ ਖ਼ਬਰ ਤੁਰੰਤ ਸਮੀਖਿਆ ਲਈ ਦਰਜ ਕਰ ਸਕਦੇ ਹਨ।',
        action: { label: 'ਸੰਪਰਕ ਪੰਨੇ ’ਤੇ ਖ਼ਬਰ ਭੇਜੋ', link: '/contact' },
        chips: ['🔑 ਸਟਾਫ਼ ਲੌਗਇਨ', '📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ']
      };
    }

    // 7. Punjab Regions (Majha, Malwa, Doaba)
    if (
      lower.includes('ਮਾਝਾ') ||
      lower.includes('ਮਾਲਵਾ') ||
      lower.includes('ਦੋਆਬਾ') ||
      lower.includes('majha') ||
      lower.includes('malwa') ||
      lower.includes('doaba')
    ) {
      let regionKey = 'all';
      let regionName = 'ਪੰਜਾਬ';
      if (lower.includes('ਮਾਝਾ') || lower.includes('majha')) {
        regionKey = 'majha';
        regionName = 'ਮਾਝਾ (ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ, ਤਰਨਤਾਰਨ)';
      } else if (lower.includes('ਮਾਲਵਾ') || lower.includes('malwa')) {
        regionKey = 'malwa';
        regionName = 'ਮਾਲਵਾ (ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ, ਸੰਗਰੂਰ)';
      } else if (lower.includes('ਦੋਆਬਾ') || lower.includes('doaba')) {
        regionKey = 'doaba';
        regionName = 'ਦੋਆਬਾ (ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ, ਕਪੂਰਥਲਾ)';
      }

      try {
        const res = await articleAPI.getPublished({
          category: 'punjab',
          punjabRegion: regionKey !== 'all' ? regionKey : undefined,
          limit: 3
        });
        const articles = res?.articles || res?.data || [];
        if (articles.length > 0) {
          return {
            text: `📍 **${regionName} ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ:**`,
            articles: articles.slice(0, 3),
            action: {
              label: `${regionName} ਦੀਆਂ ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਦੇਖੋ`,
              link: regionKey !== 'all' ? `/category/punjab/${regionKey}` : '/category/punjab'
            },
            chips: ['ਮਾਝਾ', 'ਮਾਲਵਾ', 'ਦੋਆਬਾ', '📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ']
          };
        }
      } catch (err) {
        console.error('Region fetch error in bot:', err);
      }

      return {
        text: `ਪੰਜਾਬ ਸੈਕਸ਼ਨ ਵਿੱਚ ਤਿੰਨੋਂ ਖਿੱਤਿਆਂ—ਮਾਝਾ (ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ), ਮਾਲਵਾ (ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ) ਅਤੇ ਦੋਆਬਾ (ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ) ਦੀਆਂ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਵੱਖ-ਵੱਖ ਫਿਲਟਰ ਕਰਕੇ ਦੇਖੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।`,
        action: { label: 'ਪੰਜਾਬ ਖ਼ਬਰਾਂ ਦੇਖੋ', link: '/category/punjab' },
        chips: ['ਮਾਝਾ ਖ਼ਬਰਾਂ', 'ਮਾਲਵਾ ਖ਼ਬਰਾਂ', 'ਦੋਆਬਾ ਖ਼ਬਰਾਂ']
      };
    }

    // 8. Specific News Category Queries
    const categoryMappings = [
      {
        key: 'sports',
        name: 'ਖੇਡਾਂ (Sports)',
        terms: ['ਖੇਡ', 'ਖੇਡਾਂ', 'sports', 'sport', 'cricket', 'ਕ੍ਰਿਕਟ', 'ipl', 'kabaddi', 'ਕਬੱਡੀ', 'hockey', 'football']
      },
      {
        key: 'religion',
        name: 'ਧਰਮ (Religion)',
        terms: ['ਧਰਮ', 'ਧਾਰਮਿਕ', 'religion', 'religious', 'ਗੁਰਦੁਆਰਾ', 'ਸਿੱਖ', 'sikh', 'gurdwara', 'ਸਮਾਗਮ', 'ਸੰਤ']
      },
      {
        key: 'entertainment',
        name: 'ਮਨੋਰੰਜਨ (Entertainment)',
        terms: ['ਮਨੋਰੰਜਨ', 'entertainment', 'cinema', 'film', 'ਫ਼ਿਲਮ', 'ਸਿਨੇਮਾ', 'movie', 'pollywood', 'bollywood', 'ਗੀਤ', 'ਗਾਇਕ', 'music']
      },
      {
        key: 'health',
        name: 'ਸਿਹਤ (Health)',
        terms: ['ਸਿਹਤ', 'health', 'hospital', 'ਡਾਕਟਰ', 'doctor', 'ਦਵਾਈ', 'medicine', 'ਬਿਮਾਰੀ', 'fitness']
      },
      {
        key: 'travel',
        name: 'ਸੈਰ-ਸਪਾਟਾ ਤੇ ਵਿਰਸਾ (Travel)',
        terms: ['ਸੈਰ-ਸਪਾਟਾ', 'ਸੈਰ', 'ਵਿਰਸਾ', 'travel', 'tourism', 'heritage', 'ਸੱਭਿਆਚਾਰ']
      },
      {
        key: 'world',
        name: 'ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)',
        terms: ['ਦੇਸ਼-ਵਿਦੇਸ਼', 'ਵਿਦੇਸ਼', 'ਰਾਸ਼ਟਰੀ', 'world', 'national', 'ਕੈਨੇਡਾ', 'canada', 'ਅਮਰੀਕਾ', 'america', 'usa', 'uk', 'ਦੁਨੀਆ']
      },
      {
        key: 'punjab',
        name: 'ਪੰਜਾਬ (Punjab News)',
        terms: ['ਪੰਜਾਬ', 'punjab', 'panjab', 'ਸਰਕਾਰ', 'ਸਿਆਸਤ', 'ਕਿਸਾਨ', 'farmer', 'kisan', 'ਪੁਲਿਸ', 'police']
      }
    ];

    for (const cat of categoryMappings) {
      if (cat.terms.some((term) => lower.includes(term))) {
        try {
          const res = await articleAPI.getPublished({ category: cat.key, limit: 3 });
          const articles = res?.articles || res?.data || [];
          if (articles.length > 0) {
            return {
              text: `📂 **${cat.name} ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ:**`,
              articles: articles.slice(0, 3),
              action: { label: `${cat.name} ਦੇ ਪੂਰੇ ਪੰਨੇ ’ਤੇ ਜਾਓ`, link: `/category/${cat.key}` },
              chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ', '📺 ਲਾਈਵ ਟੀਵੀ']
            };
          }
        } catch (err) {
          console.error(`Category ${cat.key} bot fetch error:`, err);
        }
      }
    }

    // 9. Breaking News / Latest News / Taza Khabar
    if (
      lower.includes('ਤਾਜ਼ਾ') ||
      lower.includes('ਤਾਜਾ') ||
      lower.includes('ਖ਼ਬਰਾਂ') ||
      lower.includes('ਖਬਰ') ||
      lower.includes('latest') ||
      lower.includes('breaking') ||
      lower.includes('taza') ||
      lower.includes('khabar') ||
      lower.includes('updates') ||
      lower.includes('today') ||
      lower.includes('ਅੱਜ')
    ) {
      try {
        const [artRes, brkRes] = await Promise.allSettled([
          articleAPI.getPublished({ limit: 3 }),
          breakingAPI.getActive()
        ]);

        const articles =
          artRes.status === 'fulfilled' && (artRes.value?.articles || artRes.value?.data || []);
        const breaking =
          brkRes.status === 'fulfilled' && (brkRes.value?.items || brkRes.value?.data || []);

        let summaryText = '📰 **ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ ਅੱਜ ਦੀਆਂ ਤਾਜ਼ਾ ਮੁੱਖ ਸੁਰਖੀਆਂ:**\n';
        if (breaking && breaking.length > 0) {
          summaryText += `\n🔴 **ਬ੍ਰੇਕਿੰਗ ਅੱਪਡੇਟ:** ${breaking[0].text}\n`;
        }

        return {
          text: summaryText,
          articles: Array.isArray(articles) ? articles.slice(0, 3) : [],
          action: { label: 'ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਪੜ੍ਹੋ', link: '/' },
          chips: ['ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ', '🏏 ਖੇਡਾਂ', '📍 ਮਾਝਾ/ਮਾਲਵਾ/ਦੋਆਬਾ', '📺 ਲਾਈਵ ਟੀਵੀ']
        };
      } catch (err) {
        console.error('Latest news bot error:', err);
      }
    }

    // 10. General Search Across Database by User Query
    try {
      const res = await articleAPI.getPublished({ search: query, limit: 3 });
      const articles = res?.articles || res?.data || [];

      if (articles.length > 0) {
        return {
          text: `🔍 **ਤੁਹਾਡੀ ਖੋਜ "${query}" ਨਾਲ ਸੰਬੰਧਿਤ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਮਿਲੀਆਂ ਹਨ:**`,
          articles: articles.slice(0, 3),
          action: {
            label: `ਸਰਚ ਪੰਨੇ ’ਤੇ ਹੋਰ ਨਤੀਜੇ ਦੇਖੋ ("${query}")`,
            link: `/search?q=${encodeURIComponent(query)}`
          },
          chips: ['📰 ਹੋਰ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ', '📞 ਦਫ਼ਤਰ ਸੰਪਰਕ']
        };
      }
    } catch (err) {
      console.error('General search bot error:', err);
    }

    // 11. Smart Contextual Fallback (No dead ends)
    return {
      text: `ਜੀ, "${query}" ਸੰਬੰਧੀ ਸਿੱਧੀ ਖ਼ਬਰ ਇਸ ਵੇਲੇ ਡਾਟਾਬੇਸ ਵਿੱਚ ਨਹੀਂ ਮਿਲੀ।\n\nਪਰ ਤੁਸੀਂ ਹੇਠਾਂ ਦਿੱਤੇ ਮੁੱਖ ਸੈਕਸ਼ਨਾਂ ਵਿੱਚੋਂ ਖ਼ਬਰਾਂ ਦੇਖ ਸਕਦੇ ਹੋ ਜਾਂ ਸਰਚ ਬਾਰ ਰਾਹੀਂ ਖੋਜ ਕਰ ਸਕਦੇ ਹੋ:`,
      chips: [
        '📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ',
        'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ',
        '📍 ਪੰਜਾਬ ਖ਼ਬਰਾਂ',
        '🏏 ਖੇਡਾਂ',
        '📺 ਲਾਈਵ ਟੀਵੀ',
        '📞 ਦਫ਼ਤਰ ਸੰਪਰਕ'
      ],
      action: {
        label: `ਸਰਚ ਪੰਨੇ ’ਤੇ ਖੋਜੋ (${query})`,
        link: `/search?q=${encodeURIComponent(query)}`
      }
    };
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputVal || '').trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputVal('');
    setLoading(true);

    try {
      // Realistic smooth delay for pleasant experience
      await new Promise((resolve) => setTimeout(resolve, 450));
      const response = await processQuery(text);

      if (response) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: response.text,
            articles: response.articles || null,
            action: response.action || null,
            chips: response.chips || null
          }
        ]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਤਕਨੀਕੀ ਕਾਰਨ ਕਰਕੇ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਖ਼ਬਰਾਂ ਦੇਖੋ।',
          chips: ['📰 ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ', 'ੴ ਅੱਜ ਦਾ ਮੁੱਖ ਵਾਕ']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  return (
    <div
      className="punjabi-chatbot-container"
      style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 99990 }}
    >
      {/* Floating animation keyframes and light scrollbar styles */}
      <style>{`
        @keyframes floatSpeechCloud {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes botTypingBounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .punjabi-chat-messages {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        .punjabi-chat-messages::-webkit-scrollbar {
          width: 5px;
          height: 0px;
        }
        .punjabi-chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .punjabi-chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .punjabi-chat-messages::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Floating Turban Mascot Button + Speech Cloud */}
      {!isOpen && (
        <div
          className="turban-chatbot-trigger"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            position: 'relative'
          }}
        >
          {/* Speech Cloud Bubble */}
          {showCloud && (
            <div
              className="turban-speech-cloud"
              onClick={() => setIsOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '9px 13px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '10px',
                maxWidth: '210px',
                position: 'relative',
                fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif",
                lineHeight: '1.4',
                animation: 'floatSpeechCloud 2.8s ease-in-out infinite',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCloud(false);
                }}
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '13px',
                  lineHeight: '1',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title="ਬੰਦ ਕਰੋ"
              >
                ×
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#b71c1c',
                  fontSize: '11px',
                  marginBottom: '2px'
                }}
              >
                <span>ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ!</span>
                <span>🙏</span>
              </div>
              <div style={{ color: '#0f172a' }}>ਕੋਈ ਵੀ ਖ਼ਬਰ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ</div>

              {/* Triangle Tail */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '28px',
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '8px solid #e2e8f0'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '29px',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '7px solid #ffffff'
                }}
              />
            </div>
          )}

          {/* Turban Guy Character Button */}
          <button
            type="button"
            className="turban-chatbot-btn"
            onClick={() => setIsOpen(true)}
            aria-label="ਓਪਨ ਪੰਜਾਬੀ ਸਹਾਇਕ ਚੈਟਬਾਕਸ"
            style={{
              position: 'relative',
              width: '66px',
              height: '66px',
              borderRadius: '50%',
              padding: 0,
              border: '2.5px solid #ebb10d',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              overflow: 'visible',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.18)';
            }}
          >
            <img
              src={turbanMascot}
              alt="Punjabi Mascot"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 10%',
                display: 'block'
              }}
            />

            {/* Online Green Dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                backgroundColor: '#22c55e',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.7)'
              }}
            />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="punjabi-chat-dialog"
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 24px)',
            height: '500px',
            maxHeight: 'min(500px, 80vh)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.16), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Mukta Mahee', 'Noto Sans Gurmukhi', sans-serif"
          }}
        >
          {/* Header - Clean White & Minimalist (No Red) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={turbanMascot}
                alt="ਪੰਜਾਬੀ ਸਹਾਇਕ"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#f8fafc'
                }}
              />
              <div>
                <h5
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#0f172a',
                    letterSpacing: '0.1px'
                  }}
                >
                  ਪੰਜਾਬੀ ਸਹਾਇਕ
                </h5>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'inline-block'
                    }}
                  ></span>
                  ਆਨਲਾਈਨ • ਪੰਜਾਬ ਫਾਈਲਜ਼
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
              title="ਮਿਨੀਮਾਈਜ਼ ਕਰੋ"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div
            className="punjabi-chat-messages"
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '11px'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {m.sender === 'bot' && (
                  <img
                    src={turbanMascot}
                    alt=""
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center 10%',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  />
                )}

                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? '#1e293b' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                    padding: '9px 13px',
                    borderRadius:
                      m.sender === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    boxShadow:
                      m.sender === 'user'
                        ? '0 2px 6px rgba(30, 41, 59, 0.15)'
                        : '0 1px 3px rgba(0,0,0,0.05)',
                    border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}
                >
                  {/* Message Main Text */}
                  <div>{m.text}</div>

                  {/* Dynamic Article Cards */}
                  {m.articles && m.articles.length > 0 && (
                    <div
                      style={{
                        marginTop: '9px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      {m.articles.map((art, aIdx) => (
                        <div
                          key={aIdx}
                          onClick={() => handleNavigate(`/article/${art.slug || art._id}`)}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '7px',
                            padding: '7px 9px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }}
                        >
                          {art.featuredImage && (
                            <img
                              src={art.featuredImage}
                              alt=""
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '5px',
                                objectFit: 'cover',
                                flexShrink: 0
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#0f172a',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {art.title}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#2563eb',
                                fontWeight: '600',
                                marginTop: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <span>ਪੜ੍ਹੋ</span>
                              <i className="fa fa-angle-right" style={{ fontSize: '10px' }}></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Primary Action Button */}
                  {m.action && (
                    <div style={{ marginTop: '9px' }}>
                      <button
                        type="button"
                        onClick={() => handleNavigate(m.action.link)}
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a',
                          border: '1px solid #cbd5e1',
                          padding: '5px 11px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0f172a';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#0f172a';
                        }}
                      >
                        <span>{m.action.label}</span>
                        <i className="fa fa-arrow-right" style={{ fontSize: '10px' }}></i>
                      </button>
                    </div>
                  )}

                  {/* Contextual Chips */}
                  {m.chips && m.chips.length > 0 && (
                    <div
                      style={{
                        marginTop: '9px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '5px'
                      }}
                    >
                      {m.chips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSend(chip.replace(/^[^\w\s\u0A00-\u0A7F]+/, '').trim())}
                          style={{
                            fontSize: '11px',
                            background: '#ffffff',
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#94a3b8';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <img
                  src={turbanMascot}
                  alt=""
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center 10%',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '7px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#64748b',
                      display: 'inline-block',
                      animation: 'botTypingBounce 1.4s infinite ease-in-out both'
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#94a3b8',
                      display: 'inline-block',
                      animation: 'botTypingBounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.2s'
                    }}
                  />
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#cbd5e1',
                      display: 'inline-block',
                      animation: 'botTypingBounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.4s'
                    }}
                  />
                  <span
                    style={{
                      marginLeft: '6px',
                      fontSize: '11px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}
                  >
                    ਜਵਾਬ ਲੱਭ ਰਿਹਾ ਹੈ...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer - Clean Minimalist Pill */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 10px',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#ffffff',
              gap: '6px'
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '2px 12px'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="ਕੁਝ ਵੀ ਪੁੱਛੋ (Ask any question)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '7px 0',
                  fontSize: '13px',
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              style={{
                backgroundColor: inputVal.trim() && !loading ? '#0f172a' : '#e2e8f0',
                color: inputVal.trim() && !loading ? '#ffffff' : '#94a3b8',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '12px',
                cursor: inputVal.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              title="ਸੁਨੇਹਾ ਭੇਜੋ"
            >
              <i className="fa fa-paper-plane" style={{ marginLeft: '-1px' }}></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
