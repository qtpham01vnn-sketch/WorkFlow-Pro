# Quản lý Hệ thống ISO (ISO Management System)

## 1. Các tiêu chuẩn hỗ trợ
Hệ thống được thiết kế để quản lý đồng thời nhiều tiêu chuẩn ISO quan trọng trong ngành sản xuất gạch men:
*   **ISO 9001:2015:** Quản lý chất lượng.
*   **ISO 14001:2015:** Quản lý môi trường.
*   **ISO 13006:2018:** Tiêu chuẩn gạch gốm.
*   **BS EN 14411:2016:** Tiêu chuẩn gạch ốp lát.

## 2. Quy trình vòng đời tài liệu (Workflow)
Hệ thống áp dụng luồng phê duyệt 3 bước chính để đảm bảo tính chính xác và hiệu lực của tài liệu:

1.  **Draft (Bản nháp):** Tài liệu mới tải lên hoặc đang trong quá trình soạn thảo. Chỉ Admin ISO và người tạo mới có quyền xem/sửa.
2.  **Reviewing (Đang xem xét):** Tài liệu được gửi đi để các bên liên quan (Trưởng phòng, Ban ISO) kiểm tra nội dung.
3.  **Published (Ban hành):** Tài liệu đã được phê duyệt chính thức, có hiệu lực áp dụng toàn công ty.
4.  **Obsolete (Hết hiệu lực):** Khi có phiên bản mới thay thế, phiên bản cũ sẽ tự động chuyển sang trạng thái này.
5.  **Archived (Đã lưu trữ):** Tài liệu đã được "xóa mềm" khỏi hệ thống chính thức.

## 3. Cơ chế Lưu trữ (Soft Delete)
Để tuân thủ yêu cầu về tính truy xuất nguồn gốc (Traceability) của ISO:
*   **KHÔNG** thực hiện xóa vĩnh viễn (Hard Delete) bất kỳ tài liệu nào khỏi cơ sở dữ liệu.
*   Khi người dùng nhấn "Xóa", hệ thống sẽ cập nhật trường `isDeleted = true` và chuyển trạng thái sang `archived`.
*   Dữ liệu này vẫn được lưu trữ trong Database để phục vụ việc tra soát (Audit Trail) nhưng sẽ không hiển thị trong danh sách làm việc hàng ngày.

## 4. Quản lý Phiên bản (Version Control)
*   Hệ thống tự động lưu trữ lịch sử các phiên bản cũ (`versionHistory`).
*   Khi cập nhật phiên bản mới (ví dụ từ v1.0 lên v2.0), file cũ sẽ được đưa vào lịch sử, file mới trở thành phiên bản hiện tại.
*   Mỗi lần cập nhật đều yêu cầu ghi chú (Note) lý do thay đổi để phục vụ việc đánh giá ISO.

## 5. Hệ thống Cảnh báo & Nhắc nhở
*   **Ngưỡng cảnh báo:** 30 ngày trước khi tài liệu đến hạn đánh giá định kỳ.
*   **Cảnh báo trên Dashboard:** Hiển thị số lượng tài liệu "Sắp hết hạn" và "Quá hạn".
*   **Email Reminder:** Tự động gửi email nhắc nhở cho các bộ phận liên quan để chuẩn bị hồ sơ đánh giá.
