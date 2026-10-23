/**
 * STACKLY FinTech - Client Dashboard Logic (client-dashboard.js)
 * 5 Menus, 3 KPI cards, Statement download, Pay Invoice simulator, Cash-Flow Chart
 */

document.addEventListener('DOMContentLoaded', () => {
  initClientDashboard();
});

function initClientDashboard() {
  initClientSidebar();
  initClientMenuSwitching();
  initClientCashFlowChart();
  initInvoiceActions();
  initStatementDownload();
  initClientRefresh();
  initClientUserSession();
}

function initClientUserSession() {
  const email = sessionStorage.getItem('stackly_user_email');
  if (email) {
    const userDisplay = document.getElementById('clientUserEmail');
    if (userDisplay) userDisplay.textContent = email;
  }
}

function initClientSidebar() {
  const toggleBtn = document.querySelector('.dashboard-topbar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const overlay = document.querySelector('.dashboard-sidebar-overlay');

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
}

function initClientMenuSwitching() {
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
        pageTitle.textContent = link.textContent.trim();
      }

      viewSections.forEach(sec => sec.style.display = 'none');
      const targetSec = document.getElementById('view-' + targetMenu);
      if (targetSec) {
        targetSec.style.display = 'block';
      } else {
        const defaultSec = document.getElementById('view-dashboard');
        if (defaultSec) defaultSec.style.display = 'block';
      }

      const sidebar = document.querySelector('.dashboard-sidebar');
      const overlay = document.querySelector('.dashboard-sidebar-overlay');
      if (sidebar) sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  });
}

// Client Monthly Cash-flow Chart
let clientCashFlowChart = null;
function initClientCashFlowChart() {
  const ctx = document.getElementById('clientCashFlowCanvas');
  if (!ctx || typeof Chart === 'undefined') return;

  clientCashFlowChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Total Deposits / Received (₹)',
          data: [54000, 68000, 72000, 61000, 89000, 84500],
          borderColor: '#42D6B0',
          backgroundColor: 'rgba(66, 214, 176, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#101D32',
          pointBorderColor: '#42D6B0',
          pointBorderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Invoices Paid / Outflow (₹)',
          data: [21000, 29000, 24000, 32000, 28000, 26400],
          borderColor: '#101D32',
          backgroundColor: 'rgba(16, 29, 50, 0.05)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 4
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
            callback: (v) => '₹' + (v / 1000) + 'k'
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

// Invoices Actions (Pay Now Simulation & View Invoice)
function initInvoiceActions() {
  window.payInvoice = function(invId, amount) {
    const payModal = document.getElementById('payInvoiceModal');
    if (!payModal) return;
    document.getElementById('payModalInvId').textContent = invId;
    document.getElementById('payModalAmount').textContent = '₹' + parseFloat(amount).toLocaleString();
    payModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const confirmPayBtn = document.getElementById('btnConfirmPayment');
  if (confirmPayBtn) {
    confirmPayBtn.addEventListener('click', () => {
      confirmPayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Simulation...';
      confirmPayBtn.disabled = true;

      setTimeout(() => {
        confirmPayBtn.innerHTML = 'Confirm Payment';
        confirmPayBtn.disabled = false;
        const payModal = document.getElementById('payInvoiceModal');
        if (payModal) payModal.classList.remove('open');
        document.body.style.overflow = '';

        // Update pending invoices count
        const pendingCountEl = document.getElementById('kpiPendingInvoices');
        if (pendingCountEl) {
          const c = Math.max(0, parseInt(pendingCountEl.textContent, 10) - 1);
          pendingCountEl.textContent = c;
        }

        if (typeof showToast === 'function') {
          showToast('Payment simulation successful! Invoice updated to settled.');
        }
      }, 700);
    });
  }

  window.viewClientInvoice = function(invId, desc, amount, due) {
    const viewModal = document.getElementById('clientInvoiceModal');
    if (!viewModal) return;
    document.getElementById('clientModalInvId').textContent = invId;
    document.getElementById('clientModalDesc').textContent = desc;
    document.getElementById('clientModalAmount').textContent = '₹' + parseFloat(amount).toLocaleString();
    document.getElementById('clientModalDue').textContent = due;
    viewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
}

// Download Sample Statement (CSV)
function initStatementDownload() {
  const downloadBtns = document.querySelectorAll('.btn-download-statement');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const csvData = `Transaction Date,Reference,Description,Type,Amount (INR),Status
2026-10-22,TXN-9081,Cloud Infrastructure Payment,Debit,4500.00,Completed
2026-10-20,TXN-9080,Client Retainer Inflow,Credit,38000.00,Completed
2026-10-18,TXN-9079,SaaS Subscription Annual,Debit,12000.00,Completed
2026-10-15,TXN-9078,Consulting Fee Settlement,Credit,25000.00,Completed
2026-10-12,TXN-9077,Vendor Hardware Refund,Credit,1200.00,Completed
2026-10-10,TXN-9076,Office Utility Routing,Debit,3400.00,Completed`;

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'STACKLY_Client_Statement_Oct2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (typeof showToast === 'function') {
        showToast('Sample financial statement (CSV) downloaded successfully!');
      }
    });
  });
}

function initClientRefresh() {
  const refreshBtns = document.querySelectorAll('.btn-refresh-client');
  refreshBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon) icon.classList.add('spinning');
      btn.disabled = true;

      setTimeout(() => {
        if (icon) icon.classList.remove('spinning');
        btn.disabled = false;

        // Small live update
        const overviewEl = document.getElementById('kpiAccountOverview');
        if (overviewEl) {
          const base = 84500 + Math.floor(Math.random() * 2000 - 1000);
          overviewEl.textContent = `₹${base.toLocaleString()}`;
        }

        if (typeof showToast === 'function') {
          showToast('Client account overview refreshed live!');
        }
      }, 600);
    });
  });
}
