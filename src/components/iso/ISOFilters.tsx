import React from 'react';
import { Search, Filter, ShieldCheck } from 'lucide-react';
import { ISODocCategory } from '../../types';

interface ISOFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  categoryFilter: ISODocCategory | 'all';
  setCategoryFilter: (val: ISODocCategory | 'all') => void;
  standardFilter: string;
  setStandardFilter: (val: string) => void;
}

export const ISOFilters: React.FC<ISOFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  standardFilter,
  setStandardFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm mã hoặc tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full pl-10"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="glass-input w-full pl-10 appearance-none"
        >
          <option value="all">Tất cả loại</option>
          <option value="quy_trinh">Quy trình</option>
          <option value="bieu_mau">Biểu mẫu</option>
          <option value="ho_so">Hồ sơ</option>
          <option value="hdcv">HDCV</option>
          <option value="quy_dinh">Quy định</option>
        </select>
      </div>
      <div className="relative">
        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <select
          value={standardFilter}
          onChange={(e) => setStandardFilter(e.target.value)}
          className="glass-input w-full pl-10 appearance-none"
        >
          <option value="all">Tất cả tiêu chuẩn</option>
          <option value="ISO 9001:2015">ISO 9001:2015</option>
          <option value="ISO 14001:2015">ISO 14001:2015</option>
          <option value="ISO 13006:2018">ISO 13006:2018</option>
          <option value="BS EN 14411:2016">BS EN 14411:2016</option>
        </select>
      </div>
    </div>
  );
};
