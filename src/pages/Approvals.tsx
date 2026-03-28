import React from 'react';
import { Check, X, MessageSquare, FileText, History, User, Loader2 } from 'lucide-react';
import { useApp } from '@/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Approvals = () => {
  const { deptPlans, departments, users, updatePlanStatus, currentUser } = useApp();
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const pendingPlans = deptPlans.filter(p => p.status === 'pending');
  const selectedPlan = deptPlans.find(p => p.id === selectedPlanId);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedPlanId) return;
    setIsProcessing(true);
    try {
      await updatePlanStatus(selectedPlanId, status, comment);
      setSelectedPlanId(null);
      setComment('');
    } catch (error) {
      console.error('Error updating plan status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentUser.role !== 'director' && currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
          <X size={32} />
        </div>
        <h2 className="text-xl font-bold">Truy cập bị từ chối</h2>
        <p className="text-text-secondary mt-2 max-w-md">Bạn không có quyền truy cập vào khu vực phê duyệt. Chỉ Giám đốc hoặc Quản trị viên mới có thể thực hiện thao tác này.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 glass-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold flex items-center gap-2">
            Hàng chờ phê duyệt
            <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{pendingPlans.length}</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {pendingPlans.length > 0 ? (
            pendingPlans.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all",
                  selectedPlanId === plan.id ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
                )}
              >
                <p className="text-sm font-medium truncate">{plan.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-text-muted">{departments.find(d => d.id === plan.departmentId)?.name}</span>
                  <span className="text-[10px] text-text-muted">{formatDate(plan.createdAt)}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-text-muted text-sm italic">Không có yêu cầu nào đang chờ</div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 glass-card flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedPlan ? (
            <motion.div 
              key={selectedPlan.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={selectedPlan.status} />
                    <span className="text-xs text-text-muted">Gửi bởi: {users.find(u => u.id === selectedPlan.createdBy)?.name}</span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedPlan.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction('rejected')}
                    disabled={isProcessing}
                    className="btn-secondary text-error border-error/20 hover:bg-error/10 flex items-center gap-2"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />} 
                    Từ chối
                  </button>
                  <button 
                    onClick={() => handleAction('approved')}
                    disabled={isProcessing}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} 
                    Phê duyệt
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Mô tả kế hoạch</h3>
                  <p className="text-text-secondary leading-relaxed">{selectedPlan.description}</p>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Danh sách nhiệm vụ ({selectedPlan.tasks.length})</h3>
                  <div className="space-y-2">
                    {selectedPlan.tasks.map(task => (
                      <div key={task.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-text-muted mt-1">Người thực hiện: {users.find(u => u.id === task.assigneeId)?.name}</p>
                        </div>
                        <StatusBadge status={task.priority} />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Nhận xét / Phản hồi</h3>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập lý do từ chối hoặc lưu ý phê duyệt..."
                    className="w-full glass-input min-h-[100px] resize-none"
                  />
                </section>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-muted">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-medium">Chọn một yêu cầu</h3>
              <p className="text-text-secondary mt-1">Chọn một kế hoạch từ danh sách bên trái để xem chi tiết và phê duyệt.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
