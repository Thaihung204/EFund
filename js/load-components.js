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
    
    // Sau khi load xong, khởi tạo charts
    initCharts();
}

// Load components khi trang được load
document.addEventListener('DOMContentLoaded', loadAllComponents);