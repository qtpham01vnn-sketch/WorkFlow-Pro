import { ISODocument } from "../types";

export interface EmailReminder {
  to: string;
  subject: string;
  body: string;
  documents: ISODocument[];
}

export const sendISOReminderEmails = async (documents: ISODocument[]): Promise<boolean> => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const expiringDocs = documents.filter(doc => {
    const reviewDate = new Date(doc.nextReviewDate);
    return reviewDate <= thirtyDaysFromNow && doc.status === 'published';
  });

  if (expiringDocs.length === 0) {
    console.log("Không có tài liệu nào sắp hết hạn để gửi email.");
    return false;
  }

  // In a real application, you would group these by department manager's email
  // For this demo, we'll simulate sending one summary email to the ISO Admin
  const emailContent: EmailReminder = {
    to: "iso.admin@workflow.pro",
    subject: `[ISO REMINDER] Danh sách tài liệu cần đánh giá định kỳ - ${now.toLocaleDateString('vi-VN')}`,
    body: `
      Kính gửi Ban ISO,
      
      Hệ thống WorkFlow Pro xin thông báo danh sách các tài liệu ISO sắp đến hạn hoặc đã quá hạn đánh giá định kỳ:
      
      ${expiringDocs.map(doc => {
        const reviewDate = new Date(doc.nextReviewDate);
        const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const status = diffDays < 0 ? 'QUÁ HẠN' : `Còn ${diffDays} ngày`;
        return `- [${doc.code}] ${doc.title} (${status}) - Hạn: ${reviewDate.toLocaleDateString('vi-VN')}`;
      }).join('\n')}
      
      Vui lòng kiểm tra và cập nhật phiên bản mới trên hệ thống.
      
      Trân trọng,
      Hệ thống WorkFlow Pro
    `,
    documents: expiringDocs
  };

  console.log("--- SIMULATING EMAIL SEND ---");
  console.log(`To: ${emailContent.to}`);
  console.log(`Subject: ${emailContent.subject}`);
  console.log(`Body: ${emailContent.body}`);
  console.log("------------------------------");

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return true;
};
