# Hướng dẫn tích hợp API Login

## Tổng quan
Đã tích hợp thành công API authentication vào trang login. JavaScript code sẽ gọi đến các endpoint của API backend.

## Các endpoint đã tích hợp

### 1. Login API
- **URL**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Token và thông tin user
- **Form**: Form đăng nhập (sign-in)

### 2. Register API  
- **URL**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Tên người dùng",
    "email": "user@example.com", 
    "password": "password123"
  }
  ```
- **Response**: Token và thông tin user
- **Form**: Form đăng ký (sign-up)

### 3. Validate Token API
- **URL**: `POST /api/auth/validate`
- **Request Body**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Response**: `{ "isValid": true/false }`
- **Usage**: Tự động kiểm tra khi load trang

## Cấu hình

### 1. Cập nhật API URL
Trong file `js/script.js`, dòng 2:
```javascript
const API_BASE_URL = 'https://localhost:7000/api/auth'; // Thay đổi URL này
```

### 2. Các URL có thể sử dụng:
- **Development**: `http://localhost:5000/api/auth`
- **Production**: `https://your-domain.com/api/auth`
- **Local HTTPS**: `https://localhost:7000/api/auth`

## Cách hoạt động

### 1. Đăng nhập (Login)
1. User nhập email và password
2. Click "Đăng Nhập"
3. JavaScript gọi API `/login`
4. Nếu thành công: lưu token, chuyển đến dashboard
5. Nếu thất bại: hiển thị lỗi

### 2. Đăng ký (Register)
1. User nhập tên, email và password
2. Click "Đăng ký"
3. JavaScript gọi API `/register`
4. Nếu thành công: lưu token, chuyển đến dashboard
5. Nếu thất bại: hiển thị lỗi

### 3. Auto-login
1. Khi load trang, kiểm tra token trong localStorage
2. Nếu có token: gọi API `/validate` để kiểm tra
3. Nếu token hợp lệ: tự động chuyển đến dashboard
4. Nếu token không hợp lệ: xóa token, ở lại trang login

## Token Management

### Lưu trữ
- **Token**: `localStorage.getItem('authToken')`
- **User info**: `localStorage.getItem('currentUser')`

### Sử dụng
- Token được gửi trong header `Authorization: Bearer {token}`
- Tự động validate khi cần thiết
- Tự động xóa khi không hợp lệ

## Error Handling

### Các loại lỗi được xử lý:
1. **Validation errors**: Thiếu thông tin input
2. **API errors**: Lỗi từ server (401, 400, 500...)
3. **Network errors**: Không kết nối được API
4. **Token errors**: Token không hợp lệ

### Hiển thị lỗi:
- Error message hiển thị dưới form
- Tự động ẩn sau 5 giây
- Màu đỏ, font size 12px

## Testing

### 1. Test đăng nhập:
```bash
# Mở browser, vào trang login
# Nhập email/password hợp lệ
# Click "Đăng Nhập"
# Kiểm tra console log và network tab
```

### 2. Test đăng ký:
```bash
# Click "Đăng Ký" để chuyển form
# Nhập thông tin mới
# Click "Đăng ký"
# Kiểm tra response
```

### 3. Test auto-login:
```bash
# Đăng nhập thành công
# Refresh trang
# Nên tự động chuyển đến dashboard
```

## Debug

### 1. Mở Developer Tools (F12)
- **Console**: Xem JavaScript logs
- **Network**: Xem API calls
- **Application**: Xem localStorage

### 2. Các log quan trọng:
- `Login successful:` - Đăng nhập thành công
- `Register successful:` - Đăng ký thành công  
- `Login error:` - Lỗi đăng nhập
- `Token validation error:` - Lỗi validate token

## Troubleshooting

### 1. API không kết nối được:
- Kiểm tra URL trong `API_BASE_URL`
- Kiểm tra CORS settings trên server
- Kiểm tra network connectivity

### 2. Form không submit:
- Kiểm tra JavaScript errors
- Kiểm tra event listeners
- Kiểm tra form validation

### 3. Token không hoạt động:
- Clear localStorage
- Kiểm tra token format
- Kiểm tra server validation

## Tương lai

### Có thể thêm:
1. Loading spinner khi gọi API
2. Remember me checkbox
3. Social login integration
4. Password strength indicator
5. Auto-save form data
6. Progressive Web App features
