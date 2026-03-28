import { User, Department, CompanyPlan, DepartmentPlan, MonthlyReport, Notification, ISODocument } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn Minh', email: 'minh.ceo@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u1', role: 'director', departmentId: 'd0' },
  { id: 'u2', name: 'Trần Thị Lan', email: 'lan.manager@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'manager', departmentId: 'd1' },
  { id: 'u3', name: 'Nguyễn Hoàng Nam', email: 'nam.manager@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u3', role: 'manager', departmentId: 'd2' },
  { id: 'u4', name: 'Lê Hoàng Hùng', email: 'hung.staff@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u4', role: 'staff', departmentId: 'd1' },
  { id: 'u5', name: 'HR Thanh', email: 'thanh.admin@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u5', role: 'admin', departmentId: 'd3' },
  { id: 'u6', name: 'Ban ISO', email: 'iso.admin@workflow.pro', avatar: 'https://i.pravatar.cc/150?u=u6', role: 'admin', departmentId: 'd0' },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Phòng Kinh doanh', managerId: 'u2', memberIds: ['u4'], createdAt: '2025-01-01T00:00:00Z' },
  { id: 'd2', name: 'Phòng Marketing', managerId: 'u3', memberIds: [], createdAt: '2025-01-01T00:00:00Z' },
  { id: 'd3', name: 'Phòng Nhân sự', managerId: 'u5', memberIds: [], createdAt: '2025-01-01T00:00:00Z' },
  { id: 'd4', name: 'Phòng Kỹ thuật', managerId: '', memberIds: [], createdAt: '2025-01-01T00:00:00Z' },
];

export const MOCK_COMPANY_PLANS: CompanyPlan[] = [
  {
    id: 'cp1',
    title: 'Kế hoạch Kinh doanh Q1/2026',
    description: 'Mục tiêu tăng trưởng doanh thu 20% so với cùng kỳ năm ngoái.',
    attachments: [],
    deadline: '2026-03-31T23:59:59Z',
    createdBy: 'u1',
    createdAt: '2026-01-05T09:00:00Z',
    status: 'active'
  },
  {
    id: 'cp2',
    title: 'Chiến lược Phát triển Sản phẩm 2026',
    description: 'Tập trung vào các tính năng AI và trải nghiệm người dùng.',
    attachments: [],
    deadline: '2026-06-30T23:59:59Z',
    createdBy: 'u1',
    createdAt: '2026-01-10T10:00:00Z',
    status: 'active'
  }
];

export const MOCK_DEPT_PLANS: DepartmentPlan[] = [
  {
    id: 'dp1',
    companyPlanId: 'cp1',
    departmentId: 'd1',
    title: 'KH Kinh doanh T3/2026 - Phòng Kinh doanh',
    description: 'Chi tiết các hoạt động bán hàng và chăm sóc khách hàng tháng 3.',
    deadline: '2026-03-31T23:59:59Z',
    status: 'approved',
    currentVersion: 'v1.0',
    attachments: [],
    tasks: [
      {
        id: 't1',
        planId: 'dp1',
        title: 'Liên hệ 50 khách hàng tiềm năng',
        assigneeId: 'u4',
        deadline: '2026-03-15T17:00:00Z',
        priority: 'high',
        status: 'in_progress',
        progress: 65,
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-10T14:30:00Z'
      },
      {
        id: 't2',
        planId: 'dp1',
        title: 'Hoàn thành báo cáo doanh thu tuần 1',
        assigneeId: 'u2',
        deadline: '2026-03-07T17:00:00Z',
        priority: 'medium',
        status: 'completed',
        progress: 100,
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-07T16:00:00Z'
      }
    ],
    createdBy: 'u2',
    createdAt: '2026-02-25T08:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
    submittedAt: '2026-02-26T10:00:00Z',
    approvedAt: '2026-02-27T15:00:00Z',
    approvedBy: 'u1'
  },
  {
    id: 'dp2',
    companyPlanId: 'cp1',
    departmentId: 'd2',
    title: 'KH Marketing T3/2026 - Phòng Marketing',
    description: 'Chiến dịch truyền thông cho sản phẩm mới.',
    deadline: '2026-03-31T23:59:59Z',
    status: 'pending',
    currentVersion: 'v1.1',
    attachments: [],
    tasks: [
      {
        id: 't3',
        planId: 'dp2',
        title: 'Thiết kế campaign Facebook Q1',
        assigneeId: 'u3',
        deadline: '2026-03-20T17:00:00Z',
        priority: 'medium',
        status: 'in_progress',
        progress: 40,
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-05T09:00:00Z'
      }
    ],
    createdBy: 'u3',
    createdAt: '2026-02-28T09:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    submittedAt: '2026-03-01T10:00:00Z'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'info',
    title: 'Kế hoạch mới cần phê duyệt',
    message: 'Phòng Marketing vừa gửi kế hoạch tháng 3.',
    link: '/approvals',
    isRead: false,
    createdAt: '2026-03-25T10:00:00Z'
  },
  {
    id: 'n2',
    userId: 'u2',
    type: 'success',
    title: 'Kế hoạch đã được phê duyệt',
    message: 'Kế hoạch tháng 3 của bạn đã được Giám đốc phê duyệt.',
    link: '/department-plans',
    isRead: true,
    createdAt: '2026-02-27T15:00:00Z'
  }
];

export const MOCK_ISO_DOCUMENTS: ISODocument[] = [
  {
    id: 'iso1',
    code: 'QT-ISO-01',
    title: 'Quy trình Kiểm soát Tài liệu',
    category: 'quy_trinh',
    standard: 'ISO 9001:2015',
    departmentId: 'd0',
    currentVersion: 'v2.0',
    status: 'published',
    isDeleted: false,
    fileUrl: '#',
    fileName: 'QT-ISO-01_Kiem_soat_tai_lieu_v2.0.pdf',
    fileSize: 1250000,
    lastUpdatedAt: '2026-01-15T08:00:00Z',
    lastUpdatedBy: 'u1',
    nextReviewDate: '2026-04-15T00:00:00Z',
    versionHistory: [
      {
        id: 'v1',
        name: 'QT-ISO-01_Kiem_soat_tai_lieu_v1.0.pdf',
        type: 'application/pdf',
        size: 1100000,
        url: '#',
        version: 'v1.0',
        uploadedBy: 'u1',
        uploadedAt: '2025-01-15T08:00:00Z',
        note: 'Phiên bản ban đầu'
      }
    ],
    contentText: 'Quy trình kiểm soát tài liệu quy định cách thức soạn thảo, phê duyệt, ban hành và cập nhật các tài liệu trong hệ thống ISO. Mọi tài liệu phải có mã số, tên và số phiên bản. Việc thay đổi tài liệu phải được phê duyệt bởi cấp có thẩm quyền trước khi ban hành.'
  },
  {
    id: 'iso2',
    code: 'BM-NS-05',
    title: 'Biểu mẫu Đánh giá Nhân sự',
    category: 'bieu_mau',
    standard: 'ISO 14001:2015',
    departmentId: 'd3',
    currentVersion: 'v1.2',
    status: 'published',
    isDeleted: false,
    fileUrl: '#',
    fileName: 'BM-NS-05_Danh_gia_nhan_su_v1.2.xlsx',
    fileSize: 450000,
    lastUpdatedAt: '2026-02-20T10:00:00Z',
    lastUpdatedBy: 'u5',
    nextReviewDate: '2026-08-20T00:00:00Z',
    versionHistory: [],
    contentText: 'Biểu mẫu đánh giá nhân sự định kỳ hàng năm. Các tiêu chí đánh giá bao gồm: KPI công việc, Kỹ năng chuyên môn, Thái độ làm việc và Sự tuân thủ nội quy công ty. Kết quả đánh giá là căn cứ để xét thưởng và tăng lương.'
  },
  {
    id: 'iso3',
    code: 'QD-ISO-01',
    title: 'Quy định quản lý rác thải nguy hại',
    category: 'quy_dinh',
    standard: 'ISO 14001:2015',
    departmentId: 'd4',
    currentVersion: 'v1.0',
    status: 'published',
    isDeleted: false,
    fileUrl: '#',
    fileName: 'QD-ISO-01_v1.0.pdf',
    fileSize: 850000,
    lastUpdatedAt: '2026-03-01T09:00:00Z',
    lastUpdatedBy: 'u6',
    nextReviewDate: '2026-09-01T00:00:00Z',
    versionHistory: [],
    contentText: 'Quy định này áp dụng cho việc phân loại, thu gom và xử lý các loại rác thải nguy hại phát sinh trong quá trình sản xuất gạch men. Đảm bảo tuân thủ các tiêu chuẩn về môi trường.'
  },
  {
    id: 'iso4',
    code: 'QT-KT-02',
    title: 'Quy trình kiểm tra chất lượng gạch ốp lát',
    category: 'quy_trinh',
    standard: 'BS EN 14411:2016',
    departmentId: 'd4',
    currentVersion: 'v3.1',
    status: 'published',
    isDeleted: false,
    fileUrl: '#',
    fileName: 'QT-KT-02_v3.1.pdf',
    fileSize: 2100000,
    lastUpdatedAt: '2026-03-10T14:00:00Z',
    lastUpdatedBy: 'u6',
    nextReviewDate: '2026-06-10T00:00:00Z',
    versionHistory: [],
    contentText: 'Quy trình chi tiết các bước kiểm tra kích thước, độ phẳng, độ hút nước và độ bền uốn của gạch theo tiêu chuẩn BS EN 14411:2016.'
  },
  {
    id: 'iso5',
    code: 'QT-KT-03',
    title: 'Quy trình kiểm tra độ bền hóa học gạch gốm',
    category: 'quy_trinh',
    standard: 'ISO 13006:2018',
    departmentId: 'd4',
    currentVersion: 'v1.0',
    status: 'published',
    isDeleted: false,
    fileUrl: '#',
    fileName: 'QT-KT-03_v1.0.pdf',
    fileSize: 1500000,
    lastUpdatedAt: '2026-03-15T11:00:00Z',
    lastUpdatedBy: 'u6',
    nextReviewDate: '2026-09-15T00:00:00Z',
    versionHistory: [],
    contentText: 'Quy trình kiểm tra khả năng kháng hóa chất của gạch gốm theo tiêu chuẩn ISO 13006:2018. Bao gồm các phép thử với axit, kiềm và các chất tẩy rửa gia dụng.'
  }
];
