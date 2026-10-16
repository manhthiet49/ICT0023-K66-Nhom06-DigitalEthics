# SOURCES.md

## 1. Tài liệu

1. Bootstrap 5 Documentation  
   - Nội dung sử dụng: grid hệ thống lưới, navbar, card, accordion, alert, form, progress, badge, breadcrumb, utilities.  
   - Tác giả: Bootstrap Team  
   - Ngày truy cập: 16/10/2026  
   - Mục đích: tham khảo cấu trúc giao diện responsive và thành phần UI.

2. Bootstrap Icons Documentation  
   - Nội dung sử dụng: biểu tượng cho menu, nút, card, FAQ, footer và form.  
   - Tác giả: Bootstrap Team  
   - Ngày truy cập: 16/10/2026  
   - Mục đích: chọn icon phù hợp cho các phần nội dung và thao tác.

3. MDN Web Docs  
   - Nội dung sử dụng: `addEventListener`, `fetch`, `DOMContentLoaded`, `querySelector`, `classList`, xử lý form và DOM.  
   - Tác giả: Mozilla  
   - Ngày truy cập: 16/10/2026  
   - Mục đích: tham khảo cách dùng JavaScript và HTML chuẩn.

4. jQuery Documentation  
   - Nội dung sử dụng: `on()`, `val()`, `addClass()`, `removeClass()`, `hide()`, `show()` trong phần tìm kiếm thuật ngữ.  
   - Tác giả: jQuery Foundation  
   - Ngày truy cập: 16/10/2026  
   - Mục đích: tham khảo cách viết chức năng tìm kiếm gọn và dễ hiểu.

## 2. Mã tham khảo

1. Bootstrap component examples  
   - URL: https://getbootstrap.com/docs/5.3/components/  
   - Tác giả: Bootstrap Team  
   - Ngày truy cập: 16/10/2026  
   - Phần đã dùng: navbar, card, accordion, alert, form, progress, breadcrumb  
   - Cách chỉnh sửa: tùy biến lại màu sắc, bố cục, thêm nội dung riêng của nhóm  
   - Cách kiểm thử: mở từng trang trên desktop và điện thoại, kiểm tra hiển thị và hoạt động nút

2. jQuery API reference  
   - URL: https://api.jquery.com/  
   - Tác giả: OpenJS Foundation  
   - Ngày truy cập: 16/10/2026  
   - Phần đã dùng: xử lý sự kiện nhập liệu và hiệu ứng cho ô tìm kiếm thuật ngữ  
   - Cách chỉnh sửa: chỉ dùng cho một chức năng có ý nghĩa, không sao chép nguyên mẫu  
   - Cách kiểm thử: nhập từ khóa ở trang thuật ngữ và kiểm tra kết quả lọc

3. MDN fetch() guide  
   - URL: https://developer.mozilla.org/  
   - Tác giả: Mozilla  
   - Ngày truy cập: 16/10/2026  
   - Phần đã dùng: tải dữ liệu câu hỏi từ `data/questions.json`  
   - Cách chỉnh sửa: thêm xử lý lỗi, kiểm tra dữ liệu hợp lệ, cập nhật giao diện kết quả  
   - Cách kiểm thử: đổi tạm đường dẫn JSON để kiểm tra thông báo lỗi

## 3. Ảnh / dữ liệu

1. Ảnh minh họa trong thư mục `images/`
   - `logo.png`
   - `banner.jpg`
   - `security.jpg`
   - `ethics.jpg`
   - `citizen.jpg`
   - `cyberbullying.jpg`
   - Mục đích: minh họa nội dung bài giảng, trang chủ và trang liên hệ
   - Nguồn: tài nguyên sử dụng trong dự án của nhóm; nếu thay bằng ảnh ngoài, cần ghi lại URL và giấy phép sử dụng tương ứng

2. Dữ liệu câu hỏi trắc nghiệm
   - File: `data/questions.json`
   - Mục đích: tạo bộ câu hỏi ôn tập và chấm điểm tự động
   - Nguồn: nhóm tự biên soạn dựa trên nội dung Chủ đề D
   - Ghi chú: dữ liệu dùng cục bộ trong trình duyệt, không gửi lên máy chủ

3. Nội dung bài học và thuật ngữ
   - File: `index.html`, `lesson.html`, `quiz.html`, `glossary.html`, `contact.html`
   - Mục đích: cung cấp nội dung chính của website
   - Nguồn: nhóm tự biên soạn theo Chủ đề D và kiến thức học phần

## 4. Công cụ AI

1. ChatGPT  
   - Ngày sử dụng: 16/10/2026  
   - Prompt chính: hỗ trợ viết README.md, CONTRIBUTIONS.md, SOURCES.md; rà soát cấu trúc website; gợi ý sửa lỗi HTML/CSS/JavaScript; chỉnh nội dung khớp với bài nộp cuối cùng  
   - Phần tiếp nhận: hỗ trợ bố cục tài liệu, cách trình bày, gợi ý kỹ thuật kiểm thử, rà soát tính đồng bộ giữa các file  
   - Phần loại bỏ: các phần không khớp với code thực tế hoặc không phù hợp yêu cầu của giảng viên  
   - Cách kiểm chứng: đối chiếu lại với mã nguồn, chạy thử website trên trình duyệt và kiểm tra từng chức năng

## 5. Ghi chú chung

- Không sử dụng dữ liệu cá nhân thật của học sinh.
- Không dùng backend, cơ sở dữ liệu, đăng nhập hay lưu trữ dữ liệu người dùng.
- Tất cả dữ liệu phản hồi và kết quả ôn tập chỉ tồn tại trong phiên đang mở.
