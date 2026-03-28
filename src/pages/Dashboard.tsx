import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useApp } from '@/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { motion } from 'framer-motion';
import { formatDate, cn } from '@/lib/utils';
import { CreatePlanModal } from '@/components/CreatePlanModal';
import { Plus, ShieldCheck, FileText, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { exportISOToExcel, exportPlansToExcel } from '@/services/reportService';

export const Dashboard = () => {
  const { deptPlans, companyPlans, departments, isoDocuments, notifications } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { isoStats, stats, pieData, isoStandardData, barData, upcomingIsoDocs } = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const isoStatsObj = {
      total: isoDocuments.length,
      expiring: isoDocuments.filter(doc => {
        const reviewDate = new Date(doc.nextReviewDate);
        return reviewDate > now && reviewDate <= thirtyDaysFromNow;
      }).length,
      overdue: isoDocuments.filter(doc => new Date(doc.nextReviewDate) < now).length,
      active: isoDocuments.filter(doc => doc.status === 'published').length
    };

    const statsArr = [
      { label: 'Tổng Kế hoạch', value: deptPlans.length, icon: TrendingUp, color: 'text-primary', trend: '+12%', isUp: true },
      { label: 'Chờ phê duyệt', value: deptPlans.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-warning', trend: 'Cần duyệt', isUp: false },
      { label: 'Tài liệu ISO', value: isoStatsObj.total, icon: ShieldCheck, color: 'text-indigo-400', trend: 'Hệ thống', isUp: true },
      { label: 'ISO Sắp hết hạn', value: isoStatsObj.expiring, icon: AlertCircle, color: 'text-error', trend: '30 ngày', isUp: false },
    ];

    const pieDataArr = [
      { name: 'Đã phê duyệt', value: deptPlans.filter(p => p.status === 'approved' || p.status === 'completed' || p.status === 'in_progress').length, color: '#10b981' },
      { name: 'Chờ duyệt', value: deptPlans.filter(p => p.status === 'pending').length, color: '#f59e0b' },
      { name: 'Từ chối', value: deptPlans.filter(p => p.status === 'rejected').length, color: '#ef4444' },
    ];

    const isoStandardDataArr = [
      { name: 'ISO 9001', value: isoDocuments.filter(d => d.standard.includes('9001')).length, color: '#6366f1' },
      { name: 'ISO 14001', value: isoDocuments.filter(d => d.standard.includes('14001')).length, color: '#10b981' },
      { name: 'ISO 13006', value: isoDocuments.filter(d => d.standard.includes('13006')).length, color: '#f59e0b' },
      { name: 'BS EN 14411', value: isoDocuments.filter(d => d.standard.includes('14411')).length, color: '#ec4899' },
    ];

    const barDataArr = departments.map(d => {
      const plans = deptPlans.filter(p => p.departmentId === d.id);
      const completed = plans.filter(p => p.status === 'completed').length;
      const total = plans.length || 1;
      return {
        name: d.name.replace('Phòng ', ''),
        progress: Math.round((completed / total) * 100),
      };
    });

    const upcomingDocs = isoDocuments
      .filter(doc => {
        const reviewDate = new Date(doc.nextReviewDate);
        return reviewDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
      .slice(0, 5);

    return { 
      isoStats: isoStatsObj, 
      stats: statsArr, 
      pieData: pieDataArr, 
      isoStandardData: isoStandardDataArr, 
      barData: barDataArr,
      upcomingIsoDocs: upcomingDocs,
      thirtyDaysFromNow
    };
  }, [deptPlans, isoDocuments, departments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Trung tâm Điều hành & ISO</h1>
          <p className="text-text-secondary mt-1">Bức tranh tổng quan về vận hành và tuân thủ tiêu chuẩn của toàn công ty.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportISOToExcel(isoDocuments, departments)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Xuất báo cáo ISO
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Tạo kế hoạch mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className={cn("flex items-center text-xs font-medium", stat.isUp ? "text-success" : "text-error")}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-text-secondary text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section 1: Kế hoạch & Vận hành */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" size={24} />
          Theo dõi Kế hoạch & Mục tiêu
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Tiến độ hoàn thành theo phòng ban (%)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="progress" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Trạng thái phê duyệt</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {pieData.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Tuân thủ ISO */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" size={24} />
          Quản lý Tuân thủ ISO
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Phân bổ tài liệu theo tiêu chuẩn</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={isoStandardData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30}>
                    {isoStandardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Tình trạng đánh giá</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Bình thường', value: isoStats.total - isoStats.expiring - isoStats.overdue, color: '#10b981' },
                      { name: 'Sắp hết hạn', value: isoStats.expiring, color: '#f59e0b' },
                      { name: 'Quá hạn', value: isoStats.overdue, color: '#ef4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { color: '#10b981' },
                      { color: '#f59e0b' },
                      { color: '#ef4444' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {[
                { name: 'Bình thường', value: isoStats.total - isoStats.expiring - isoStats.overdue, color: '#10b981' },
                { name: 'Sắp hết hạn', value: isoStats.expiring, color: '#f59e0b' },
                { name: 'Quá hạn', value: isoStats.overdue, color: '#ef4444' },
              ].map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="text-warning" size={20} />
              Tài liệu ISO cần lưu ý
            </h3>
            <button className="text-primary text-sm font-medium hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Mã / Tên tài liệu</th>
                  <th className="px-6 py-3 font-medium">Hạn đánh giá</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {upcomingIsoDocs.map(doc => {
                    const isOverdue = new Date(doc.nextReviewDate) < new Date();
                    return (
                      <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{doc.code}</p>
                          <p className="text-xs text-text-muted truncate max-w-[200px]">{doc.title}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {formatDate(doc.nextReviewDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                            isOverdue ? "bg-error/10 text-error" : "bg-warning/10 text-warning"
                          )}>
                            {isOverdue ? 'Quá hạn' : 'Sắp hết hạn'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                {upcomingIsoDocs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-text-muted italic text-sm">
                      Không có tài liệu nào cần lưu ý trong 30 ngày tới.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((n, i) => (
              <div key={n.id} className="flex gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  n.type === 'success' ? 'bg-success' : n.type === 'error' ? 'bg-error' : 'bg-primary'
                )}></div>
                <div>
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{n.message}</p>
                  <p className="text-[10px] text-text-muted mt-1">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-text-secondary hover:text-primary border border-white/5 rounded-lg transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Kế hoạch sắp tới hạn</h3>
          <button className="text-primary text-sm font-medium hover:underline">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Kế hoạch</th>
                <th className="px-6 py-3 font-medium">Deadline</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deptPlans.slice(0, 5).map(plan => (
                <tr key={plan.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{plan.title}</p>
                    <p className="text-xs text-text-muted">{departments.find(d => d.id === plan.departmentId)?.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatDate(plan.deadline)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={plan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreatePlanModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};
