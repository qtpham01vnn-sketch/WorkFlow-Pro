import React from 'react';
import { Plus, Search, Filter, MoreVertical, ChevronRight, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '@/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CreatePlanModal } from '@/components/CreatePlanModal';

export const DeptPlans = () => {
  const { deptPlans, departments, currentUser } = useApp();
  const [activeTab, setActiveTab] = React.useState(currentUser.departmentId || 'd1');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const filteredPlans = deptPlans.filter(p => p.departmentId === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Kế hoạch Phòng ban</h1>
          <p className="text-text-secondary mt-1">Lập và quản lý kế hoạch chi tiết cho từng bộ phận.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Lập kế hoạch mới
        </button>
      </div>

      <CreatePlanModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setActiveTab(dept.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
              activeTab === dept.id 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white/5 text-text-secondary border-white/10 hover:bg-white/10"
            )}
          >
            {dept.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm kế hoạch phòng ban..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button className="btn-secondary p-2"><Filter size={18} /></button>
          </div>

          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={plan.status} />
                      <span className="text-xs text-text-muted">Phiên bản: {plan.currentVersion}</span>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{plan.title}</h3>
                    <p className="text-text-secondary text-sm line-clamp-2">{plan.description}</p>
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <FileText size={14} />
                        {plan.tasks.length} nhiệm vụ
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock size={14} />
                        Cập nhật: {formatDate(plan.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-medium">Chưa có kế hoạch</h3>
              <p className="text-text-secondary mt-1">Bắt đầu bằng cách tạo kế hoạch đầu tiên cho phòng ban này.</p>
              <button className="btn-primary mt-6">Tạo kế hoạch ngay</button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thống kê nhiệm vụ</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-success/10 text-success"><CheckCircle2 size={18} /></div>
                  <span className="text-sm">Hoàn thành</span>
                </div>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary"><Clock size={18} /></div>
                  <span className="text-sm">Đang thực hiện</span>
                </div>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-error/10 text-error"><AlertCircle size={18} /></div>
                  <span className="text-sm">Quá hạn</span>
                </div>
                <span className="font-bold">2</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-white/5 shrink-0"></div>
                  <div>
                    <p><span className="font-medium">Hùng Lê</span> đã cập nhật tiến độ nhiệm vụ <span className="text-primary">Liên hệ khách hàng</span></p>
                    <p className="text-[10px] text-text-muted mt-1">2 giờ trước</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
