import { useState, useEffect } from 'react';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  useEffect(() => {
    // 1. إعداد محرك النطق (Text-To-Speech)
    // نختار اللغة العربية، ونبطئ السرعة قليلاً ليكون الصوت واضحاً للأستاذ
    Tts.setDefaultLanguage('ar-SA'); 
    Tts.setDefaultRate(0.45);
    Tts.setDefaultPitch(1.0);

    // 2. إعداد مستمعات أحداث الميكروفون (Speech-To-Text)
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setVoiceError(null);
    };
    
    Voice.onSpeechEnd = () => setIsListening(false);
    
    Voice.onSpeechError = (e) => {
      setIsListening(false);
      setVoiceError(e.error?.message);
    };
    
    Voice.onSpeechResults = (e) => {
      // محرك جوجل يرجع مصفوفة من الاحتمالات، نأخذ الاحتمال الأول (الأكثر دقة)
      if (e.value && e.value.length > 0) {
        setRecognizedText(e.value[0]);
      }
    };

    // تنظيف المستمعات عند إغلاق الشاشة لتجنب تسرب الذاكرة
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // دالة بدء الاستماع (نحدد اللغة العربية)
  const startListening = async () => {
    setRecognizedText('');
    setVoiceError(null);
    try {
      await Voice.start('ar-DZ'); // يمكنك تغييرها لـ ar-SA حسب استجابة محرك هاتفك
    } catch (e) {
      console.error("خطأ في تشغيل الميكروفون:", e);
    }
  };

  // دالة إيقاف الاستماع يدوياً
  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  // دالة نطق النصوص
  const speak = (text) => {
    Tts.speak(text);
  };

  return {
    isListening,
    recognizedText,
    voiceError,
    startListening,
    stopListening,
    speak,
    setRecognizedText // نحتاجها لتفريغ النص بعد معالجته
  };
};