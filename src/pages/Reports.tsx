import React from 'react';
import { FilePieChart, Plus, Download, Search, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/AppContext';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Reports = () => {
  const { departments } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo</h1>
          <p className="text-text-secondary mt-1">Tổng hợp và lưu trữ báo cáo công việc hàng tháng.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Tạo báo cáo tháng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Trạng thái nộp báo cáo</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Đã nộp</span>
                <span className="text-sm font-bold text-success">4/5</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[80%]"></div>
              </div>
              <p className="text-[10px] text-text-muted">Phòng Kỹ thuật chưa nộp báo cáo tháng 3.</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Bộ lọc</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1.5">Năm</label>
                <select className="w-full glass-input text-sm">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1.5">Phòng ban</label>
                <select className="w-full glass-input text-sm">
                  <option>Tất cả</option>
                  {departments.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm báo cáo..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2 text-sm"><Download size={16} /> Tải tất cả</button>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Báo cáo tháng</th>
                  <th className="px-6 py-4 font-medium">Phòng ban</th>
                  <th className="px-6 py-4 font-medium">Ngày nộp</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4].map(i => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-primary/10 text-primary"><FileText size={16} /></div>
                        <span className="text-sm font-medium">Báo cáo Tháng 0{i}/2026</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">Phòng Kinh doanh</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(new Date())}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-success text-xs font-medium">
                        <CheckCircle2 size={14} /> Đã duyệt
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary text-xs font-medium hover:underline">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
