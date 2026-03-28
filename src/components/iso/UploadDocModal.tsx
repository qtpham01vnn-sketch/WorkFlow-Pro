import React, { useState } from 'react';
import { FileUp, Loader2, X } from 'lucide-react';
import { ISODocCategory } from '../../types';
import { extractTextFromFile } from '../../services/extractionService';

interface UploadDocModalProps {
  onClose: () => void;
  onUpload: (data: any) => Promise<void>;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    category: 'quy_trinh' as ISODocCategory,
    standard: 'ISO 9001:2015',
    departmentId: 'd1',
    currentVersion: 'v1.0',
    nextReviewDate: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file tài liệu');
      return;
    }

    setIsExtracting(true);
    try {
      const contentText = await extractTextFromFile(selectedFile);
      setIsExtracting(false);
      setIsUploading(true);
      await onUpload({
        ...formData,
        file: selectedFile,
        contentText
      });
    } catch (error) {
      console.error('Lỗi xử lý file:', error);
      alert('Có lỗi xảy ra khi xử lý file');
    } finally {
      setIsExtracting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Tải lên tài liệu ISO mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-text-secondary" disabled={isExtracting || isUploading}>
            <X size={20} />
          </button>
        </div>
        
        <p className="text-xs text-text-muted italic">Tài liệu mới sẽ được lưu ở trạng thái "Bản nháp".</p>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Mã tài liệu</label>
            <input 
              placeholder="VD: QT-ISO-01" 
              className="glass-input w-full"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              disabled={isExtracting || isUploading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Tên tài liệu</label>
            <input 
              placeholder="VD: Quy trình kiểm soát tài liệu" 
              className="glass-input w-full"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              disabled={isExtracting || isUploading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Loại</label>
              <select 
                className="glass-input w-full"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as any})}
                disabled={isExtracting || isUploading}
              >
                <option value="quy_trinh">Quy trình</option>
                <option value="bieu_mau">Biểu mẫu</option>
                <option value="ho_so">Hồ sơ</option>
                <option value="hdcv">HDCV</option>
                <option value="quy_dinh">Quy định</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Tiêu chuẩn</label>
              <select 
                className="glass-input w-full"
                value={formData.standard}
                onChange={e => setFormData({...formData, standard: e.target.value})}
                disabled={isExtracting || isUploading}
              >
                <option value="ISO 9001:2015">ISO 9001:2015</option>
                <option value="ISO 14001:2015">ISO 14001:2015</option>
                <option value="ISO 13006:2018">ISO 13006:2018</option>
                <option value="BS EN 14411:2016">BS EN 14411:2016</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Hạn đánh giá tiếp theo</label>
            <input 
              type="date" 
              className="glass-input w-full"
              value={formData.nextReviewDate}
              onChange={e => setFormData({...formData, nextReviewDate: e.target.value})}
              disabled={isExtracting || isUploading}
            />
          </div>
          <div className="relative">
            <input 
              type="file" 
              id="file-upload"
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.xls,.txt"
              disabled={isExtracting || isUploading}
            />
            <label 
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-6 transition-all bg-white/5 ${isExtracting || isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/50'}`}
            >
              <FileUp className="text-text-muted mb-2" />
              <span className="text-sm text-text-secondary text-center">
                {selectedFile ? selectedFile.name : 'Nhấn để chọn file tài liệu'}
              </span>
              <span className="text-[10px] text-text-muted mt-1">Hỗ trợ PDF, Word, Excel, Text</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-text-secondary" disabled={isExtracting || isUploading}>Hủy</button>
          <button 
            onClick={handleSubmit}
            disabled={isExtracting || isUploading || !selectedFile || !formData.code || !formData.title}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang xử lý AI...
              </>
            ) : isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Tải lên & Tạo nháp'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
