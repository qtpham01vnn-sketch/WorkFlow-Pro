import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '@/AppContext';
import { MOCK_USERS } from '@/mockData';
import { cn } from '@/lib/utils';

export const TopBar = () => {
  const { currentUser, setCurrentUser, notifications } = useApp();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-main/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kế hoạch, nhiệm vụ..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-main">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-card p-2 z-50">
              <div className="p-2 border-b border-white/5 flex justify-between items-center">
                <span className="font-semibold">Thông báo</span>
                <button className="text-xs text-primary hover:underline">Đánh dấu đã đọc</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-text-secondary mt-1">{n.message}</p>
                      <p className="text-[10px] text-text-muted mt-2">10 phút trước</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted text-sm">Không có thông báo mới</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-white/10" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-text-secondary mt-1 capitalize">{currentUser.role}</p>
            </div>
            <ChevronDown size={14} className="text-text-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-50">
              <div className="p-2 border-b border-white/5 mb-1">
                <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Chuyển vai trò (Demo)</p>
              </div>
              {MOCK_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserMenu(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md transition-all text-left",
                    currentUser.id === user.id ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-text-secondary hover:text-text-primary"
                  )}
                >
                  <img src={user.avatar} className="w-6 h-6 rounded-full" />
                  <div>
                    <p className="text-xs font-medium">{user.name}</p>
                    <p className="text-[10px] opacity-70 capitalize">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
