import * as XLSX from 'xlsx';
import { ISODocument, DepartmentPlan, Department } from '../types';
import { formatDate } from '../lib/utils';

export const exportISOToExcel = (documents: ISODocument[], departments: Department[]) => {
  const data = documents.map(doc => ({
    'Mã tài liệu': doc.code,
    'Tên tài liệu': doc.title,
    'Loại': doc.category,
    'Tiêu chuẩn': doc.standard,
    'Phòng ban': departments.find(d => d.id === doc.departmentId)?.name || 'N/A',
    'Phiên bản': doc.currentVersion,
    'Trạng thái': doc.status === 'published' ? 'Đã ban hành' : 
                 doc.status === 'reviewing' ? 'Đang xem xét' :
                 doc.status === 'draft' ? 'Bản nháp' :
                 doc.status === 'obsolete' ? 'Hết hiệu lực' : 'Đã lưu trữ',
    'Ngày cập nhật': formatDate(doc.lastUpdatedAt),
    'Hạn đánh giá tiếp theo': formatDate(doc.nextReviewDate),
    'Người cập nhật': doc.lastUpdatedBy
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ISO Documents');

  // Generate buffer and download
  XLSX.writeFile(workbook, `Bao_cao_ISO_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportPlansToExcel = (plans: DepartmentPlan[], departments: Department[]) => {
  const data = plans.map(plan => ({
    'Tên kế hoạch': plan.title,
    'Phòng ban': departments.find(d => d.id === plan.departmentId)?.name || 'N/A',
    'Trạng thái': plan.status,
    'Hạn định': formatDate(plan.deadline),
    'Phiên bản': plan.currentVersion,
    'Ngày tạo': formatDate(plan.createdAt),
    'Ngày cập nhật': formatDate(plan.updatedAt)
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kế hoạch');

  XLSX.writeFile(workbook, `Bao_cao_Ke_hoach_${new Date().toISOString().split('T')[0]}.xlsx`);
};
