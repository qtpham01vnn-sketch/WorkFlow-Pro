import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Schema Suggestion:
// 
// table: departments
// - id (uuid, primary key)
// - name (text)
// 
// table: users
// - id (uuid, primary key)
// - email (text)
// - role (text: 'admin', 'manager', 'staff')
// - department_id (uuid, foreign key)
// 
// table: iso_documents
// - id (uuid, primary key)
// - code (text, unique)
// - title (text)
// - category (text: 'quy_trinh', 'bieu_mau', 'ho_so', 'hdcv')
// - department_id (uuid, foreign key)
// - current_version_id (uuid, foreign key to iso_document_versions)
// - next_review_date (timestamp)
// - status (text: 'active', 'obsolete')
// 
// table: iso_document_versions
// - id (uuid, primary key)
// - document_id (uuid, foreign key)
// - version_number (text, e.g., 'v1.0')
// - file_path (text, path in Supabase Storage)
// - file_name (text)
// - file_size (int)
// - uploaded_by (uuid, foreign key)
// - uploaded_at (timestamp)
// - change_note (text)
// - content_text (text, for AI search)
