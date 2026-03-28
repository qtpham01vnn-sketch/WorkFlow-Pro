# Kế hoạch cải tiến (Future Roadmap)

## 0. Lịch sử Cải tiến (Đã hoàn thành)
*   **Chuẩn hóa ISO:** Triển khai vòng đời tài liệu (Draft -> Reviewing -> Published -> Archived) và cơ chế Soft Delete (Lưu trữ).
*   **Tối ưu Hiệu năng:** Tái cấu trúc component Quản lý ISO, áp dụng `useMemo` cho Dashboard và `AppContext` để tăng tốc độ phản hồi.
*   **Hệ thống Documentation:** Xây dựng bộ tài liệu kỹ thuật và hướng dẫn vận hành trong thư mục `docs/`.
*   **Thống nhất Dữ liệu:** Đồng bộ hóa cấu trúc Database Supabase với logic ứng dụng.

## 1. Tối ưu hóa AI & Dữ liệu
*   **Server-side Extraction:** Chuyển việc trích xuất văn bản (Text Extraction) từ Frontend sang Backend (Edge Functions) để xử lý các file lớn (trên 10MB) mà không gây lag trình duyệt.
*   **Vector Search:** Tích hợp pgvector vào Supabase để AI có thể tìm kiếm theo ngữ nghĩa (Semantic Search) thay vì chỉ tìm kiếm từ khóa đơn thuần.
*   **AI Summary:** Tự động tóm tắt nội dung tài liệu ISO khi tải lên để người dùng nắm nhanh ý chính.

## 2. Nâng cao Bảo mật & Phân quyền
*   **RBAC (Role-Based Access Control):** Triển khai phân quyền chi tiết hơn theo từng phòng ban (ví dụ: Phòng Kế toán chỉ xem được tài liệu của Kế toán và tài liệu chung).
*   **Audit Log chi tiết:** Ghi lại lịch sử ai đã xem, tải về hoặc cập nhật tài liệu nào (Traceability).
*   **Chữ ký số:** Tích hợp chữ ký số để phê duyệt tài liệu ISO trực tuyến (Paperless).

## 3. Tính năng ISO nâng cao
*   **Quản lý Đánh giá Nội bộ (Internal Audit):** Module riêng để lập kế hoạch và báo cáo đánh giá nội bộ định kỳ.
*   **Quản lý Sự không phù hợp (NC):** Theo dõi các lỗi phát sinh trong quá trình vận hành và hành động khắc phục (CAPA).
*   **Tự động hóa Email:** Tích hợp SendGrid hoặc Resend để gửi email nhắc nhở tự động hàng tuần thay vì nhấn nút thủ công.

## 4. Trải nghiệm người dùng (UX)
*   **Real-time Dashboard:** Hoàn thiện việc cập nhật Dashboard tức thời khi có thay đổi dữ liệu từ Supabase mà không cần tải lại trang.
*   **Mobile App:** Phát triển phiên bản ứng dụng di động để nhân viên có thể tra cứu quy trình ngay tại xưởng sản xuất.
*   **Đa ngôn ngữ:** Hỗ trợ tiếng Anh cho các tiêu chuẩn quốc tế và đối tác nước ngoài.

## 5. Tích hợp hệ thống
*   **ERP Integration:** Kết nối với hệ thống quản trị sản xuất gạch men để đồng bộ dữ liệu chất lượng.
*   **Google Drive/OneDrive Sync:** Tự động sao lưu tài liệu ISO sang các nền tảng lưu trữ đám mây phổ biến.
