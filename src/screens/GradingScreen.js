import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { extractNumberFromSpeech } from '../utils/DataProcessor';

const GradingScreen = () => {
  // استدعاء الدوال من الخطاف المخصص للصوت
  const { 
    isListening, 
    recognizedText, 
    voiceError, 
    startListening, 
    stopListening, 
    speak, 
    setRecognizedText 
  } = useVoiceAssistant();

  // حالة (State) لحفظ بيانات التلميذ الحالي والنقطة
  const [currentStudent, setCurrentStudent] = useState('شيباني محمد'); // اسم تجريبي
  const [gradeType, setGradeType] = useState('الفرض'); // هل نحن نرصد الفرض أم الاختبار؟
  const [lastGrade, setLastGrade] = useState(null);

  // مراقبة النص المسموع ومعالجته فوراً
  useEffect(() => {
    if (recognizedText) {
      // 1. استخراج الرقم من كلام الأستاذ
      const grade = extractNumberFromSpeech(recognizedText);
      
      if (grade !== null) {
        // 2. إذا فهم التطبيق الرقم، يقوم بتسجيله ونطقه
        setLastGrade(grade);
        speak(`سجلت ${grade} في ${gradeType}.`);
        
        // هنا لاحقاً سنضيف كود (حفظ النقطة في الإكسل)
        
        // تفريغ النص للتمكن من استقبال النقطة التالية
        setRecognizedText(''); 
      } else {
        // 3. إذا لم يفهم الرقم
        speak("عذراً، أعد نطق النقطة بوضوح.");
        setRecognizedText('');
      }
    }
  }, [recognizedText]);

  // دالة التعامل مع زر الميكروفون
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      speak(`أعطني نقطة ${gradeType} للتلميذ ${currentStudent}`);
      setTimeout(() => {
        startListening();
      }, 2000); // ننتظر ثانيتين حتى يكمل التطبيق كلامه ثم نفتح الميكروفون
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* رأس الشاشة */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>مساعد الرصد الذكي</Text>
      </View>

      {/* بطاقة التلميذ الحالي */}
      <View style={styles.studentCard}>
        <Text style={styles.studentName}>{currentStudent}</Text>
        <Text style={styles.gradeType}>نحن نرصد الآن: {gradeType}</Text>
        
        {lastGrade !== null && (
          <Text style={styles.resultText}>آخر نقطة مسجلة: {lastGrade}</Text>
        )}
      </View>

      {/* منطقة التنبيهات والأخطاء */}
      <View style={styles.statusArea}>
        {isListening && <Text style={styles.listeningText}>🎙️ أنا أستمع إليك...</Text>}
        {recognizedText ? <Text style={styles.recognizedText}>سمعت: "{recognizedText}"</Text> : null}
        {voiceError && <Text style={styles.errorText}>خطأ: {voiceError}</Text>}
      </View>

      {/* زر الميكروفون الكبير */}
      <TouchableOpacity 
        style={[styles.micButton, isListening ? styles.micButtonActive : null]} 
        onPress={toggleListening}
      >
        <Text style={styles.micButtonText}>
          {isListening ? 'إيقاف الاستماع' : 'اضغط للتحدث'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// تنسيقات الشاشة (CSS في React Native)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 10,
  },
  gradeType: {
    fontSize: 18,
    color: '#7F8C8D',
  },
  resultText: {
    fontSize: 20,
    color: '#27AE60',
    marginTop: 20,
    fontWeight: 'bold',
  },
  statusArea: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningText: {
    fontSize: 18,
    color: '#E67E22',
    fontWeight: 'bold',
  },
  recognizedText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 5,
  },
  micButton: {
    backgroundColor: '#3498DB',
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    shadowColor: '#3498DB',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#E74C3C',
  },
  micButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GradingScreen;