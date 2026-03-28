import React from 'react';
import { cn } from '@/lib/utils';
import { PlanStatus, Priority } from '@/types';

interface StatusBadgeProps {
  status: PlanStatus | Priority | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-success/15 text-success border-success/20';
      case 'pending':
        return 'bg-warning/15 text-warning border-warning/20';
      case 'rejected':
      case 'overdue':
      case 'urgent':
        return 'bg-error/15 text-error border-error/20';
      case 'in_progress':
        return 'bg-primary/15 text-primary border-primary/20';
      case 'draft':
        return 'bg-text-secondary/15 text-text-secondary border-text-secondary/20';
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-white/5 text-text-secondary border-white/10';
    }
  };

  const getLabel = (s: string) => {
    switch (s.toLowerCase()) {
      case 'approved': return 'Đã phê duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'overdue': return 'Quá hạn';
      case 'draft': return 'Bản nháp';
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return s;
    }
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
      getStatusStyles(status),
      className
    )}>
      {getLabel(status)}
    </span>
  );
};
