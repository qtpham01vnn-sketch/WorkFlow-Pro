import React, { useState } from 'react';
import { FileUp, Loader2, X } from 'lucide-react';
import { ISODocument } from '../../types';
import { extractTextFromFile } from '../../services/extractionService';

interface UpdateVersionModalProps {
  doc: ISODocument;
  onClose: () => void;
  onUpdate: (file: File, version: string, note: string, contentText?: string) => Promise<void>;
}

export const UpdateVersionModal: React.FC<UpdateVersionModalProps> = ({ doc, onClose, onUpdate }) => {
  const [version, setVersion] = useState('');
  const [note, setNote] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !version) {
      alert('Vui lòng nhập phiên bản và chọn file');
      return;
    }

    setIsExtracting(true);
    try {
      const contentText = await extractTextFromFile(selectedFile);
      setIsExtracting(false);
      setIsUpdating(true);
      await onUpdate(selectedFile, version, note, contentText);
    } catch (error) {
      console.error('Lỗi xử lý file:', error);
      alert('Có lỗi xảy ra khi xử lý file');
    } finally {
      setIsExtracting(false);
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Cập nhật phiên bản mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-text-secondary" disabled={isExtracting || isUpdating}>
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-text-secondary">Đang cập nhật cho: <span className="text-primary">{doc.code}</span></p>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Phiên bản mới</label>
            <input 
              placeholder="VD: v2.1" 
              className="glass-input w-full"
              value={version}
              onChange={e => setVersion(e.target.value)}
              disabled={isExtracting || isUpdating}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-text-muted uppercase font-bold ml-1">Ghi chú thay đổi</label>
            <textarea 
              placeholder="VD: Cập nhật quy trình phê duyệt bước 2..." 
              className="glass-input w-full h-24"
              value={note}
              onChange={e => setNote(e.target.value)}
              disabled={isExtracting || isUpdating}
            />
          </div>
          <div className="relative">
            <input 
              type="file" 
              id="version-file-upload"
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.xls,.txt"
              disabled={isExtracting || isUpdating}
            />
            <label 
              htmlFor="version-file-upload"
              className={`flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-6 transition-all bg-white/5 ${isExtracting || isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/50'}`}
            >
              <FileUp className="text-text-muted mb-2" />
              <span className="text-sm text-text-secondary text-center">
                {selectedFile ? selectedFile.name : 'Chọn file phiên bản mới'}
              </span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-text-secondary" disabled={isExtracting || isUpdating}>Hủy</button>
          <button 
            onClick={handleSubmit}
            disabled={isExtracting || isUpdating || !selectedFile || !version}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang xử lý AI...
              </>
            ) : isUpdating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật & Lưu trữ bản cũ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
