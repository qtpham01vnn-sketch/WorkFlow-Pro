import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  BarChart3, 
  FilePieChart, 
  FolderOpen, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/AppContext';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { currentUser, deptPlans } = useApp();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const pendingCount = deptPlans.filter(p => p.status === 'pending').length;

  const navItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/' },
    { icon: FileText, label: 'KH Tổng', path: '/plans' },
    { icon: Users, label: 'Phòng ban', path: '/department-plans' },
    { icon: CheckSquare, label: 'Phê duyệt', path: '/approvals', badge: currentUser.role === 'director' ? pendingCount : 0 },
    { icon: ShieldCheck, label: 'Quản lý ISO', path: '/iso-management' },
    { icon: BarChart3, label: 'Tiến độ', path: '/progress' },
    { icon: FilePieChart, label: 'Báo cáo', path: '/reports' },
    { icon: FolderOpen, label: 'Tài liệu', path: '/documents' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <aside className={cn(
      'bg-bg-sidebar border-r border-border-subtle transition-all duration-300 flex flex-col h-screen sticky top-0',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">W</div>
            <span className="text-xl font-display font-bold tracking-tight">WorkFlow<span className="text-primary">Pro</span></span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
              isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            )}
          >
            <item.icon size={22} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
            {item.badge > 0 && !isCollapsed && (
              <span className="ml-auto bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {isCollapsed && item.badge > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-bg-sidebar"></span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle">
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-lg bg-white/5',
          isCollapsed ? 'justify-center' : ''
        )}>
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-white/10" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-text-secondary truncate capitalize">{currentUser.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
