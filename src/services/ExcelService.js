import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

// 1. دالة قراءة ملف الإكسل وتحويله إلى بيانات برمجية (JSON)
export const readExcelFile = async (filePath) => {
  try {
    // قراءة الملف كنص ثنائي (Base64) لتوافق أفضل مع أندرويد
    const fileContent = await RNFS.readFile(filePath, 'base64');
    
    // تحويل المحتوى إلى Workbook (ملف إكسل مقروء برمجياً)
    const workbook = XLSX.read(fileContent, { type: 'base64' });
    
    // جلب الورقة الأولى من الملف
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // تحويل الورقة إلى مصفوفة بيانات (JSON)
    // defval: "" يمنع المكتبة من تجاهل الخلايا الفارغة لكي لا يختل ترتيب البيانات
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); 
    
    return data;
  } catch (error) {
    console.error("خطأ في قراءة ملف الإكسل: ", error);
    throw error;
  }
};

// 2. دالة التعرف الذكي على الأعمدة (Header Mapping)
export const extractColumns = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null;
  
  // نأخذ الصف الأول لنستخرج منه العناوين
  const headers = Object.keys(dataArray[0]);
  
  return {
    nameCol: headers.find(h => h.includes('اسم') || h.includes('Name')) || headers[0],
    familyCol: headers.find(h => h.includes('لقب') || h.includes('Family')),
    assignmentCol: headers.find(h => h.includes('فرض') || h.includes('تقويم')) || "نقطة الفرض",
    examCol: headers.find(h => h.includes('اختبار') || h.includes('امتحان')) || "نقطة الاختبار",
    averageCol: headers.find(h => h.includes('معدل')) || "المعدل",
    remarkCol: headers.find(h => h.includes('ملاحظة')) || "الملاحظة"
  };
};

// 3. دالة الحفظ (الكتابة فوق الملف الأصلي)
export const saveExcelFile = async (updatedData, originalFilePath) => {
  try {
    // إنشاء ورقة عمل جديدة من البيانات المحدثة
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    
    // إنشاء ملف إكسل جديد ووضع الورقة فيه
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "النتائج");
    
    // تحويل الملف إلى Base64 استعداداً لحفظه
    const base64Data = XLSX.write(newWorkbook, { type: 'base64', bookType: 'xlsx' });
    
    // الكتابة فوق الملف الأصلي في الهاتف
    await RNFS.writeFile(originalFilePath, base64Data, 'base64');
    console.log("تم تحديث وحفظ ملف الإكسل بنجاح!");
    
    return true;
  } catch (error) {
    console.error("حدث خطأ أثناء حفظ الملف: ", error);
    return false;
  }
};