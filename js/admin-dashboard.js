/**
 * STACKLY FinTech - Admin Dashboard Logic (admin-dashboard.js)
 * 5 Menus, 3 KPI cards, Dynamic transaction filters, Volume chart, Refresh controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  initSidebarToggle();
  initSidebarMenuSwitching();
  initAdminChart();
  initTransactionFiltering();
  initRefreshControls();
  initUserSession();
}

function initUserSession() {
  const email = sessionStorage.getItem('stackly_user_email');
  if (email) {
    const userDisplay = document.getElementById('adminUserEmail');
    if (userDisplay) userDisplay.textContent = email;
  }
}

function initSidebarToggle() {
  const toggleBtn = document.querySelector('.dashboard-topbar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const overlay = document.querySelector('.dashboard-sidebar-overlay');
  const closeBtn = document.querySelector('.sidebar-close-btn');

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }
}

// 5 Main Menus switching
function initSidebarMenuSwitching() {
  const menuItems = document.querySelectorAll('.dashboard-sidebar .sidebar-menu-item');
  const viewSections = document.querySelectorAll('.dashboard-view-section');
  const pageTitle = document.querySelector('.dashboard-title-heading');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const link = item.querySelector('a');
      const targetMenu = item.getAttribute('data-menu');
      if (!targetMenu) return;

      e.preventDefault();
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (pageTitle && link) {
        const textNode = link.textContent.trim();
        pageTitle.textContent = textNode;
      }

      // Hide all view sections, show target
      viewSections.forEach(sec => sec.style.display = 'none');
      const targetSec = document.getElementById('view-' + targetMenu);
      if (targetSec) {
        targetSec.style.display = 'block';
      } else {
        // Fallback default view
        const defaultSec = document.getElementById('view-dashboard');
        if (defaultSec) defaultSec.style.display = 'block';
      }

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dashboard-sidebar');
      const overlay = document.querySelector('.dashboard-sidebar-overlay');
      if (sidebar) sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  });
}

// Transaction Volume Chart
let adminVolumeChart = null;
function initAdminChart() {
  const ctx = document.getElementById('adminChartCanvas');
  if (!ctx || typeof Chart === 'undefined') return;

  adminVolumeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
      datasets: [
        {
          label: 'Processed Volume (₹)',
          data: [120000, 240000, 310000, 480000, 390000, 520000, 410000],
          backgroundColor: '#101D32',
          borderRadius: 6,
          hoverBackgroundColor: '#182b4a'
        },
        {
          label: 'Instant Settlements (₹)',
          data: [90000, 180000, 260000, 410000, 320000, 460000, 380000],
          backgroundColor: '#42D6B0',
          borderRadius: 6,
          hoverBackgroundColor: '#34c49f'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Poppins', size: 12 }, color: '#101D32' }
        },
        tooltip: {
          backgroundColor: '#101D32',
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(16, 29, 50, 0.06)' },
          ticks: {
            font: { family: 'Poppins', size: 11 },
            callback: (v) => '₹' + (v / 100000) + 'L'
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Poppins', size: 11 } }
        }
      }
    }
  });
}

// Filter and Search Transactions Table
function initTransactionFiltering() {
  const searchInput = document.getElementById('adminTxnSearch');
  const statusSelect = document.getElementById('adminTxnStatusFilter');
  const tableBody = document.getElementById('adminTxnTableBody');

  if (!tableBody) return;

  function applyFilters() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const status = statusSelect ? statusSelect.value.toLowerCase() : 'all';
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowStatus = row.getAttribute('data-status') || '';
      const matchesSearch = text.includes(q);
      const matchesStatus = (status === 'all' || rowStatus === status);

      if (matchesSearch && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusSelect) statusSelect.addEventListener('change', applyFilters);
}

// Refresh Button for Demo Data
function initRefreshControls() {
  const refreshBtns = document.querySelectorAll('.btn-refresh-admin');
  refreshBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon) icon.classList.add('spinning');
      btn.disabled = true;

      setTimeout(() => {
        if (icon) icon.classList.remove('spinning');
        btn.disabled = false;

        // 1. Update KPI numbers dynamically
        const totalTxnsEl = document.getElementById('kpiTotalTxns');
        const pendingPayEl = document.getElementById('kpiPendingPay');
        const processedVolEl = document.getElementById('kpiProcessedVol');

        if (totalTxnsEl) {
          const current = parseInt(totalTxnsEl.textContent.replace(/,/g, ''), 10) || 2486;
          totalTxnsEl.textContent = (current + Math.floor(Math.random() * 5 + 1)).toLocaleString();
        }

        if (pendingPayEl) {
          const current = parseInt(pendingPayEl.textContent, 10) || 34;
          pendingPayEl.textContent = Math.max(12, current + (Math.random() > 0.5 ? 1 : -1));
        }

        if (processedVolEl) {
          const randomLakhs = (12.8 + Math.random() * 0.4).toFixed(1);
          processedVolEl.textContent = `₹${randomLakhs}L`;
        }

        // 2. Prepend a new simulated transaction
        const tableBody = document.getElementById('adminTxnTableBody');
        if (tableBody) {
          const newRefNum = Math.floor(2042 + Math.random() * 100);
          const newAmount = [3200, 7500, 14200, 8900, 5600][Math.floor(Math.random() * 5)];
          const newRow = document.createElement('tr');
          newRow.setAttribute('data-status', 'completed');
          newRow.innerHTML = `
            <td><strong>TXN-${newRefNum}</strong></td>
            <td>Payment</td>
            <td><strong>₹${newAmount.toLocaleString()}</strong></td>
            <td><span class="status-badge completed"><i class="fas fa-check-circle"></i> Completed</span></td>
            <td>Just now</td>
            <td><button class="btn btn-sm btn-outline" onclick="viewTxnDetail('TXN-${newRefNum}', 'Payment', '${newAmount}', 'Completed')">View</button></td>
          `;
          tableBody.insertBefore(newRow, tableBody.firstChild);
        }

        // 3. Update Chart random bar
        if (adminVolumeChart) {
          adminVolumeChart.data.datasets[0].data[6] = Math.floor(400000 + Math.random() * 150000);
          adminVolumeChart.update();
        }

        // Toast feedback
        if (typeof showToast === 'function') {
          showToast('Admin demonstration metrics refreshed live!');
        }
      }, 700);
    });
  });
}

// Modal view helper for transaction details
window.viewTxnDetail = function(ref, type, amount, status) {
  const modal = document.getElementById('txnDetailModal');
  if (!modal) return;
  document.getElementById('modalTxnRef').textContent = ref;
  document.getElementById('modalTxnType').textContent = type;
  document.getElementById('modalTxnAmount').textContent = '₹' + parseFloat(amount).toLocaleString();
  document.getElementById('modalTxnStatus').textContent = status;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
