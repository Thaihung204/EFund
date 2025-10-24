// API Configuration
const API_BASE_URL = 'https://localhost:7000/api/auth'; // Thay đổi URL này theo API server của bạn

// DOM Elements
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between login and register forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Form Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Lấy form đăng nhập
    const loginForm = document.querySelector('.sign-in form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Lấy form đăng ký
    const registerForm = document.querySelector('.sign-up form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Function để xử lý đăng nhập
async function handleLogin(event) {
    event.preventDefault(); // Ngăn form submit mặc định
    
    // Lấy dữ liệu từ form
    const formData = new FormData(event.target);
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
    
    // Validation cơ bản
    if (!email || !password) {
        showError('Vui lòng nhập đầy đủ email và mật khẩu');
        return;
    }
    
    try {
        // Gọi API login
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Đăng nhập thành công
            console.log('Login successful:', data);
            
            // Lưu token vào localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            // Lưu thông tin user
            if (data.user) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            // Chuyển hướng đến dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            // Đăng nhập thất bại
            const errorMessage = data.message || 'Đăng nhập thất bại';
            showError(errorMessage);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
}

// Function để hiển thị lỗi
function showError(message) {
    // Tìm hoặc tạo element hiển thị lỗi
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: red; font-size: 12px; margin: 10px 0; text-align: center;';
        
        // Thêm vào form đăng nhập
        const loginForm = document.querySelector('.sign-in form');
        if (loginForm) {
            loginForm.appendChild(errorDiv);
        }
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Ẩn lỗi sau 5 giây
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Function để kiểm tra token và tự động đăng nhập
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            // Validate token với API
            const response = await fetch(`${API_BASE_URL}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token
                })
            });
            
            const data = await response.json();
            
            if (data.isValid) {
                // Token hợp lệ, chuyển đến dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Token không hợp lệ, xóa khỏi localStorage
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    }
}

// Function để xử lý đăng ký
async function handleRegister(event) {
    event.preventDefault(); // Ngăn form submit mặc định
    
    // Lấy dữ liệu từ form
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validation cơ bản
    if (!name || !email || !password) {
        showError('Vui lòng nhập đầy đủ thông tin');
        return;
    }
    
    try {
        // Gọi API register
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Đăng ký thành công
            console.log('Register successful:', data);
            
            // Lưu token vào localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            // Lưu thông tin user
            if (data.user) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            // Chuyển hướng đến dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            // Đăng ký thất bại
            const errorMessage = data.message || 'Đăng ký thất bại';
            showError(errorMessage);
        }
        
    } catch (error) {
        console.error('Register error:', error);
        showError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    }
}

// Kiểm tra trạng thái đăng nhập khi load trang
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});