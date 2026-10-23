/**
 * STACKLY FinTech - Main JavaScript (main.js)
 * Interactive home page features: Charts, Invoice Downloads, Tab Switchers, FAQs, Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initFinancialInsightsChart();
  initConnectedExperienceTabs();
  initSampleInvoiceDownload();
  initModalListeners();
});

// 1. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// 2. Real-Time Financial Insights Chart (Section 03)
let insightsChart = null;
function initFinancialInsightsChart() {
  const ctx = document.getElementById('insightsChartCanvas');
  if (!ctx) return;

  const sampleData = {
    '7D': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      inflow: [42000, 58000, 62000, 49000, 84000, 92000, 78000],
      outflow: [18000, 24000, 31000, 22000, 39000, 41000, 34000]
    },
    '30D': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      inflow: [280000, 340000, 310000, 420000],
      outflow: [120000, 160000, 145000, 190000]
    },
    '1Y': {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      inflow: [1200000, 1500000, 1850000, 2200000, 2600000, 3100000],
      outflow: [650000, 780000, 920000, 1100000, 1250000, 1400000]
    }
  };

  if (typeof Chart !== 'undefined') {
    insightsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sampleData['7D'].labels,
        datasets: [
          {
            label: 'Net Inflow (₹)',
            data: sampleData['7D'].inflow,
            borderColor: '#42D6B0',
            backgroundColor: 'rgba(66, 214, 176, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#101D32',
            pointBorderColor: '#42D6B0',
            pointBorderWidth: 2,
            pointRadius: 5
          },
          {
            label: 'Operational Outflow (₹)',
            data: sampleData['7D'].outflow,
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
            labels: {
              font: { family: 'Poppins', size: 12 },
              color: '#101D32'
            }
          },
          tooltip: {
            backgroundColor: '#101D32',
            titleFont: { family: 'Space Grotesk' },
            bodyFont: { family: 'Poppins' },
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(16, 29, 50, 0.06)' },
            ticks: {
              font: { family: 'Poppins', size: 11 },
              callback: (val) => '₹' + (val >= 100000 ? (val/100000) + 'L' : (val/1000) + 'k')
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Poppins', size: 11 } }
          }
        }
      }
    });

    // Handle Time Filter Buttons
    const filterBtns = document.querySelectorAll('.insights-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.getAttribute('data-period');
        if (sampleData[period] && insightsChart) {
          insightsChart.data.labels = sampleData[period].labels;
          insightsChart.data.datasets[0].data = sampleData[period].inflow;
          insightsChart.data.datasets[1].data = sampleData[period].outflow;
          insightsChart.update();
        }
      });
    });
  }
}

// 3. Section 07 Connected Financial Experience Tabs
function initConnectedExperienceTabs() {
  const connBtns = document.querySelectorAll('.conn-tab-btn');
  const connPanels = document.querySelectorAll('.conn-pane');

  if (!connBtns.length || !connPanels.length) return;

  connBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      connBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      connPanels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        // Force reflow for keyframe animation to restart cleanly
        void targetPane.offsetWidth;
        targetPane.classList.add('active');
      }
    });
  });
}

// 4. Section 04 Downloadable Sample Invoice Demonstration
function initSampleInvoiceDownload() {
  const downloadBtns = document.querySelectorAll('.btn-download-sample-invoice');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Generate sample invoice receipt text file download
      const invoiceContent = `=====================================================
STACKLY FINTECH SOLUTIONS - SAMPLE INVOICE SPECIFICATION
=====================================================
Invoice Number: STK-INV-2026-8941
Issue Date: 2026-10-22
Due Date: 2026-11-05
Status: PAID (Sample Simulation)

BILLED TO:
Enterprise Global Technologies Ltd.
GSTIN: 29AAAAA0000A1Z5
Bengaluru, Karnataka, India

LINE ITEMS:
-----------------------------------------------------
1. API Infrastructure Tier 3 (Oct 2026)      ₹45,000.00
2. Multi-Currency Settlement Engine          ₹18,500.00
3. Dedicated SLA & Audit Trail               ₹12,000.00
-----------------------------------------------------
Subtotal:                                   ₹75,500.00
CGST (9%):                                  ₹6,795.00
SGST (9%):                                  ₹6,795.00
TOTAL PAID:                                 ₹89,090.00

Payment Method: Virtual Corporate IBAN (Simulated)
Confirmation Reference: TXN-998812739481

NOTE: This is a front-end demonstration record generated
by STACKLY FinTech Solutions visual interface prototype.
=====================================================`;

      const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'STACKLY_Sample_Invoice_STK8941.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Sample demonstration invoice downloaded successfully!');
    });
  });
}

// 5. General Modal handlers
function initModalListeners() {
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-close-trigger');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

// Toast notification helper
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.innerHTML = `<i class="fas fa-check-circle text-mint"></i> <span id="toastMsg"></span>`;
    document.body.appendChild(toast);
  }
  const msgSpan = toast.querySelector('#toastMsg');
  if (msgSpan) msgSpan.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
window.showToast = showToast;
