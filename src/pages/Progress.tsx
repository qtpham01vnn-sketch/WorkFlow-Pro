import React from 'react';
import { BarChart3, TrendingUp, Calendar, Filter, ChevronRight } from 'lucide-react';
import { useApp } from '@/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Progress = () => {
  const { deptPlans, departments } = useApp();

  const deptStats = departments.map(dept => {
    const plans = deptPlans.filter(p => p.departmentId === dept.id);
    const totalTasks = plans.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = plans.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'completed').length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      ...dept,
      totalTasks,
      completedTasks,
      progress,
      status: progress > 80 ? 'on-track' : progress > 40 ? 'at-risk' : 'behind'
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Theo dõi Tiến độ</h1>
          <p className="text-text-secondary mt-1">Giám sát hiệu suất công việc theo thời gian thực.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Calendar size={18} /> Tháng này</button>
          <button className="btn-secondary flex items-center gap-2"><Filter size={18} /> Lọc</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deptStats.map((dept, i) => (
          <motion.div 
            key={dept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{dept.name}</h3>
                <p className="text-xs text-text-muted mt-1">{dept.completedTasks}/{dept.totalTasks} nhiệm vụ hoàn thành</p>
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                dept.status === 'on-track' ? "bg-success/10 text-success" : 
                dept.status === 'at-risk' ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
              )}>
                {dept.status === 'on-track' ? 'Đúng tiến độ' : dept.status === 'at-risk' ? 'Cần lưu ý' : 'Chậm tiến độ'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Tiến độ tổng thể</span>
                <span className="font-bold">{dept.progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={cn(
                    "h-full rounded-full",
                    dept.status === 'on-track' ? "bg-success" : 
                    dept.status === 'at-risk' ? "bg-warning" : "bg-error"
                  )}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="w-6 h-6 rounded-full border-2 border-bg-sidebar bg-white/10"></div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-bg-sidebar bg-white/5 flex items-center justify-center text-[8px]">+2</div>
              </div>
              <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                Chi tiết <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold">Phân tích hiệu suất tuần</h3>
        </div>
        <div className="p-12 text-center text-text-muted">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
          <p>Biểu đồ chi tiết đang được tải...</p>
        </div>
      </div>
    </div>
  );
};
