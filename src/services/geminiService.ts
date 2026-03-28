import { GoogleGenAI } from "@google/genai";
import { ISODocument } from "../types";

export const askAIAboutISO = async (query: string, documents: ISODocument[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  
  // Prepare context from documents that have contentText
  const context = documents
    .filter(doc => doc.contentText)
    .map(doc => `[Tài liệu: ${doc.code} - ${doc.title}]\nNội dung: ${doc.contentText?.substring(0, 2000)}...`) // Limit context size
    .join('\n\n---\n\n');

  if (!context) {
    return "Hệ thống chưa có dữ liệu nội dung tài liệu để trả lời. Vui lòng tải lên tài liệu và chờ xử lý AI.";
  }

  const prompt = `
    Bạn là một chuyên gia về hệ thống quản lý chất lượng ISO. 
    Dưới đây là nội dung trích xuất từ các tài liệu ISO của công ty:
    
    ${context}
    
    Dựa trên các tài liệu trên, hãy trả lời câu hỏi sau của nhân viên: "${query}"
    
    Yêu cầu:
    1. Trả lời ngắn gọn, chính xác.
    2. Chỉ rõ câu trả lời nằm ở tài liệu nào (Mã tài liệu).
    3. Nếu không tìm thấy thông tin trong các tài liệu được cung cấp, hãy nói rằng bạn không tìm thấy thông tin chính xác và gợi ý nhân viên liên hệ ban ISO.
    4. Trả lời bằng tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "AI không thể đưa ra câu trả lời lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Có lỗi xảy ra khi kết nối với trí tuệ nhân tạo.";
  }
};
