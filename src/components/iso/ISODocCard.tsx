import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, History, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { ISODocument, ISODocCategory, ISODocStatus } from '../../types';
import { formatDate } from '../../lib/utils';

interface ISODocCardProps {
  doc: ISODocument;
  onClick: (doc: ISODocument) => void;
}

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
    case 'obsolete': return { label: 'Hết hiệu lực', color: 'text-error', bg: 'bg-error/10', icon: FileX };
    case 'archived': return { label: 'Đã lưu trữ', color: 'text-text-muted', bg: 'bg-white/10', icon: Archive };
    default: return { label: status, color: 'text-text-muted', bg: 'bg-white/5', icon: FileText };
  }
};

// Helper components for status icons that aren't imported in the switch
import { Eye, FileCheck, FileX, Archive } from 'lucide-react';

const getReviewStatus = (reviewDate: string) => {
  const now = new Date();
  const review = new Date(reviewDate);
  const diffDays = Math.ceil((review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Quá hạn đánh giá', color: 'text-error', icon: AlertTriangle, bg: 'bg-error/10' };
  if (diffDays <= 30) return { label: `Sắp đến hạn (${diffDays} ngày)`, color: 'text-warning', icon: Clock, bg: 'bg-warning/10' };
  return { label: 'Bình thường', color: 'text-success', icon: CheckCircle, bg: 'bg-success/10' };
};

export const ISODocCard: React.FC<ISODocCardProps> = React.memo(({ doc, onClick }) => {
  const status = getReviewStatus(doc.nextReviewDate);
  const statusInfo = getStatusLabel(doc.status);

  return (
    <motion.div
      layoutId={doc.id}
      className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={() => onClick(doc)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold bg-white/10 text-text-secondary px-1.5 py-0.5 rounded uppercase">
                {doc.code}
              </span>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                {doc.standard}
              </span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${statusInfo.bg} ${statusInfo.color}`}>
                <statusInfo.icon size={10} />
                <span className="text-[10px] font-bold uppercase">
                  {statusInfo.label}
                </span>
              </div>
            </div>
            <h3 className="text-white font-medium mt-1 group-hover:text-primary transition-colors">
              {doc.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold bg-white/5 text-text-muted px-1.5 py-0.5 rounded uppercase">
            {doc.currentVersion}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Loại tài liệu</p>
          <p className="text-sm text-text-secondary">{getCategoryLabel(doc.category)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Cập nhật lần cuối</p>
          <p className="text-sm text-text-secondary">{formatDate(doc.lastUpdatedAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
          <status.icon size={14} />
          <span className="text-[11px] font-medium">{status.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all" title="Tải về">
            <Download size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all" title="Lịch sử phiên bản">
            <History size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ISODocCard.displayName = 'ISODocCard';
