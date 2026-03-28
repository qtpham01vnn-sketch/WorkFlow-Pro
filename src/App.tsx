import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Plans } from './pages/Plans';
import { DeptPlans } from './pages/DeptPlans';
import { Approvals } from './pages/Approvals';
import { Progress } from './pages/Progress';
import { Reports } from './pages/Reports';
import { Documents } from './pages/Documents';
import { ISODocuments } from './pages/ISODocuments';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen bg-bg-main text-text-primary">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/department-plans" element={<DeptPlans />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/iso-management" element={<ISODocuments />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}








