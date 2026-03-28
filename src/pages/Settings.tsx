import React from 'react';
import { User, Shield, Bell, Globe, Database, Save, Trash2 } from 'lucide-react';
import { useApp } from '@/AppContext';
import { cn } from '@/lib/utils';

export const Settings = () => {
  const { currentUser } = useApp();
  const [activeSection, setActiveSection] = React.useState('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
    { id: 'security', icon: Shield, label: 'Bảo mật' },
    { id: 'notifications', icon: Bell, label: 'Thông báo' },
    { id: 'system', icon: Globe, label: 'Cấu hình hệ thống' },
    { id: 'database', icon: Database, label: 'Dữ liệu' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-text-secondary mt-1">Quản lý tài khoản và cấu hình hệ thống của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeSection === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Thông tin cá nhân</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img src={currentUser.avatar} className="w-20 h-20 rounded-full border-4 border-white/5" />
                <div>
                  <button className="btn-secondary text-xs py-1.5 px-3">Thay đổi ảnh</button>
                  <p className="text-[10px] text-text-muted mt-2">Định dạng JPG, PNG. Tối đa 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">Họ và tên</label>
                  <input type="text" defaultValue={currentUser.name} className="w-full glass-input text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">Email</label>
                  <input type="email" defaultValue={currentUser.email} className="w-full glass-input text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">Chức vụ</label>
                  <input type="text" defaultValue={currentUser.role} disabled className="w-full glass-input text-sm opacity-50 cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">Phòng ban</label>
                  <input type="text" defaultValue="Ban Giám đốc" disabled className="w-full glass-input text-sm opacity-50 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn-primary flex items-center gap-2">
                  <Save size={18} /> Lưu thay đổi
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-error/20">
            <h3 className="text-lg font-semibold text-error mb-2">Vùng nguy hiểm</h3>
            <p className="text-sm text-text-secondary mb-6">Xóa tài khoản của bạn và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.</p>
            <button className="btn-secondary text-error border-error/20 hover:bg-error/10 flex items-center gap-2">
              <Trash2 size={18} /> Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
