import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, Department, CompanyPlan, DepartmentPlan, Notification, Role, ISODocument } from './types';
import { MOCK_USERS, MOCK_DEPARTMENTS, MOCK_COMPANY_PLANS, MOCK_DEPT_PLANS, MOCK_NOTIFICATIONS, MOCK_ISO_DOCUMENTS } from './mockData';
import { supabase } from './lib/supabase';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  departments: Department[];
  companyPlans: CompanyPlan[];
  deptPlans: DepartmentPlan[];
  notifications: Notification[];
  isoDocuments: ISODocument[];
  setDeptPlans: React.Dispatch<React.SetStateAction<DepartmentPlan[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  addDeptPlan: (plan: Omit<DepartmentPlan, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'tasks'>) => void;
  updatePlanStatus: (planId: string, status: DepartmentPlan['status'], reason?: string) => void;
  addISODocument: (doc: Omit<ISODocument, 'id' | 'lastUpdatedAt' | 'lastUpdatedBy' | 'versionHistory' | 'status' | 'isDeleted'>) => void;
  updateISODocumentVersion: (docId: string, file: File, version: string, note?: string, contentText?: string) => void;
  updateISODocumentStatus: (docId: string, status: ISODocument['status']) => void;
  deleteISODocument: (docId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Director
  const [users] = useState<User[]>(MOCK_USERS);
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [companyPlans] = useState<CompanyPlan[]>(MOCK_COMPANY_PLANS);
  const [deptPlans, setDeptPlans] = useState<DepartmentPlan[]>(MOCK_DEPT_PLANS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isoDocuments, setIsoDocuments] = useState<ISODocument[]>(MOCK_ISO_DOCUMENTS);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const checkISODeadlines = useCallback(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    isoDocuments.forEach(doc => {
      const reviewDate = new Date(doc.nextReviewDate);
      if (reviewDate <= thirtyDaysFromNow && doc.status === 'published') {
        const diffDays = Math.ceil((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Check if notification already exists to avoid duplicates
        const exists = notifications.some(n => n.link === '/iso-management' && n.message.includes(doc.code));
        
        if (!exists) {
          addNotification({
            userId: 'u6', // Notify ISO Admin
            type: diffDays < 0 ? 'error' : 'warning',
            title: diffDays < 0 ? 'Tài liệu QUÁ HẠN đánh giá' : 'Tài liệu SẮP ĐẾN HẠN đánh giá',
            message: `Tài liệu ${doc.code} - ${doc.title} ${diffDays < 0 ? 'đã quá hạn' : `còn ${diffDays} ngày`} đến hạn đánh giá tiếp theo.`,
            link: '/iso-management'
          });
        }
      }
    });
  }, [isoDocuments, notifications, addNotification]);

  // Supabase Integration
  useEffect(() => {
    const fetchFromSupabase = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }
      
      try {
        const { data: docs, error: docsError } = await supabase
          .from('iso_documents')
          .select('*')
          .order('last_updated_at', { ascending: false });

        if (docsError) throw docsError;

        if (docs) {
          const mappedDocs: ISODocument[] = docs.map((d: any) => ({
            id: d.id,
            code: d.code,
            title: d.title,
            category: d.category,
            standard: d.standard,
            departmentId: d.department_id,
            currentVersion: d.current_version,
            status: d.status,
            isDeleted: d.is_deleted || false,
            fileUrl: d.file_url,
            fileName: d.file_name,
            fileSize: d.file_size,
            lastUpdatedAt: d.last_updated_at,
            lastUpdatedBy: d.last_updated_by,
            nextReviewDate: d.next_review_date,
            versionHistory: d.version_history || [],
            contentText: d.content_text
          }));
          setIsoDocuments(mappedDocs.filter(doc => !doc.isDeleted));
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
      }
    };
    fetchFromSupabase();
  }, []);

  // Check deadlines whenever isoDocuments change
  useEffect(() => {
    checkISODeadlines();
  }, [isoDocuments, checkISODeadlines]);

  const addDeptPlan = useCallback((planData: Omit<DepartmentPlan, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'tasks'>) => {
    const newPlan: DepartmentPlan = {
      ...planData,
      id: `dp-${Math.random().toString(36).substr(2, 9)}`,
      currentVersion: 'v1.0',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeptPlans(prev => [newPlan, ...prev]);
    
    addNotification({
      userId: 'u1', // Notify Director
      type: 'info',
      title: 'Kế hoạch mới được tạo',
      message: `${currentUser.name} đã tạo kế hoạch: ${newPlan.title}`,
      link: '/approvals'
    });
  }, [currentUser.name, addNotification]);

  const updatePlanStatus = useCallback((planId: string, status: DepartmentPlan['status'], reason?: string) => {
    setDeptPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedPlan = { 
          ...plan, 
          status, 
          rejectionReason: reason,
          updatedAt: new Date().toISOString()
        };
        
        if (status === 'approved') {
          updatedPlan.approvedAt = new Date().toISOString();
          updatedPlan.approvedBy = currentUser.id;
        }
        
        return updatedPlan;
      }
      return plan;
    }));
  }, [currentUser.id]);

  const addISODocument = useCallback((docData: Omit<ISODocument, 'id' | 'lastUpdatedAt' | 'lastUpdatedBy' | 'versionHistory' | 'status' | 'isDeleted'>) => {
    const newDoc: ISODocument = {
      ...docData,
      id: `iso-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      isDeleted: false,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: currentUser.id,
      versionHistory: [],
    };
    setIsoDocuments(prev => [newDoc, ...prev]);
    
    addNotification({
      userId: 'u1',
      type: 'success',
      title: 'Tài liệu ISO mới (Nháp)',
      message: `${currentUser.name} đã tải lên tài liệu nháp mới: ${newDoc.title}`,
      link: '/iso-management'
    });
  }, [currentUser.id, currentUser.name, addNotification]);

  const updateISODocumentStatus = useCallback((docId: string, status: ISODocument['status']) => {
    setIsoDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const updatedDoc = { ...doc, status, lastUpdatedAt: new Date().toISOString(), lastUpdatedBy: currentUser.id };
        
        addNotification({
          userId: 'u1',
          type: 'info',
          title: 'Cập nhật trạng thái ISO',
          message: `Tài liệu ${doc.code} đã chuyển sang trạng thái: ${status}`,
          link: '/iso-management'
        });
        
        return updatedDoc;
      }
      return doc;
    }));
  }, [currentUser.id, addNotification]);

  const deleteISODocument = useCallback((docId: string) => {
    setIsoDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, isDeleted: true, status: 'archived', lastUpdatedAt: new Date().toISOString() };
      }
      return doc;
    }));
    
    addNotification({
      userId: 'u6',
      type: 'warning',
      title: 'Tài liệu đã được lưu trữ',
      message: `Tài liệu đã được chuyển vào kho lưu trữ (Soft Delete).`,
      link: '/iso-management'
    });
  }, [addNotification]);

  const updateISODocumentVersion = useCallback((docId: string, file: File, version: string, note?: string, contentText?: string) => {
    setIsoDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const oldVersion = {
          id: Math.random().toString(36).substr(2, 9),
          name: doc.fileName,
          type: 'application/octet-stream',
          size: doc.fileSize,
          url: doc.fileUrl,
          version: doc.currentVersion,
          uploadedBy: doc.lastUpdatedBy,
          uploadedAt: doc.lastUpdatedAt,
          note: note || 'Cập nhật phiên bản mới'
        };

        return {
          ...doc,
          currentVersion: version,
          fileName: file.name,
          fileSize: file.size,
          lastUpdatedAt: new Date().toISOString(),
          lastUpdatedBy: currentUser.id,
          versionHistory: [oldVersion, ...doc.versionHistory],
          contentText: contentText || doc.contentText,
        };
      }
      return doc;
    }));
  }, [currentUser.id]);

  const contextValue = useMemo(() => ({
    currentUser,
    setCurrentUser,
    users,
    departments,
    companyPlans,
    deptPlans,
    notifications,
    isoDocuments,
    setDeptPlans,
    setNotifications,
    addNotification,
    updatePlanStatus,
    addISODocument,
    updateISODocumentVersion,
    updateISODocumentStatus,
    deleteISODocument
  }), [
    currentUser, 
    users, 
    departments, 
    companyPlans, 
    deptPlans, 
    notifications, 
    isoDocuments, 
    addNotification, 
    updatePlanStatus, 
    addISODocument, 
    updateISODocumentVersion, 
    updateISODocumentStatus, 
    deleteISODocument
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
