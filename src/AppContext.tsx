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
  addDeptPlan: (plan: Omit<DepartmentPlan, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'tasks' | 'attachments'> & { files?: File[] }) => Promise<void>;
  updatePlanStatus: (planId: string, status: DepartmentPlan['status'], reason?: string) => Promise<void>;
  addISODocument: (doc: Omit<ISODocument, 'id' | 'lastUpdatedAt' | 'lastUpdatedBy' | 'versionHistory' | 'status' | 'isDeleted' | 'fileUrl' | 'fileName' | 'fileSize'> & { file: File }) => Promise<void>;
  updateISODocumentVersion: (docId: string, file: File, version: string, note?: string, contentText?: string) => Promise<void>;
  updateISODocumentStatus: (docId: string, status: ISODocument['status']) => Promise<void>;
  deleteISODocument: (docId: string) => Promise<void>;
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
        // Fetch ISO Documents
        const { data: docs, error: docsError } = await supabase
          .from('iso_app_documents')
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

        // Fetch Department Plans
        const { data: plans, error: plansError } = await supabase
          .from('iso_app_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (plansError) throw plansError;

        if (plans) {
          const mappedPlans: DepartmentPlan[] = plans.map((p: any) => ({
            id: p.id,
            companyPlanId: p.company_plan_id,
            departmentId: p.department_id,
            title: p.title,
            description: p.description,
            deadline: p.deadline,
            status: p.status,
            currentVersion: p.current_version,
            submittedAt: p.submitted_at,
            approvedAt: p.approved_at,
            approvedBy: p.approved_by,
            rejectionReason: p.rejection_reason,
            attachments: p.attachments || [],
            tasks: p.tasks || [],
            createdBy: p.created_by,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
          setDeptPlans(mappedPlans);
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

  const uploadFile = async (file: File, bucket: 'iso-documents' | 'plans', path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error(`Storage upload error in ${bucket}:`, error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const addDeptPlan = useCallback(async (planData: Omit<DepartmentPlan, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'tasks' | 'attachments'> & { files?: File[] }) => {
    try {
      const uploadedAttachments = [];
      
      // 1. Upload attachments if any
      if (planData.files && planData.files.length > 0) {
        for (const file of planData.files) {
          const fileName = `${currentUser.id}_${Date.now()}_${file.name}`;
          const filePath = `attachments/${fileName}`;
          const url = await uploadFile(file, 'plans', filePath);
          
          uploadedAttachments.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            url: url,
            version: 'v1.0',
            uploadedBy: currentUser.id,
            uploadedAt: new Date().toISOString()
          });
        }
      }

      // 2. Insert into Supabase
      const { data, error } = await supabase
        .from('iso_app_plans')
        .insert([{
          company_plan_id: planData.companyPlanId,
          department_id: planData.departmentId,
          title: planData.title,
          description: planData.description,
          deadline: planData.deadline,
          start_date: planData.startDate,
          end_date: planData.endDate,
          priority: planData.priority,
          status: 'pending', // Default to pending for approval
          current_version: 'v1.0',
          attachments: uploadedAttachments,
          tasks: [],
          created_by: currentUser.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPlan: DepartmentPlan = {
          id: data.id,
          companyPlanId: data.company_plan_id,
          departmentId: data.department_id,
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          startDate: data.start_date,
          endDate: data.end_date,
          priority: data.priority,
          status: data.status,
          currentVersion: data.current_version,
          attachments: data.attachments,
          tasks: data.tasks,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setDeptPlans(prev => [newPlan, ...prev]);
        
        addNotification({
          userId: 'u1', // Notify Director
          type: 'info',
          title: 'Kế hoạch mới được tạo',
          message: `${currentUser.name} đã tạo kế hoạch: ${newPlan.title}`,
          link: '/approvals'
        });
      }
    } catch (error) {
      console.error('Error adding department plan:', error);
      throw error;
    }
  }, [currentUser.id, currentUser.name, addNotification]);

  const updatePlanStatus = useCallback(async (planId: string, status: DepartmentPlan['status'], reason?: string) => {
    try {
      const updateData: any = { 
        status, 
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = currentUser.id;
      }

      const { error } = await supabase
        .from('iso_app_plans')
        .update(updateData)
        .eq('id', planId);

      if (error) throw error;

      setDeptPlans(prev => prev.map(plan => {
        if (plan.id === planId) {
          return { 
            ...plan, 
            status, 
            rejectionReason: reason,
            updatedAt: new Date().toISOString(),
            approvedAt: status === 'approved' ? updateData.approved_at : plan.approvedAt,
            approvedBy: status === 'approved' ? currentUser.id : plan.approvedBy
          };
        }
        return plan;
      }));
    } catch (error) {
      console.error('Error updating plan status:', error);
      throw error;
    }
  }, [currentUser.id]);

  const addISODocument = useCallback(async (docData: Omit<ISODocument, 'id' | 'lastUpdatedAt' | 'lastUpdatedBy' | 'versionHistory' | 'status' | 'isDeleted' | 'fileUrl' | 'fileName' | 'fileSize'> & { file: File }) => {
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = docData.file.name.split('.').pop();
      const fileName = `${docData.code}_${docData.currentVersion}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      const publicUrl = await uploadFile(docData.file, 'iso-documents', filePath);

      // 2. Insert metadata to Database
      const { data, error } = await supabase
        .from('iso_app_documents')
        .insert([{
          code: docData.code,
          title: docData.title,
          category: docData.category,
          standard: docData.standard,
          department_id: docData.departmentId,
          current_version: docData.currentVersion,
          status: 'draft',
          is_deleted: false,
          file_url: publicUrl,
          file_name: docData.file.name,
          file_size: docData.file.size,
          last_updated_by: currentUser.id,
          next_review_date: docData.nextReviewDate,
          content_text: docData.contentText
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newDoc: ISODocument = {
          id: data.id,
          code: docData.code,
          title: docData.title,
          category: docData.category,
          standard: docData.standard,
          departmentId: docData.departmentId,
          currentVersion: docData.currentVersion,
          status: 'draft',
          isDeleted: false,
          fileUrl: publicUrl,
          fileName: docData.file.name,
          fileSize: docData.file.size,
          lastUpdatedAt: data.last_updated_at,
          lastUpdatedBy: currentUser.id,
          versionHistory: [],
          nextReviewDate: docData.nextReviewDate,
          contentText: docData.contentText
        };
        setIsoDocuments(prev => [newDoc, ...prev]);
        
        addNotification({
          userId: 'u1',
          type: 'success',
          title: 'Tài liệu ISO mới (Nháp)',
          message: `${currentUser.name} đã tải lên tài liệu nháp mới: ${newDoc.title}`,
          link: '/iso-management'
        });
      }
    } catch (error) {
      console.error('Error adding ISO document:', error);
      throw error;
    }
  }, [currentUser.id, currentUser.name, addNotification]);

  const updateISODocumentStatus = useCallback(async (docId: string, status: ISODocument['status']) => {
    try {
      const { error } = await supabase
        .from('iso_app_documents')
        .update({ 
          status, 
          last_updated_at: new Date().toISOString(), 
          last_updated_by: currentUser.id 
        })
        .eq('id', docId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating ISO document status:', error);
      throw error;
    }
  }, [currentUser.id, addNotification]);

  const deleteISODocument = useCallback(async (docId: string) => {
    try {
      const { error } = await supabase
        .from('iso_app_documents')
        .update({ 
          is_deleted: true, 
          status: 'archived', 
          last_updated_at: new Date().toISOString() 
        })
        .eq('id', docId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting ISO document:', error);
      throw error;
    }
  }, [addNotification]);

  const updateISODocumentVersion = useCallback(async (docId: string, file: File, version: string, note?: string, contentText?: string) => {
    try {
      const doc = isoDocuments.find(d => d.id === docId);
      if (!doc) return;

      // 1. Upload new version to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${doc.code}_${version}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      const publicUrl = await uploadFile(file, 'iso-documents', filePath);

      // 2. Prepare version history
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

      const newVersionHistory = [oldVersion, ...doc.versionHistory];

      // 3. Update metadata in Database
      const { error } = await supabase
        .from('iso_app_documents')
        .update({
          current_version: version,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          last_updated_at: new Date().toISOString(),
          last_updated_by: currentUser.id,
          version_history: newVersionHistory,
          content_text: contentText || doc.contentText
        })
        .eq('id', docId);

      if (error) throw error;

      setIsoDocuments(prev => prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            currentVersion: version,
            fileUrl: publicUrl,
            fileName: file.name,
            fileSize: file.size,
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: currentUser.id,
            versionHistory: newVersionHistory,
            contentText: contentText || d.contentText,
          };
        }
        return d;
      }));
    } catch (error) {
      console.error('Error updating ISO document version:', error);
      throw error;
    }
  }, [currentUser.id, isoDocuments]);

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
