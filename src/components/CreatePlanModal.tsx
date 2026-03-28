import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, Users, AlertCircle, Upload, File, Trash2, Loader2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { DepartmentPlan } from '../types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose }) => {
  const { departments, currentUser, addDeptPlan } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: currentUser.departmentId || '',
    startDate: '',
    endDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setAttachments(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDeptPlan({
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId,
        createdBy: currentUser.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        deadline: formData.endDate, // Using endDate as deadline
        status: 'pending',
        priority: formData.priority,
        companyPlanId: 'cp1', // Defaulting to a company plan for demo
        files: attachments
      });
      
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        departmentId: currentUser.departmentId || '',
        startDate: '',
        endDate: '',
        priority: 'medium',
      });
      setAttachments([]);
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="text-primary" size={24} />
                Tạo kế hoạch mới
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Tiêu đề kế hoạch
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề kế hoạch..."
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả mục tiêu và nội dung chính của kế hoạch..."
                    className="glass-input w-full resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Phòng ban thực hiện
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <select
                        required
                        value={formData.departmentId}
                        onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                        className="glass-input w-full pl-10 appearance-none"
                      >
                        <option value="" disabled>Chọn phòng ban</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Mức độ ưu tiên
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <select
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                        className="glass-input w-full pl-10 appearance-none"
                      >
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Ngày bắt đầu
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        required
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="glass-input w-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Ngày kết thúc
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        required
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        className="glass-input w-full pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Tài liệu đính kèm
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
                      ${isDragging ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}
                    `}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-white">Nhấn để tải lên hoặc kéo thả file</p>
                    <p className="text-xs text-text-muted mt-1">PDF, DOCX, XLSX, PNG (Tối đa 10MB)</p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <File className="text-primary" size={18} />
                            <div>
                              <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                              <p className="text-[10px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="p-1.5 hover:bg-error/10 text-text-muted hover:text-error rounded-md transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 py-2 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo kế hoạch'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
