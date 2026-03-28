# Kiến trúc Kỹ thuật (Technical Architecture)

## 1. Công nghệ sử dụng (Tech Stack)
*   **Frontend:** React 18+, Vite, TypeScript.
*   **Styling:** Tailwind CSS, Framer Motion (Animation).
*   **Backend:** Supabase (Database, Auth, Storage).
*   **AI Engine:** Google Gemini AI (Gemini 3 Flash).
*   **Data Export:** XLSX (Excel).

## 2. Cơ sở dữ liệu (Supabase)
Hệ thống sử dụng Supabase làm nền tảng Backend-as-a-Service:
*   **Supabase Database:** Lưu trữ thông tin tài liệu, kế hoạch, thông báo, người dùng.
*   **Supabase Storage:** Lưu trữ file tài liệu thực tế (PDF, DOCX, XLSX).
*   **Supabase Auth:** Quản lý đăng nhập và phân quyền người dùng.
*   **Supabase Realtime:** Cập nhật Dashboard tức thời khi có thay đổi dữ liệu.

### 2.1. Cấu trúc bảng `iso_documents` (Quan trọng)
*   `id`: UUID (Khóa chính).
*   `code`: Mã tài liệu (VD: QT-ISO-01).
*   `title`: Tên tài liệu.
*   `category`: Loại tài liệu (quy_trinh, bieu_mau, ho_so, hdcv, quy_dinh).
*   `standard`: Tiêu chuẩn ISO áp dụng.
*   `department_id`: ID phòng ban sở hữu.
*   `current_version`: Phiên bản hiện tại (v1.0, v2.0...).
*   `status`: Trạng thái (draft, reviewing, published, obsolete, archived).
*   `is_deleted`: Boolean (Soft Delete flag).
*   `file_url`: Link file trên Supabase Storage.
*   `content_text`: Văn bản đã trích xuất từ file (phục vụ AI Search).
*   `version_history`: JSONB lưu lịch sử các phiên bản cũ.

## 3. Tích hợp AI (Gemini AI)
Hệ thống tích hợp AI để giải quyết bài toán "tra cứu thông minh":
*   **Trích xuất văn bản (Extraction Service):** Khi tải file lên, hệ thống tự động trích xuất nội dung văn bản (Text) từ PDF/Word/Excel.
*   **Tìm kiếm thông minh (AI Assistant):** Người dùng có thể hỏi AI về nội dung tài liệu. AI sẽ dựa trên `content_text` để trả lời chính xác quy trình/biểu mẫu.
*   **Tối ưu hóa:** Nội dung văn bản được lưu trữ trực tiếp trong Database để AI có thể truy xuất ngay lập tức mà không cần đọc lại file gốc.

## 4. Quản lý Trạng thái & Tối ưu Hiệu năng
*   **State Management:** Sử dụng **React Context API (`AppContext.tsx`)** được tối ưu hóa bằng `useMemo` và `useCallback` để tránh re-render dư thừa.
*   **Memoization Strategy:** 
    *   Sử dụng `useMemo` cho các phép tính toán thống kê phức tạp trên Dashboard.
    *   Sử dụng `React.memo` cho các component hiển thị danh sách (như `ISODocCard`) để chỉ vẽ lại khi dữ liệu thực sự thay đổi.
*   **Component Isolation:** Tách biệt các module có trạng thái thay đổi liên tục (như Trợ lý AI) ra khỏi danh sách dữ liệu chính để đảm bảo trải nghiệm gõ phím mượt mà.
*   **Error Handling:** Tích hợp xử lý lỗi tập trung cho các thao tác với Supabase.

## 5. Phân quyền (RBAC)
*   **Admin/Director:** Toàn quyền quản lý tài liệu, phê duyệt kế hoạch, gửi email nhắc nhở.
*   **Manager:** Xem tài liệu, lập kế hoạch cho phòng ban mình, nhận thông báo.
*   **Staff:** Xem tài liệu, thực hiện công việc được giao, nhận thông báo.
*   **ISO Admin:** Quyền đặc biệt để quản lý danh mục tài liệu ISO và tiêu chuẩn.
