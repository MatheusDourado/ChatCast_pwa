import Tesseract from 'tesseract.js';

export async function imageToCode(imageDataUrl) {
    const result = await Tesseract.recognize(imageDataUrl, 'eng', { logger: m => console.log(m) });
    return result.text;
}
