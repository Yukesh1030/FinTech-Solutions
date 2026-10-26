/**
 * STACKLY FinTech - Client Dashboard Logic (client-dashboard.js)
 * 5 Menus, Subpage Hash Routing, Real-Time Filters, Invoicing Tools, Reports, Settings
 */

document.addEventListener('DOMContentLoaded', () => {
  initClientDashboard();
});

function initClientDashboard() {
  initClientSidebar();
  initClientMenuSwitching();
  initClientHashRouting();
  initClientCashFlowChart();
  initInvoiceActions();
  initStatementDownload();
  initClientRefresh();
  initClientUserSession();
  initTransactionFeatures();
  initInvoicesFeatures();
  initReportsFeatures();
  initSettingsFeatures();
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

/**
 * Core View Switching Function with URL Hash Support
 */
const viewTitleMap = {
  dashboard: 'Client Portal',
  transactions: 'Transactions Ledger',
  invoices: 'Invoices & Payments',
  reports: 'Reports & Insights',
  settings: 'Profile & Settings'
};

function switchClientView(targetMenu, updateHash = true) {
  const validMenus = ['dashboard', 'transactions', 'invoices', 'reports', 'settings'];
  const menuKey = validMenus.includes(targetMenu) ? targetMenu : 'dashboard';

  const menuItems = document.querySelectorAll('.dashboard-sidebar .sidebar-menu-item');
  const viewSections = document.querySelectorAll('.dashboard-view-section');
  const pageTitle = document.querySelector('.dashboard-title-heading');

  // Update active state in sidebar
  menuItems.forEach(item => {
    if (item.getAttribute('data-menu') === menuKey) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update page heading
  if (pageTitle && viewTitleMap[menuKey]) {
    pageTitle.textContent = viewTitleMap[menuKey];
  }

  // Switch displayed section
  viewSections.forEach(sec => (sec.style.display = 'none'));
  const targetSec = document.getElementById('view-' + menuKey);
  if (targetSec) {
    targetSec.style.display = 'block';
  } else {
    const defaultSec = document.getElementById('view-dashboard');
    if (defaultSec) defaultSec.style.display = 'block';
  }

  // Update URL Hash if requested
  if (updateHash) {
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '#' + menuKey);
    } else {
      window.location.hash = '#' + menuKey;
    }
  }

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.dashboard-sidebar');
  const overlay = document.querySelector('.dashboard-sidebar-overlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');

  // Smooth scroll main view to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initClientMenuSwitching() {
  const menuItems = document.querySelectorAll('.dashboard-sidebar .sidebar-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetMenu = item.getAttribute('data-menu');
      if (!targetMenu) return;
      e.preventDefault();
      switchClientView(targetMenu, true);
    });
  });

  const brandLogo = document.querySelector('.sidebar-brand');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchClientView('dashboard', true);
    });
  }
}

/**
 * Hash Navigation for direct links (e.g. #transactions, #invoices, #reports, #settings)
 */
function initClientHashRouting() {
  const handleHashChange = () => {
    const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (rawHash && ['dashboard', 'transactions', 'invoices', 'reports', 'settings'].includes(rawHash)) {
      switchClientView(rawHash, false);
    }
  };

  // Run on initial page load
  handleHashChange();

  // Listen for hash changes (back/forward navigation or link clicks)
  window.addEventListener('hashchange', handleHashChange);
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

        // Update pending invoices count in dashboard
        const pendingCountEl = document.getElementById('kpiPendingInvoices');
        if (pendingCountEl) {
          const c = Math.max(0, parseInt(pendingCountEl.textContent, 10) - 1);
          pendingCountEl.textContent = c;
        }

        if (typeof showToast === 'function') {
          showToast('Payment simulation successful! Invoice status updated to Settled.');
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
      const csvData = `Transaction Date,Reference,Description,Type,Amount (INR),Payment Rail,Status
2026-10-24,TXN-9081,AWS Cloud Infrastructure Hosting,Debit,4500.00,Card Gateway,Settled
2026-10-22,TXN-9080,Nexus Enterprise Solutions Retainer,Credit,38000.00,Virtual IBAN,Settled
2026-10-20,TXN-9079,SaaS CRM Enterprise Annual License,Debit,12000.00,RTGS / NEFT,Settled
2026-10-19,TXN-9078,FinTech Advisory Consulting Inflow,Credit,25000.00,UPI Instant,Settled
2026-10-16,TXN-9077,CyberGuard Penetration Testing Retainer,Debit,4700.00,RTGS / NEFT,Settled
2026-10-14,TXN-9076,Vendor Hardware Device Refund,Credit,1200.00,Card Gateway,Settled
2026-10-11,TXN-9075,Zenith Capital Platform Subscription,Credit,48300.00,UPI Instant,Settled
2026-10-09,TXN-9074,Offshore Contractor Disbursal,Debit,14500.00,Virtual IBAN,Pending`;

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

/**
 * ============================================================================
 * SUBPAGE 1: TRANSACTIONS INTERACTIVE FEATURES
 * ============================================================================
 */
function initTransactionFeatures() {
  const searchInput = document.getElementById('txnSearchInput');
  const typeFilter = document.getElementById('txnTypeFilter');
  const statusFilter = document.getElementById('txnStatusFilter');
  const railFilter = document.getElementById('txnRailFilter');
  const resetBtn = document.getElementById('btnResetTxnFilters');
  const emptyResetBtn = document.getElementById('btnEmptyReset');
  const emptyState = document.getElementById('txnEmptyState');
  const tableBody = document.getElementById('clientTxnTableBody');

  if (!tableBody) return;
  const rows = tableBody.querySelectorAll('tr');

  const applyTxnFilters = () => {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const typeVal = typeFilter ? typeFilter.value : 'all';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const railVal = railFilter ? railFilter.value : 'all';

    let visibleCount = 0;

    rows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      const rowType = row.getAttribute('data-type') || '';
      const rowStatus = row.getAttribute('data-status') || '';
      const rowRail = row.getAttribute('data-rail') || '';

      const matchesSearch = !q || rowText.includes(q);
      const matchesType = typeVal === 'all' || rowType === typeVal;
      const matchesStatus = statusVal === 'all' || rowStatus === statusVal;
      const matchesRail = railVal === 'all' || rowRail === railVal;

      if (matchesSearch && matchesType && matchesStatus && matchesRail) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  if (searchInput) searchInput.addEventListener('input', applyTxnFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyTxnFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyTxnFilters);
  if (railFilter) railFilter.addEventListener('change', applyTxnFilters);

  const resetAllFilters = () => {
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (railFilter) railFilter.value = 'all';
    applyTxnFilters();
    if (typeof showToast === 'function') {
      showToast('Transaction filters reset.');
    }
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Reconciliation sweep buttons
  const sweepBtns = [document.getElementById('btnReconcileSweep'), document.getElementById('btnManualReconcile')];
  sweepBtns.forEach(b => {
    if (b) {
      b.addEventListener('click', () => {
        const icon = b.querySelector('i');
        if (icon) icon.classList.add('spinning');
        b.disabled = true;

        setTimeout(() => {
          if (icon) icon.classList.remove('spinning');
          b.disabled = false;
          if (typeof showToast === 'function') {
            showToast('Reconciliation sweep complete: All 42 ledger entries synchronized across banking nodes.');
          }
        }, 650);
      });
    }
  });
}

/**
 * ============================================================================
 * SUBPAGE 2: INVOICES & PAYMENTS INTERACTIVE FEATURES
 * ============================================================================
 */
function initInvoicesFeatures() {
  const scrollBtn = document.getElementById('btnScrollToLinkCreator');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = document.getElementById('paymentLinkGeneratorSection');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = document.getElementById('linkCustomerName');
        if (firstInput) firstInput.focus();
      }
    });
  }

  // Payment Link Generator Form
  const genBtn = document.getElementById('btnGeneratePaymentLink');
  const genBox = document.getElementById('generatedLinkContainer');
  const linkUrlEl = document.getElementById('generatedLinkUrl');
  const copyBtn = document.getElementById('btnCopyGenLink');
  const shareBtn = document.getElementById('btnShareGenLink');

  if (genBtn && genBox && linkUrlEl) {
    genBtn.addEventListener('click', () => {
      const custName = (document.getElementById('linkCustomerName')?.value || '').trim();
      const memo = (document.getElementById('linkMemo')?.value || '').trim();
      const amount = (document.getElementById('linkAmount')?.value || '').trim();

      if (!custName || !memo || !amount) {
        if (typeof showToast === 'function') {
          showToast('Please fill in Customer Name, Billing Memo, and Amount.');
        }
        return;
      }

      genBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
      genBtn.disabled = true;

      setTimeout(() => {
        genBtn.innerHTML = '<i class="fas fa-bolt"></i> Generate Branded Link';
        genBtn.disabled = false;

        const randId = Math.floor(100000 + Math.random() * 900000);
        const generatedLink = `https://pay.stackly.finance/inv_${randId}?amt=${encodeURIComponent(amount)}`;
        linkUrlEl.textContent = generatedLink;
        genBox.style.display = 'block';

        if (typeof showToast === 'function') {
          showToast(`Branded collection link generated for ${custName}!`);
        }
      }, 500);
    });
  }

  if (copyBtn && linkUrlEl) {
    copyBtn.addEventListener('click', () => {
      const text = linkUrlEl.textContent;
      navigator.clipboard?.writeText(text).then(() => {
        if (typeof showToast === 'function') {
          showToast('Payment link copied to clipboard!');
        }
      }).catch(() => {
        if (typeof showToast === 'function') {
          showToast('Link copied: ' + text);
        }
      });
    });
  }

  if (shareBtn && linkUrlEl) {
    shareBtn.addEventListener('click', () => {
      const text = linkUrlEl.textContent;
      if (navigator.share) {
        navigator.share({
          title: 'STACKLY FinTech Invoice Payment Link',
          text: 'Here is your secure corporate payment collection link:',
          url: text
        }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(text);
        if (typeof showToast === 'function') {
          showToast('Shareable link copied to clipboard!');
        }
      }
    });
  }
}

/**
 * ============================================================================
 * SUBPAGE 3: REPORTS & INSIGHTS INTERACTIVE FEATURES
 * ============================================================================
 */
function initReportsFeatures() {
  const sendReportBtn = document.getElementById('btnSendTestReport');
  if (sendReportBtn) {
    sendReportBtn.addEventListener('click', () => {
      sendReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching...';
      sendReportBtn.disabled = true;

      setTimeout(() => {
        sendReportBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test Report Now';
        sendReportBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('Test audit packet dispatched to finance@apextech.com.');
        }
      }, 700);
    });
  }

  const periodSelect = document.getElementById('reportPeriodSelect');
  if (periodSelect) {
    periodSelect.addEventListener('change', () => {
      const label = periodSelect.options[periodSelect.selectedIndex].text;
      if (typeof showToast === 'function') {
        showToast(`Dossier period updated to: ${label}`);
      }
    });
  }
}

/**
 * ============================================================================
 * SUBPAGE 4: PROFILE & SETTINGS INTERACTIVE FEATURES
 * ============================================================================
 */
function initSettingsFeatures() {
  // API Key show/hide toggle
  const toggleKeyBtn = document.getElementById('btnToggleApiKey');
  const apiKeyInput = document.getElementById('clientApiKey');
  if (toggleKeyBtn && apiKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      const isPassword = apiKeyInput.type === 'password';
      apiKeyInput.type = isPassword ? 'text' : 'password';
      const icon = toggleKeyBtn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
      }
    });
  }

  // API Key copy
  const copyKeyBtn = document.getElementById('btnCopyApiKey');
  if (copyKeyBtn && apiKeyInput) {
    copyKeyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(apiKeyInput.value).then(() => {
        if (typeof showToast === 'function') {
          showToast('API Secret Key copied to clipboard!');
        }
      });
    });
  }

  // Webhook Test Ping
  const pingBtn = document.getElementById('btnPingWebhook');
  const webhookInput = document.getElementById('clientWebhookUrl');
  if (pingBtn && webhookInput) {
    pingBtn.addEventListener('click', () => {
      pingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pinging...';
      pingBtn.disabled = true;

      setTimeout(() => {
        pingBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Test Ping';
        pingBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('Webhook 200 OK received from endpoint (Latency: 118ms)');
        }
      }, 650);
    });
  }

  // Save Corporate Information
  const saveCorpBtn = document.getElementById('btnSaveCorporateInfo');
  if (saveCorpBtn) {
    saveCorpBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Corporate entity profile & billing records saved.');
      }
    });
  }

  // Save Notification Preferences
  const saveNotifBtn = document.getElementById('btnSaveNotificationPreferences');
  if (saveNotifBtn) {
    saveNotifBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Notification rules and alert channels updated.');
      }
    });
  }

  // Save All Settings
  const saveAllBtn = document.getElementById('btnSaveAllSettings');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('All corporate preferences and security settings saved.');
      }
    });
  }

  // Add Bank Account trigger
  const linkAccBtn = document.getElementById('btnLinkAccount');
  if (linkAccBtn) {
    linkAccBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Initiating commercial banking integration wizard (Sandbox demonstration).');
      }
    });
  }
}
