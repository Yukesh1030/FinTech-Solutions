/**
 * STACKLY FinTech - Admin Dashboard Logic (admin-dashboard.js)
 * 5 Menus, Subpage Hash Routing, Real-Time Filters, Merchant Registry, Analytics, Settings
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  initSidebarToggle();
  initSidebarMenuSwitching();
  initAdminHashRouting();
  initAdminChart();
  initTransactionFiltering();
  initRefreshControls();
  initUserSession();
  initAccountsFeatures();
  initAdminLedgerFeatures();
  initAdminReportsFeatures();
  initAdminSettingsFeatures();
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

/**
 * Core View Switching with URL Hash Synchronization
 */
const adminViewTitleMap = {
  dashboard: 'Admin Overview',
  accounts: 'Accounts & Customers',
  transactions: 'Transactions Ledger',
  reports: 'Reports & Analytics',
  settings: 'Settings'
};

function switchAdminView(targetMenu, updateHash = true) {
  const validMenus = ['dashboard', 'accounts', 'transactions', 'reports', 'settings'];
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
  if (pageTitle && adminViewTitleMap[menuKey]) {
    pageTitle.textContent = adminViewTitleMap[menuKey];
  }

  // Hide all sections and show target
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

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initSidebarMenuSwitching() {
  const menuItems = document.querySelectorAll('.dashboard-sidebar .sidebar-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetMenu = item.getAttribute('data-menu');
      if (!targetMenu) return;
      e.preventDefault();
      switchAdminView(targetMenu, true);
    });
  });

  const brandLogo = document.querySelector('.sidebar-brand');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchAdminView('dashboard', true);
    });
  }
}

/**
 * Hash Navigation for direct links (e.g. #accounts, #transactions, #reports, #settings)
 */
function initAdminHashRouting() {
  const handleHashChange = () => {
    const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (rawHash && ['dashboard', 'accounts', 'transactions', 'reports', 'settings'].includes(rawHash)) {
      switchAdminView(rawHash, false);
    }
  };

  // Run on initial load
  handleHashChange();

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
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

// Dashboard View Recent Transactions Filter
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

        // 2. Prepend a new simulated transaction to recent table
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

/**
 * ============================================================================
 * SUBPAGE 1: ACCOUNTS & CUSTOMERS FEATURES
 * ============================================================================
 */
function initAccountsFeatures() {
  const searchInput = document.getElementById('merchantSearchInput');
  const kycFilter = document.getElementById('merchantKycFilter');
  const statusFilter = document.getElementById('merchantStatusFilter');
  const riskFilter = document.getElementById('merchantRiskFilter');
  const resetBtn = document.getElementById('btnResetMerchantFilters');
  const emptyResetBtn = document.getElementById('btnEmptyResetMerchants');
  const emptyState = document.getElementById('merchantEmptyState');
  const tableBody = document.getElementById('adminMerchantTableBody');

  if (!tableBody) return;
  const rows = tableBody.querySelectorAll('tr');

  const applyMerchantFilters = () => {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const kycVal = kycFilter ? kycFilter.value : 'all';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const riskVal = riskFilter ? riskFilter.value : 'all';

    let visibleCount = 0;

    rows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      const rowKyc = row.getAttribute('data-kyc') || '';
      const rowStatus = row.getAttribute('data-status') || '';
      const rowRisk = row.getAttribute('data-risk') || '';

      const matchesSearch = !q || rowText.includes(q);
      const matchesKyc = kycVal === 'all' || rowKyc === kycVal;
      const matchesStatus = statusVal === 'all' || rowStatus === statusVal;
      const matchesRisk = riskVal === 'all' || rowRisk === riskVal;

      if (matchesSearch && matchesKyc && matchesStatus && matchesRisk) {
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

  if (searchInput) searchInput.addEventListener('input', applyMerchantFilters);
  if (kycFilter) kycFilter.addEventListener('change', applyMerchantFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyMerchantFilters);
  if (riskFilter) riskFilter.addEventListener('change', applyMerchantFilters);

  const resetAllMerchantFilters = () => {
    if (searchInput) searchInput.value = '';
    if (kycFilter) kycFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (riskFilter) riskFilter.value = 'all';
    applyMerchantFilters();
    if (typeof showToast === 'function') {
      showToast('Merchant roster filters reset.');
    }
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAllMerchantFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllMerchantFilters);

  // Merchant inspection modal helper
  window.inspectMerchant = function(id, name, kyc, iban, floatVal, status) {
    const modal = document.getElementById('merchantInspectModal');
    if (!modal) return;
    document.getElementById('merchantModalId').textContent = id;
    document.getElementById('merchantModalName').textContent = name;
    document.getElementById('merchantModalKyc').textContent = kyc;
    document.getElementById('merchantModalIban').textContent = iban;
    document.getElementById('merchantModalFloat').textContent = floatVal;
    const statusEl = document.getElementById('merchantModalStatus');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = status === 'Active' ? 'status-badge completed' : 'status-badge pending';
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const toggleStatusBtn = document.getElementById('btnToggleMerchantStatus');
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener('click', () => {
      const statusEl = document.getElementById('merchantModalStatus');
      if (statusEl) {
        const isCurrentActive = statusEl.textContent === 'Active';
        statusEl.textContent = isCurrentActive ? 'Restricted' : 'Active';
        statusEl.className = isCurrentActive ? 'status-badge pending' : 'status-badge completed';
        if (typeof showToast === 'function') {
          showToast(`Merchant account status toggled to: ${statusEl.textContent}`);
        }
      }
    });
  }

  // Onboard Merchant trigger
  const onboardBtn = document.getElementById('btnAdminOnboardMerchant');
  if (onboardBtn) {
    onboardBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Initiating Enterprise Merchant Onboarding Wizard (Sandbox Mode)...');
      }
    });
  }

  // Run KYC Batch trigger
  const kycBatchBtn = document.getElementById('btnRunKycBatch');
  if (kycBatchBtn) {
    kycBatchBtn.addEventListener('click', () => {
      const icon = kycBatchBtn.querySelector('i');
      if (icon) icon.classList.add('spinning');
      kycBatchBtn.disabled = true;

      setTimeout(() => {
        if (icon) icon.classList.remove('spinning');
        kycBatchBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('KYC automated OCR queue processed: 5 approved, 2 held for verification.');
        }
      }, 700);
    });
  }
}

/**
 * ============================================================================
 * SUBPAGE 2: PLATFORM TRANSACTIONS CLEARING FEATURES
 * ============================================================================
 */
function initAdminLedgerFeatures() {
  const searchInput = document.getElementById('adminFullTxnSearch');
  const railFilter = document.getElementById('adminRailFilter');
  const statusFilter = document.getElementById('adminStatusFilter');
  const volumeFilter = document.getElementById('adminVolumeFilter');
  const resetBtn = document.getElementById('btnResetAdminTxnFilters');
  const emptyResetBtn = document.getElementById('btnEmptyResetAdminTxns');
  const emptyState = document.getElementById('adminTxnEmptyState');
  const tableBody = document.getElementById('adminMasterTxnBody');

  if (!tableBody) return;
  const rows = tableBody.querySelectorAll('tr');

  const applyMasterTxnFilters = () => {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const railVal = railFilter ? railFilter.value : 'all';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const volumeVal = volumeFilter ? volumeFilter.value : 'all';

    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rail = row.getAttribute('data-rail') || '';
      const status = row.getAttribute('data-status') || '';
      const vol = row.getAttribute('data-volume') || '';

      const matchesSearch = !q || text.includes(q);
      const matchesRail = railVal === 'all' || rail === railVal;
      const matchesStatus = statusVal === 'all' || status === statusVal;
      const matchesVol = volumeVal === 'all' || vol === volumeVal;

      if (matchesSearch && matchesRail && matchesStatus && matchesVol) {
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

  if (searchInput) searchInput.addEventListener('input', applyMasterTxnFilters);
  if (railFilter) railFilter.addEventListener('change', applyMasterTxnFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyMasterTxnFilters);
  if (volumeFilter) volumeFilter.addEventListener('change', applyMasterTxnFilters);

  const resetAllAdminTxnFilters = () => {
    if (searchInput) searchInput.value = '';
    if (railFilter) railFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (volumeFilter) volumeFilter.value = 'all';
    applyMasterTxnFilters();
    if (typeof showToast === 'function') {
      showToast('Clearing ledger filters reset.');
    }
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAllAdminTxnFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllAdminTxnFilters);

  // Force Clearing Batch trigger
  const forceClearBtn = document.getElementById('btnAdminForceClear');
  if (forceClearBtn) {
    forceClearBtn.addEventListener('click', () => {
      forceClearBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing Batch...';
      forceClearBtn.disabled = true;

      setTimeout(() => {
        forceClearBtn.innerHTML = '<i class="fas fa-bolt"></i> Execute Clearing Batch';
        forceClearBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('Automated clearing cycle executed: 48 settlements batched to RBI nodal accounts.');
        }
      }, 750);
    });
  }

  // Test switch heartbeats
  const pingSwitchesBtn = document.getElementById('btnTestSwitchHeartbeats');
  if (pingSwitchesBtn) {
    pingSwitchesBtn.addEventListener('click', () => {
      const icon = pingSwitchesBtn.querySelector('i');
      if (icon) icon.classList.add('spinning');
      pingSwitchesBtn.disabled = true;

      setTimeout(() => {
        if (icon) icon.classList.remove('spinning');
        pingSwitchesBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('Settlement switches healthy: NPCI (28ms), RBI (94ms), Card Core (112ms).');
        }
      }, 600);
    });
  }
}

/**
 * ============================================================================
 * SUBPAGE 3: PLATFORM REPORTS & ANALYTICS FEATURES
 * ============================================================================
 */
function initAdminReportsFeatures() {
  const periodSelect = document.getElementById('adminReportPeriodSelect');
  if (periodSelect) {
    periodSelect.addEventListener('change', () => {
      const label = periodSelect.options[periodSelect.selectedIndex].text;
      if (typeof showToast === 'function') {
        showToast(`Reporting window adjusted to: ${label}`);
      }
    });
  }

  const dispatchAuditBtn = document.getElementById('btnTriggerAdminAuditPack');
  if (dispatchAuditBtn) {
    dispatchAuditBtn.addEventListener('click', () => {
      dispatchAuditBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching...';
      dispatchAuditBtn.disabled = true;

      setTimeout(() => {
        dispatchAuditBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Dispatch Treasury Packet Now';
        dispatchAuditBtn.disabled = false;
        if (typeof showToast === 'function') {
          showToast('Regulatory treasury packet compiled & emailed to treasury-ops@stackly.finance.');
        }
      }, 700);
    });
  }
}

/**
 * ============================================================================
 * SUBPAGE 4: SYSTEM SETTINGS & GOVERNANCE FEATURES
 * ============================================================================
 */
function initAdminSettingsFeatures() {
  // Toggle Master Key visibility
  const toggleKeyBtn = document.getElementById('btnToggleMasterKey');
  const masterKeyInput = document.getElementById('masterAdminApiKey');
  if (toggleKeyBtn && masterKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      const isPassword = masterKeyInput.type === 'password';
      masterKeyInput.type = isPassword ? 'text' : 'password';
      const icon = toggleKeyBtn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
      }
    });
  }

  // Copy Master Key
  const copyKeyBtn = document.getElementById('btnCopyMasterKey');
  if (copyKeyBtn && masterKeyInput) {
    copyKeyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(masterKeyInput.value).then(() => {
        if (typeof showToast === 'function') {
          showToast('Master root access token copied to clipboard!');
        }
      });
    });
  }

  // Rotate master signing secret
  const rotateSecretBtn = document.getElementById('btnRotateMasterSecret');
  if (rotateSecretBtn) {
    rotateSecretBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('HMAC-SHA256 master signing secret rotated and updated in HSM vault.');
      }
    });
  }

  // Save Risk Governance
  const saveRiskBtn = document.getElementById('btnSaveRiskGovernance');
  if (saveRiskBtn) {
    saveRiskBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Risk governance and velocity threshold rules saved successfully.');
      }
    });
  }

  // Save All Admin Settings
  const saveAllBtn = document.getElementById('btnSaveAdminSettings');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Platform engine configuration and webhook policies saved.');
      }
    });
  }

  // Force logout other sessions
  const forceLogoutBtn = document.getElementById('btnForceLogoutAdmins');
  if (forceLogoutBtn) {
    forceLogoutBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('1 remote administrator session terminated. Only current device authorized.');
      }
    });
  }
}
