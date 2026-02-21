import Tesseract from 'tesseract.js';

export const performOCR = async (imageFile) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      { logger: m => console.log(m) }
    );
    
    // Regex for CM/L-1234567 or CM/L 1234567
    const cmlRegex = /CM\/L[-\s]?\d{5,10}/i;
    const match = text.match(cmlRegex);
    
    return match ? match[0].toUpperCase().replace(/\s/g, '-') : null;
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};
