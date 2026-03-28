import React from 'react';
import { FolderOpen, Search, Grid, List, Download, MoreVertical, File, FileText, Image as ImageIcon, FileCode } from 'lucide-react';
import { useApp } from '@/AppContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Documents = () => {
  const { departments } = useApp();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const files = [
    { id: 'f1', name: 'Ke_hoach_tong_Q1.pdf', type: 'pdf', size: '2.4 MB', date: '2026-01-05', dept: 'Ban Giám đốc' },
    { id: 'f2', name: 'Bao_cao_doanh_thu_T2.xlsx', type: 'excel', size: '1.1 MB', date: '2026-03-01', dept: 'Phòng Kinh doanh' },
    { id: 'f3', name: 'Banner_campaign_T3.png', type: 'image', size: '4.5 MB', date: '2026-03-10', dept: 'Phòng Marketing' },
    { id: 'f4', name: 'Chinh_sach_nhan_su_moi.docx', type: 'word', size: '850 KB', date: '2026-02-15', dept: 'Phòng Nhân sự' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-error" />;
      case 'excel': return <FileCode className="text-success" />;
      case 'image': return <ImageIcon className="text-info" />;
      default: return <File className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Tài liệu</h1>
          <p className="text-text-secondary mt-1">Kho lưu trữ tài liệu và hồ sơ công việc.</p>
        </div>
        <button className="btn-primary">Tải lên tài liệu</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass-card p-4 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 px-2">Thư mục</h3>
          <div className="space-y-1">
            {['Tất cả tài liệu', 'Kế hoạch tổng', 'Báo cáo tháng', 'Hợp đồng', 'Quy trình'].map((folder, i) => (
              <button 
                key={folder}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  i === 0 ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
              >
                <FolderOpen size={18} />
                {folder}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 px-2">Phòng ban</h3>
            <div className="space-y-1">
              {departments.map(dept => (
                <button key={dept.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all">
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 flex gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2 border border-white/10 rounded-md p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white/10 text-primary" : "text-text-muted hover:text-text-primary")}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white/10 text-primary" : "text-text-muted hover:text-text-primary")}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, i) => (
                <motion.div 
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 group hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                      {getFileIcon(file.type)}
                    </div>
                    <button className="btn-ghost p-1 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                  </div>
                  <h4 className="text-sm font-medium truncate mb-1">{file.name}</h4>
                  <p className="text-[10px] text-text-muted">{file.size} • {file.date}</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">{file.dept}</span>
                    <button className="p-1.5 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                      <Download size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tên file</th>
                    <th className="px-6 py-4 font-medium">Phòng ban</th>
                    <th className="px-6 py-4 font-medium">Kích thước</th>
                    <th className="px-6 py-4 font-medium">Ngày tải</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {files.map(file => (
                    <tr key={file.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{file.dept}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{file.size}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{file.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all"><Download size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
