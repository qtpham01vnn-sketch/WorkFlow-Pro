import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Download, 
  History, 
  X,
  Loader2,
  ShieldCheck,
  Mail,
  Archive,
  Eye,
  FileCheck,
  FileUp
} from 'lucide-react';
import { useApp } from '../AppContext';
import { ISODocument, ISODocCategory, ISODocStatus } from '../types';
import { formatDate } from '../lib/utils';
import { sendISOReminderEmails } from '../services/emailService';
import { UploadDocModal } from '../components/iso/UploadDocModal';
import { UpdateVersionModal } from '../components/iso/UpdateVersionModal';
import { ISODocCard } from '../components/iso/ISODocCard';
import { AIAssistant } from '../components/iso/AIAssistant';
import { ISOFilters } from '../components/iso/ISOFilters';

export const ISODocuments: React.FC = () => {
  const { isoDocuments, currentUser, addISODocument, updateISODocumentVersion, updateISODocumentStatus, deleteISODocument, departments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ISODocCategory | 'all'>('all');
  const [standardFilter, setStandardFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<ISODocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isISOAdmin = currentUser.role === 'admin' || currentUser.role === 'director';

  const handleSendEmailReminders = async () => {
    setIsSendingEmail(true);
    try {
      const sent = await sendISOReminderEmails(isoDocuments);
      if (sent) {
        alert('Đã gửi email nhắc nhở đến các bộ phận liên quan thành công!');
      } else {
        alert('Không có tài liệu nào sắp hết hạn để gửi nhắc nhở.');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUpdateStatus = async (docId: string, status: ISODocStatus) => {
    setIsProcessing(true);
    try {
      await updateISODocumentStatus(docId, status);
      setSelectedDoc(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái tài liệu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm('Bạn có chắc chắn muốn lưu trữ tài liệu này? Tài liệu sẽ không còn xuất hiện trong danh sách chính.')) return;
    
    setIsProcessing(true);
    try {
      await deleteISODocument(docId);
      setSelectedDoc(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu trữ tài liệu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async (data: any) => {
    setIsProcessing(true);
    try {
      await addISODocument(data);
      setShowUploadModal(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi tải lên tài liệu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateVersion = async (file: File, version: string, note?: string, contentText?: string) => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
      await updateISODocumentVersion(selectedDoc.id, file, version, note, contentText);
      setShowVersionModal(false);
      setSelectedDoc(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật phiên bản tài liệu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return isoDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doc.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      const matchesStandard = standardFilter === 'all' || doc.standard === standardFilter;
      return matchesSearch && matchesCategory && matchesStandard;
    });
  }, [isoDocuments, searchTerm, categoryFilter, standardFilter]);

  const getCategoryLabel = (cat: ISODocCategory) => {
    switch (cat) {
      case 'quy_trinh': return 'Quy trình';
      case 'bieu_mau': return 'Biểu mẫu';
      case 'ho_so': return 'Hồ sơ';
      case 'hdcv': return 'HDCV';
      case 'quy_dinh': return 'Quy định';
      default: return cat;
    }
  };

  const getStatusLabel = (status: ISODocStatus) => {
    switch (status) {
      case 'draft': return { label: 'Bản nháp', color: 'text-text-muted', bg: 'bg-white/5', icon: FileText };
      case 'reviewing': return { label: 'Đang xem xét', color: 'text-warning', bg: 'bg-warning/10', icon: Eye };
      case 'published': return { label: 'Đã ban hành', color: 'text-success', bg: 'bg-success/10', icon: FileCheck };
      case 'obsolete': return { label: 'Hết hiệu lực', color: 'text-error', bg: 'bg-error/10', icon: FileUp };
      case 'archived': return { label: 'Đã lưu trữ', color: 'text-text-muted', bg: 'bg-white/10', icon: Archive };
      default: return { label: status, color: 'text-text-muted', bg: 'bg-white/5', icon: FileText };
    }
  };

  const getReviewStatus = (reviewDate: string) => {
    const now = new Date();
    const review = new Date(reviewDate);
    const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Quá hạn đánh giá', color: 'text-error' };
    if (diffDays <= 30) return { label: `Sắp đến hạn (${diffDays} ngày)`, color: 'text-warning' };
    return { label: 'Bình thường', color: 'text-success' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Quản lý Hệ thống ISO
          </h1>
          <p className="text-text-secondary text-sm">Số hóa quy trình, hồ sơ và kiểm soát phiên bản tài liệu.</p>
        </div>
        {isISOAdmin && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSendEmailReminders}
              disabled={isSendingEmail}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
              title="Gửi email nhắc nhở cho các bộ phận có tài liệu sắp hết hạn"
            >
              {isSendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              Gửi nhắc nhở
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Tải lên tài liệu mới
            </button>
          </div>
        )}
      </div>

      <div className="glass-card p-4 border-primary/20 bg-primary/5 flex items-start gap-3">
        <ShieldCheck className="text-primary shrink-0" size={20} />
        <div className="text-xs text-text-secondary leading-relaxed">
          <p className="text-white font-medium mb-1">Kết nối Supabase & AI:</p>
          Hệ thống đã sẵn sàng kết nối với Supabase. Tài liệu (PDF/Word/Excel) sẽ được lưu tại <strong>Supabase Storage</strong>, 
          thông tin phiên bản lưu tại <strong>Supabase Database</strong>. Để AI có thể truy xuất nội dung, chúng tôi đã tích hợp 
          tự động trích xuất văn bản vào cột <code>contentText</code> để hỗ trợ tìm kiếm thông minh.
        </div>
      </div>

      {/* AI Assistant Section */}
      <AIAssistant isoDocuments={isoDocuments} />

      {/* Filters & Search */}
      <ISOFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        standardFilter={standardFilter}
        setStandardFilter={setStandardFilter}
      />

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <ISODocCard 
            key={doc.id} 
            doc={doc} 
            onClick={setSelectedDoc} 
          />
        ))}
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedDoc.title}</h2>
                    <p className="text-xs text-text-muted">{selectedDoc.code} • Phiên bản hiện tại: {selectedDoc.currentVersion}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase mb-1">Loại</p>
                    <p className="text-sm text-white">{getCategoryLabel(selectedDoc.category)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase mb-1">Tiêu chuẩn</p>
                    <p className="text-sm text-primary font-medium">{selectedDoc.standard}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase mb-1">Phòng ban</p>
                    <p className="text-sm text-white">{departments.find(d => d.id === selectedDoc.departmentId)?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase mb-1">Người cập nhật</p>
                    <p className="text-sm text-white">Admin ISO</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase mb-1">Hạn đánh giá tiếp</p>
                    <p className={`text-sm font-medium ${getReviewStatus(selectedDoc.nextReviewDate).color}`}>
                      {formatDate(selectedDoc.nextReviewDate)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    Tải phiên bản hiện tại
                  </button>
                  
                  {isISOAdmin && (
                    <>
                      {selectedDoc.status === 'draft' && (
                        <button 
                          onClick={() => handleUpdateStatus(selectedDoc.id, 'reviewing')}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg bg-warning/20 border border-warning/30 text-warning hover:bg-warning/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                          Gửi xem xét
                        </button>
                      )}
                      
                      {selectedDoc.status === 'reviewing' && (
                        <button 
                          onClick={() => handleUpdateStatus(selectedDoc.id, 'published')}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg bg-success/20 border border-success/30 text-success hover:bg-success/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <FileCheck size={18} />}
                          Phê duyệt & Ban hành
                        </button>
                      )}
                      
                      {selectedDoc.status === 'published' && (
                        <button 
                          onClick={() => setShowVersionModal(true)}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <FileUp size={18} />
                          Cập nhật phiên bản mới
                        </button>
                      )}

                      <button 
                        onClick={() => handleDeleteDoc(selectedDoc.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-lg bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />}
                        Lưu trữ (Soft Delete)
                      </button>
                    </>
                  )}
                </div>

                {/* Version History */}
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <History size={18} className="text-primary" />
                    Lịch sử phiên bản
                  </h3>
                  <div className="space-y-3">
                    {/* Current one */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                        HIỆN TẠI
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{selectedDoc.fileName}</p>
                            <p className="text-[10px] text-text-muted">
                              Phiên bản {selectedDoc.currentVersion} • {formatDate(selectedDoc.lastUpdatedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-text-muted hover:text-primary">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Old versions */}
                    {selectedDoc.versionHistory.map((v) => (
                      <div key={v.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-text-secondary">
                              <FileText size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{v.name}</p>
                              <p className="text-[10px] text-text-muted">
                                Phiên bản {v.version} • {formatDate(v.uploadedAt)}
                              </p>
                              {v.note && <p className="text-[10px] text-primary/70 mt-1 italic">"{v.note}"</p>}
                            </div>
                          </div>
                          <button className="p-2 text-text-muted hover:text-primary">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedDoc.versionHistory.length === 0 && (
                      <p className="text-center py-4 text-text-muted text-sm italic">Chưa có lịch sử phiên bản cũ.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload New Doc Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadDocModal 
            onClose={() => setShowUploadModal(false)} 
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>

      {/* Update Version Modal */}
      <AnimatePresence>
        {showVersionModal && selectedDoc && (
          <UpdateVersionModal 
            doc={selectedDoc}
            onClose={() => setShowVersionModal(false)}
            onUpdate={handleUpdateVersion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
