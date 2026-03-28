import React from 'react';
import { Plus, FileText, Download, MoreVertical, Search, Filter } from 'lucide-react';
import { useApp } from '@/AppContext';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Plans = () => {
  const { companyPlans, users } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Kế hoạch Tổng</h1>
          <p className="text-text-secondary mt-1">Quản lý và phân bổ kế hoạch chiến lược của công ty.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Tạo kế hoạch tổng
        </button>
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kế hoạch..." 
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Filter size={16} />
            Bộ lọc
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Download size={16} />
            Tải xuống
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {companyPlans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{plan.title}</h3>
                  <p className="text-text-secondary text-sm mt-1 line-clamp-1">{plan.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      Trạng thái: <span className="text-text-secondary uppercase">{plan.status}</span>
                    </div>
                    <div>Người tạo: <span className="text-text-secondary">{users.find(u => u.id === plan.createdBy)?.name}</span></div>
                    <div>Ngày tạo: <span className="text-text-secondary">{formatDate(plan.createdAt)}</span></div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      Hạn chót: <span className="text-text-secondary">{formatDate(plan.deadline)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost">Chi tiết</button>
                <button className="btn-ghost p-2"><MoreVertical size={18} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
