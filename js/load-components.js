// Hàm load component HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Load tất cả components
async function loadAllComponents() {
    await Promise.all([
        loadComponent('sidebar-container', 'components/sidebar.html'),
        loadComponent('header-container', 'components/header.html'),
        loadComponent('summary-cards-container', 'components/summary-cards.html'),
        loadComponent('charts-container', 'components/charts.html'),
        loadComponent('calendar-container', 'components/calendar.html'),
        loadComponent('quick-expense-container', 'components/quick-expense.html')
    ]);
    
    // Sau khi load xong, khởi tạo charts và logout
    initCharts();
    initLogout();
}

// Khởi tạo chức năng logout
function initLogout() {
    // Tạo modal logout
    const modalHTML = `
        <div id="logout-modal" class="logout-modal">
            <div class="logout-modal-content">
                <i class="fas fa-sign-out-alt"></i>
                <h3>Xác nhận Đăng xuất</h3>
                <p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
                <div class="logout-modal-buttons">
                    <button class="btn-cancel" id="cancel-logout">Hủy</button>
                    <button class="btn-logout" id="confirm-logout">Đăng xuất</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('logout-modal');
    const logoutBtn = document.getElementById('logout-btn');
    const cancelBtn = document.getElementById('cancel-logout');
    const confirmBtn = document.getElementById('confirm-logout');
    
    // Mở modal
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });
    }
    
    // Đóng modal
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Xác nhận đăng xuất
    confirmBtn.addEventListener('click', () => {
        // Thêm animation trước khi chuyển trang
        modal.classList.remove('show');
        
        // Xóa session/token nếu có
        localStorage.removeItem('userToken');
        sessionStorage.clear();
        
        // Chuyển về trang đăng nhập sau 300ms
        setTimeout(() => {
            window.location.href = 'index.html'; // hoặc trang login của bạn
        }, 300);
    });
}

// Load components khi trang được load
document.addEventListener('DOMContentLoaded', loadAllComponents);