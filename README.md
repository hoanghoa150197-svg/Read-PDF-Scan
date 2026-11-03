# PDF scan → Chọn vùng → Copy chữ (PWA)

Ứng dụng giữ nguyên giao diện và logic từ file HTML gốc. Đọc PDF theo kiểu cuộn liên tục, chọn vùng OCR, ghép đoạn, phóng to/thu nhỏ và sao chép văn bản.

## Triển khai GitHub Pages

1. Giải nén ZIP và tải **toàn bộ file trong thư mục gốc của ZIP** lên nhánh `main` của repository (không đặt trong thư mục con).
2. Vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn `main` và `/ (root)`, rồi lưu.
3. Mở địa chỉ HTTPS của GitHub Pages. Đường dẫn manifest, Service Worker và icon đều tương đối, hỗ trợ repository con.

## Cài lên thiết bị

- **iPhone/iPad:** Mở bằng Safari → Chia sẻ → **Thêm vào Màn hình chính**.
- **Android:** Mở Chrome → menu ⋮ → **Cài đặt ứng dụng** hoặc **Thêm vào màn hình chính**.
- **Máy tính:** Chrome/Edge → biểu tượng cài đặt ứng dụng trên thanh địa chỉ hoặc menu Cài đặt.

## Ngoại tuyến và dữ liệu

- Giao diện được lưu cache và có thể mở offline sau khi truy cập thành công qua HTTPS.
- PDF.js và Tesseract.js CDN được cache theo khả năng của trình duyệt, nhưng **Tesseract worker, WASM và dữ liệu ngôn ngữ OCR tiếng Việt/Anh có thể phải tải thêm từ Internet**. Vì vậy **không cam kết OCR offline**, kể cả khi giao diện mở được. Muốn OCR hoàn toàn offline cần đóng gói các phụ thuộc OCR/worker/WASM/language data tại chỗ và kiểm thử riêng.
- PDF do người dùng chọn được đọc trong phiên làm việc, **không được lưu lâu dài**; mở lại trang cần chọn lại file PDF. Văn bản kết quả OCR cũng **không được tự lưu**, giống HTML gốc. Không có tiến độ học trong ứng dụng này.
- Không chủ động gửi file PDF lên máy chủ; các thư viện từ CDN vẫn có thể tạo kết nối mạng.
- Trên iOS và các trình duyệt khác, hỗ trợ OCR và clipboard phụ thuộc quyền và tài nguyên thiết bị.

## Cập nhật

Khi thay mã, sửa hằng `VERSION` trong `sw.js` (ví dụ `pdf-ocr-pwa-v2`) để xóa cache phiên bản cũ. Khi phát hiện phiên bản mới, ứng dụng hỏi người dùng có tải lại không. Không xóa dữ liệu trình duyệt để cập nhật.

## Kiểm thử đề xuất

- Mở PDF scan nhiều trang; cuộn liên tục, nút trang trước/sau, nhập số trang, vừa khung, zoom.
- Khoanh đỏ bằng chuột hoặc cảm ứng; thử OCR `vie+eng`, `vie`, `eng` và nối nhiều đoạn.
- Sao chép, xóa kết quả, kiểm tra lỗi PDF không hợp lệ.
- Thử cài đặt và mở offline sau khi tải thư viện; xác nhận riêng việc OCR offline trên từng thiết bị.

Chưa có kiểm thử end-to-end trên Chrome/iOS/Android thật. Nguồn YouTube, AI hoặc các tính năng không có trong HTML gốc không được bổ sung.
