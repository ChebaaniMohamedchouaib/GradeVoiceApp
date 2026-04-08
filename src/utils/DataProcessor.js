// دالة لاستخراج الأرقام من النص المسموع
export const extractNumberFromSpeech = (speechText) => {
  if (!speechText) return null;

  // التحقق من حالة الغياب
  if (speechText.includes('غائب') || speechText.includes('غياب')) {
    return 0; // نعطي التلميذ 0 في حالة الغياب
  }

  // محاولة استخراج الأرقام الصريحة (مثل: "15" أو "14.5")
  const numericMatch = speechText.match(/\d+(\.\d+)?/);
  if (numericMatch) {
    return parseFloat(numericMatch[0]);
  }

  // إذا لم يجد رقماً، نرجع null ليقوم التطبيق بطلب الإعادة
  return null;
};

// دالة البحث الذكي عن الأسماء (للبحث العشوائي الذي ناقشناه)
export const findStudentByName = (spokenName, studentsArray) => {
  if (!spokenName || !studentsArray) return null;
  
  // نقوم بتنظيف النص وإزالة المسافات الزائدة
  const cleanSpokenName = spokenName.trim().toLowerCase();

  // نبحث عن أقرب تطابق (يمكنك لاحقاً تطويرها باستخدام مكتبة Fuse.js لدقة أعلى)
  const matchedStudent = studentsArray.find(student => {
    const fullName = `${student['لقب']} ${student['اسم']}`.toLowerCase();
    return fullName.includes(cleanSpokenName) || cleanSpokenName.includes(fullName);
  });

  return matchedStudent;
};