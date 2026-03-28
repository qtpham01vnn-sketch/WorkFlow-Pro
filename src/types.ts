export type Role = 'director' | 'manager' | 'staff' | 'admin';

export type PlanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'overdue';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface CompanyPlan {
  id: string;
  title: string;
  description: string;
  attachments: Attachment[];
  deadline: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'archived';
}

export interface DepartmentPlan {
  id: string;
  companyPlanId: string;
  departmentId: string;
  title: string;
  description: string;
  deadline: string;
  tasks: PlanTask[];
  status: PlanStatus;
  currentVersion: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTask {
  id: string;
  planId: string;
  title: string;
  assigneeId: string;
  deadline: string;
  priority: Priority;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  note?: string;
}

export type ISODocCategory = 'quy_trinh' | 'bieu_mau' | 'ho_so' | 'hdcv' | 'quy_dinh';

export type ISODocStatus = 'draft' | 'reviewing' | 'published' | 'obsolete' | 'archived';

export interface ISODocument {
  id: string;
  code: string; // Mã tài liệu (VD: QT-KD-01)
  title: string;
  category: ISODocCategory;
  standard: string; // Hệ thống ISO (VD: ISO 9001:2015)
  departmentId: string;
  currentVersion: string;
  status: ISODocStatus;
  isDeleted: boolean; // Soft delete flag
  fileUrl: string;
  fileName: string;
  fileSize: number;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  nextReviewDate: string; // Ngày đánh giá tiếp theo
  versionHistory: Attachment[]; // Lưu trữ các bản cũ
  contentText?: string; // Nội dung văn bản trích xuất cho AI
}

export interface MonthlyReport {
  id: string;
  departmentId: string;
  month: number;
  year: number;
  summary: string;
  attachments: Attachment[];
  status: 'not_submitted' | 'submitted' | 'reviewed';
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
