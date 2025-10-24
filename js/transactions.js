// Transactions Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    loadTransactions();
});

// Initialize Charts
function initializeCharts() {
    // Expense Distribution Chart
    const expenseCtx = document.getElementById('expense-chart');
    if (expenseCtx) {
        new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ăn uống', 'Giao thông', 'Giải trí', 'Mua sắm', 'Hóa đơn', 'Y tế'],
                datasets: [{
                    data: [2500000, 1500000, 1200000, 1800000, 800000, 500000],
                    backgroundColor: [
                        '#FF6B6B',
                        '#4ECDC4',
                        '#45B7D1',
                        '#96CEB4',
                        '#FFEAA7',
                        '#DDA0DD'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Transaction Trend Chart
    const trendCtx = document.getElementById('trend-chart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Thu nhập',
                    data: [12000000, 13500000, 12800000, 14200000, 13800000, 15000000, 14500000, 15200000, 14800000, 15500000, 16000000, 15500000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Chi tiêu',
                    data: [8500000, 9200000, 8800000, 9500000, 9000000, 8200000, 8700000, 9200000, 8800000, 8500000, 8200000, 8000000],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Add Transaction Button
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const addTransactionModal = document.getElementById('add-transaction-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-transaction');
    const saveBtn = document.getElementById('save-transaction');

    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => {
            showModal(addTransactionModal);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            hideModal(addTransactionModal);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            hideModal(addTransactionModal);
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveTransaction);
    }

    // Transaction Type Toggle
    const typeToggleBtns = document.querySelectorAll('.type-toggle-btn');
    typeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCategoryOptions(btn.dataset.type);
        });
    });

    // Filter Buttons
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }

    // Export Button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTransactions);
    }

    // Transaction Actions
    const editBtns = document.querySelectorAll('.btn-edit');
    const deleteBtns = document.querySelectorAll('.btn-delete');

    editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            editTransaction(btn);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTransaction(btn);
        });
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
}

// Modal Functions
function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    resetTransactionForm();
}

// Transaction Type Toggle
function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('transaction-category');
    if (!categorySelect) return;

    // Clear existing options
    categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';

    if (type === 'income') {
        const incomeOptions = [
            { value: 'salary', text: '💼 Lương' },
            { value: 'bonus', text: '🎁 Thưởng' },
            { value: 'investment', text: '📈 Đầu tư' },
            { value: 'other-income', text: '💵 Khác' }
        ];
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = '💰 Thu nhập';
        
        incomeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optgroup.appendChild(optionElement);
        });
        
        categorySelect.appendChild(optgroup);
    } else {
        const expenseOptions = [
            { value: 'food', text: '🍽️ Ăn uống' },
            { value: 'transport', text: '🚗 Giao thông' },
            { value: 'entertainment', text: '🎬 Giải trí' },
            { value: 'shopping', text: '🛍️ Mua sắm' },
            { value: 'bills', text: '📄 Hóa đơn' },
            { value: 'healthcare', text: '🏥 Y tế' },
            { value: 'education', text: '🎓 Giáo dục' },
            { value: 'other-expense', text: '💸 Khác' }
        ];
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = '💸 Chi tiêu';
        
        expenseOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optgroup.appendChild(optionElement);
        });
        
        categorySelect.appendChild(optgroup);
    }
}

// Save Transaction
function saveTransaction() {
    const form = document.getElementById('add-transaction-form');
    const formData = new FormData(form);
    
    // Get form values
    const amount = document.getElementById('transaction-amount').value;
    const date = document.getElementById('transaction-date').value;
    const description = document.getElementById('transaction-description').value;
    const category = document.getElementById('transaction-category').value;
    const account = document.getElementById('transaction-account').value;
    const note = document.getElementById('transaction-note').value;
    const type = document.querySelector('.type-toggle-btn.active').dataset.type;
    
    // Validation
    if (!amount || !date || !description || !category || !account) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        showNotification('Số tiền phải lớn hơn 0!', 'error');
        return;
    }
    
    // Create transaction object
    const transaction = {
        id: Date.now(),
        amount: parseFloat(amount),
        date: date,
        description: description,
        category: category,
        account: account,
        note: note,
        type: type,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, this would be sent to server)
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Add to table
    addTransactionToTable(transaction);
    
    // Update summary cards
    updateSummaryCards();
    
    // Show success message
    showNotification('Thêm giao dịch thành công!', 'success');
    
    // Close modal
    hideModal(document.getElementById('add-transaction-modal'));
}

// Add Transaction to Table
function addTransactionToTable(transaction) {
    const tbody = document.getElementById('transactions-list');
    if (!tbody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatDate(transaction.date)}</td>
        <td>
            <div class="transaction-type">
                <div class="type-icon ${transaction.type}">
                    <i class="fas fa-arrow-${transaction.type === 'income' ? 'up' : 'down'}"></i>
                </div>
                <span>${transaction.description}</span>
            </div>
        </td>
        <td><span class="type-badge ${transaction.type}">${transaction.type === 'income' ? '💰 Thu' : '💸 Chi'}</span></td>
        <td><span class="category-badge">${getCategoryIcon(transaction.category)} ${getCategoryName(transaction.category)}</span></td>
        <td class="amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}</td>
        <td>
            <div class="transaction-actions">
                <button class="btn-action btn-edit" title="Chỉnh sửa" onclick="editTransaction(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" title="Xóa" onclick="deleteTransaction(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Edit Transaction
function editTransaction(btn) {
    const row = btn.closest('tr');
    const transactionId = row.dataset.id;
    
    // In a real app, you would load the transaction data and populate the form
    showNotification('Tính năng chỉnh sửa đang được phát triển!', 'info');
}

// Delete Transaction
function deleteTransaction(btn) {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
        return;
    }
    
    const row = btn.closest('tr');
    const transactionId = row.dataset.id;
    
    // Remove from localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = transactions.filter(t => t.id != transactionId);
    localStorage.setItem('transactions', updatedTransactions);
    
    // Remove from table
    row.remove();
    
    // Update summary cards
    updateSummaryCards();
    
    showNotification('Xóa giao dịch thành công!', 'success');
}

// Apply Filters
function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const amountFilter = document.getElementById('amount-filter').value;
    
    const rows = document.querySelectorAll('#transactions-list tr');
    
    rows.forEach(row => {
        let show = true;
        
        // Type filter
        if (typeFilter !== 'all') {
            const typeBadge = row.querySelector('.type-badge');
            if (typeBadge) {
                const isIncome = typeBadge.classList.contains('income');
                if ((typeFilter === 'income' && !isIncome) || (typeFilter === 'expense' && isIncome)) {
                    show = false;
                }
            }
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            const categoryBadge = row.querySelector('.category-badge');
            if (categoryBadge && !categoryBadge.textContent.toLowerCase().includes(categoryFilter.toLowerCase())) {
                show = false;
            }
        }
        
        // Date filter
        if (dateFrom || dateTo) {
            const dateCell = row.querySelector('td:first-child');
            if (dateCell) {
                const rowDate = new Date(dateCell.textContent.split('/').reverse().join('-'));
                if (dateFrom && rowDate < new Date(dateFrom)) show = false;
                if (dateTo && rowDate > new Date(dateTo)) show = false;
            }
        }
        
        // Amount filter
        if (amountFilter !== 'all') {
            const amountCell = row.querySelector('.amount');
            if (amountCell) {
                const amount = parseFloat(amountCell.textContent.replace(/[^\d]/g, ''));
                const [min, max] = amountFilter.split('-').map(v => v === '+' ? Infinity : parseInt(v));
                if (amount < min || (max !== Infinity && amount > max)) {
                    show = false;
                }
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
    
    showNotification('Đã áp dụng bộ lọc!', 'success');
}

// Reset Filters
function resetFilters() {
    document.getElementById('type-filter').value = 'all';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    document.getElementById('amount-filter').value = 'all';
    
    // Show all rows
    const rows = document.querySelectorAll('#transactions-list tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    showNotification('Đã đặt lại bộ lọc!', 'info');
}

// Export Transactions
function exportTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    if (transactions.length === 0) {
        showNotification('Không có dữ liệu để xuất!', 'warning');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Ngày,Mô tả,Loại,Danh mục,Số tiền,Ghi chú\n';
    
    transactions.forEach(transaction => {
        csvContent += `${transaction.date},"${transaction.description}",${transaction.type === 'income' ? 'Thu' : 'Chi'},"${getCategoryName(transaction.category)}",${transaction.amount},"${transaction.note || ''}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `giao-dich-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Xuất file thành công!', 'success');
}

// Load Transactions
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    if (transactions.length === 0) {
        // Add sample data
        const sampleTransactions = [
            {
                id: 1,
                amount: 15000000,
                date: '2024-12-15',
                description: 'Lương tháng 12',
                category: 'salary',
                account: 'bank',
                note: '',
                type: 'income',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                amount: 85000,
                date: '2024-12-14',
                description: 'Ăn trưa',
                category: 'food',
                account: 'cash',
                note: '',
                type: 'expense',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                amount: 200000,
                date: '2024-12-13',
                description: 'Xăng xe',
                category: 'transport',
                account: 'cash',
                note: '',
                type: 'expense',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                amount: 1500000,
                date: '2024-12-12',
                description: 'Mua sắm online',
                category: 'shopping',
                account: 'credit',
                note: '',
                type: 'expense',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                amount: 500000,
                date: '2024-12-11',
                description: 'Tiền thưởng',
                category: 'bonus',
                account: 'bank',
                note: '',
                type: 'income',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    }
    
    updateSummaryCards();
}

// Update Summary Cards
function updateSummaryCards() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpense;
    
    // Update summary cards
    const incomeCard = document.querySelector('.summary-card.income .amount');
    const expenseCard = document.querySelector('.summary-card.expense .amount');
    const balanceCard = document.querySelector('.summary-card.balance .amount');
    
    if (incomeCard) incomeCard.textContent = formatCurrency(totalIncome);
    if (expenseCard) expenseCard.textContent = formatCurrency(totalExpense);
    if (balanceCard) balanceCard.textContent = formatCurrency(netBalance);
}

// Reset Transaction Form
function resetTransactionForm() {
    const form = document.getElementById('add-transaction-form');
    if (form) {
        form.reset();
        document.querySelector('.type-toggle-btn.income').classList.add('active');
        document.querySelector('.type-toggle-btn.expense').classList.remove('active');
        updateCategoryOptions('income');
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function getCategoryIcon(category) {
    const icons = {
        'salary': '💼',
        'bonus': '🎁',
        'investment': '📈',
        'food': '🍽️',
        'transport': '🚗',
        'entertainment': '🎬',
        'shopping': '🛍️',
        'bills': '📄',
        'healthcare': '🏥',
        'education': '🎓',
        'other-income': '💵',
        'other-expense': '💸'
    };
    return icons[category] || '📝';
}

function getCategoryName(category) {
    const names = {
        'salary': 'Lương',
        'bonus': 'Thưởng',
        'investment': 'Đầu tư',
        'food': 'Ăn uống',
        'transport': 'Giao thông',
        'entertainment': 'Giải trí',
        'shopping': 'Mua sắm',
        'bills': 'Hóa đơn',
        'healthcare': 'Y tế',
        'education': 'Giáo dục',
        'other-income': 'Khác',
        'other-expense': 'Khác'
    };
    return names[category] || 'Khác';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
