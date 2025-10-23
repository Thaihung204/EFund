function initCharts() {
    const monthlyData = {
        labels: ['T5/25', 'T6/25', 'T7/25', 'T8/25', 'T9/25', 'T10/25'],
        datasets: [
            {
                label: 'Thu nhập',
                data: [45, 52, 60, 55, 65, 50],
                backgroundColor: '#4caf50',
                borderRadius: 8,
                stack: 'Stack 0',
            },
            {
                label: 'Chi tiêu',
                data: [-15, -18, -20, -17, -25, -12.5],
                backgroundColor: '#f44336',
                borderRadius: 8,
                stack: 'Stack 0',
            }
        ]
    };

    const expenseDoughnutData = {
        labels: ['Nhà ở (Thuê)', 'Ăn uống', 'Mua sắm', 'Di chuyển', 'Khác'],
        datasets: [{
            data: [8, 3.5, 2.5, 1.5, 1.0],
            backgroundColor: [
                '#f06735',
                '#ffd54f',
                '#9c27b0',
                '#ff8a65',
                '#90a4ae'
            ],
            borderWidth: 0,
            hoverOffset: 8
        }]
    };

    const monthlyFlowCtx = document.getElementById('monthlyFlowChart')?.getContext('2d');
    if (monthlyFlowCtx) {
        new Chart(monthlyFlowCtx, {
            type: 'bar',
            data: monthlyData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Poppins', size: 12 },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        titleFont: { family: 'Poppins', size: 14 },
                        bodyFont: { family: 'Poppins', size: 13 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Math.abs(context.parsed.y * 1000000));
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: { font: { family: 'Poppins' } }
                    },
                    y: {
                        stacked: true,
                        grid: { color: '#f0f0f0' },
                        title: {
                            display: true,
                            text: 'Triệu VNĐ',
                            font: { family: 'Poppins', size: 12 }
                        },
                        ticks: {
                            font: { family: 'Poppins' },
                            callback: function (value) {
                                return value + ' Tr';
                            }
                        }
                    }
                }
            }
        });
    }

    const expenseDoughnutCtx = document.getElementById('expenseDoughnutChart')?.getContext('2d');
    if (expenseDoughnutCtx) {
        new Chart(expenseDoughnutCtx, {
            type: 'doughnut',
            data: expenseDoughnutData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Poppins', size: 11 },
                            padding: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        titleFont: { family: 'Poppins', size: 14 },
                        bodyFont: { family: 'Poppins', size: 13 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(context.parsed * 1000000);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}