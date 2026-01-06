// ===== Million Marketer Dashboard JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initSalesChart();
    initChartTabs();
    initResponsiveSidebar();
    // initNavigation(); // Removed to fix link navigation
    initAnimations();
});

// ===== Sales Chart =====
function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Data
    const labels = ['مايو', 'مايو', 'مايو', 'مايو', 'مايو', 'مايو', 'مايو', 'مايو', 'مايو', 'مايو'];
    const salesData = [55, 35, 32, 58, 38, 22, 50, 15, 35, 68];
    // Slightly tweaked data to match the wave shape in the image better

    // Create Line Gradient (Blue -> Olive)
    const gradientStroke = ctx.getContext('2d').createLinearGradient(0, 0, ctx.width, 0); // Horizontal gradient
    gradientStroke.addColorStop(0, '#5DADE2'); // Light Blue
    gradientStroke.addColorStop(1, '#a7b055'); // Olive

    // Create Fill Gradient (Vertical)
    const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(167, 176, 85, 0.1)'); // Olive tint
    gradientFill.addColorStop(0.5, 'rgba(93, 173, 226, 0.05)'); // Blue tint mixing
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Custom External Tooltip Handler
    const getOrCreateTooltip = (chart) => {
        let tooltipEl = document.getElementById('chartjs-tooltip');
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.opacity = 0;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all .1s ease';
            tooltipEl.style.zIndex = 100;
            chart.canvas.parentNode.appendChild(tooltipEl);
        }
        return tooltipEl;
    };

    const externalTooltipHandler = (context) => {
        // Tooltip Element
        const { chart, tooltip } = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map(b => b.lines);

            const value = bodyLines[0]; // e.g., "2,678"

            // Custom HTML for tooltip matching image (Dark box, centered white text)
            // Arrows handled via CSS on .custom-chart-tooltip class
            const innerHtml = `
                <div class="custom-chart-tooltip text-center">
                    <div class="tooltip-label mb-1 text-white-50" style="font-size: 11px;">مبيعات</div>
                    <div class="tooltip-value fw-bold text-white fs-5" style="font-family: sans-serif;">${value}</div>
                </div>
            `;

            tooltipEl.innerHTML = innerHtml;
        }

        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY - 10 + 'px'; // Shift up slightly
        tooltipEl.style.transform = 'translate(-50%, -100%)'; // Center horizontally, move above point
        tooltipEl.style.fontFamily = 'Tajawal';
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'المبيعات',
                data: salesData,
                borderColor: gradientStroke, // Use horizontal gradient for line
                backgroundColor: gradientFill,
                borderWidth: 4,
                fill: true,
                tension: 0.45, // Smooth curves
                pointRadius: 6,
                pointBackgroundColor: '#ffffff', // White inner
                pointBorderColor: (context) => {
                    // Dynamic border color based on index or just use the gradient color at that point approx?
                    // Simpler: use the chart stroke color or a fixed blend.
                    // Image shows purple rings? Let's stick to matching line colors or a nice contrasting ring.
                    // Actually image shows White Center, Purple/Color Ring. 
                    // Let's use a nice dynamic color or localized.
                    // For now, let's match the Olive theme or the Blue-Olive blend.
                    // Simplification: Use a solid color for consistency or gradient if possible (not easy on points).
                    return '#a991d6'; // Light purple as seen in reference image dots
                },
                pointBorderWidth: 4,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#a991d6',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
                
                // Show points only on hover or specific indices?
                // Image shows specific points. Chart.js shows all by default.
                // We'll show all but style them nicely.
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false, // Disable default canvas tooltip
                    external: externalTooltipHandler // Use custom HTML tooltip
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#9ca3af',
                        font: { family: 'Tajawal', size: 12 },
                        padding: 10
                    },
                    border: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.03)',
                        drawBorder: false,
                    },
                    border: { display: false, dash: [5, 5] }, // Dashed grid lines if needed
                    ticks: {
                        color: '#9ca3af',
                        font: { family: 'Tajawal', size: 12 },
                        stepSize: 20,
                        padding: 15
                    },
                    position: 'right' // RTL Y-axis? Usually left is standard for charts but RTL might prefer right. 
                                      // Image has Y axis on Left. Keep default (Left).
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            elements: {
                point: {
                    radius: 5, // Default radius
                    hoverRadius: 8
                }
            }
        }
    });
}

function addStaticTooltip(container) {
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    container.appendChild(tooltip);
}


// ===== Chart Tabs =====
function initChartTabs() {
    const tabs = document.querySelectorAll('.chart-tabs .btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== Responsive Sidebar =====
function initResponsiveSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !toggle || !overlay) {
        return;
    }

    // Open sidebar
    function openSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        document.body.classList.add('sidebar-open');
        toggle.innerHTML = '<i class="bi bi-x-lg"></i>';
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.classList.remove('sidebar-open');
        toggle.innerHTML = '<i class="bi bi-list"></i>';
    }

    // Toggle button click
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (sidebar.classList.contains('show')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
        closeSidebar();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    });

    // Close sidebar on nav link click (mobile only)
    // Exception: Don't close for dropdown toggle links (like Settings)
    sidebar.querySelectorAll('.nav-link, .footer-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // If this is a dropdown toggle (has data-bs-toggle="collapse"), don't close sidebar
            if (this.getAttribute('data-bs-toggle') === 'collapse') {
                return; // Let Bootstrap handle the dropdown, don't close sidebar
            }
            
            if (window.innerWidth < 992) {
                setTimeout(closeSidebar, 150);
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth >= 992) {
                closeSidebar();
            }
        }, 100);
    });
}

// ===== Navigation Active State =====
// function initNavigation() {
    // Removed to allow default link behavior for multi-page navigation
// }

// ===== Animations =====
function initAnimations() {
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (i + 1));
    });

    // Animate cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        if (!card.classList.contains('stat-card')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (80 * i));
        }
    });
}
