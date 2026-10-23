/**
 * STACKLY FinTech - Products Page Logic (products.js)
 * Interactive UI Prototypes, Payment Simulator, and Tab Switchers
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductTabs();
  initPaymentSimulator();
});

function initProductTabs() {
  const tabBtns = document.querySelectorAll('.product-tab-btn');
  const tabPanes = document.querySelectorAll('.product-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

function initPaymentSimulator() {
  const form = document.getElementById('paymentSimulatorForm');
  const resultBox = document.getElementById('simulatorResult');
  const simTxnId = document.getElementById('simTxnId');
  const simAmount = document.getElementById('simAmount');
  const simLatency = document.getElementById('simLatency');

  if (!form || !resultBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountVal = document.getElementById('simAmountInput').value || '2500';
    const methodVal = document.getElementById('simMethodSelect').value || 'UPI Instant';

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Test Route...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-play"></i> Run Payment Simulation';
      submitBtn.disabled = false;

      // Generate random simulated reference
      const randomRef = 'STK-' + Math.floor(100000 + Math.random() * 900000);
      const latencyMs = Math.floor(140 + Math.random() * 80);

      if (simTxnId) simTxnId.textContent = randomRef;
      if (simAmount) simAmount.textContent = '₹' + parseFloat(amountVal).toLocaleString() + ` (${methodVal})`;
      if (simLatency) simLatency.textContent = latencyMs + 'ms';

      resultBox.classList.add('show');
    }, 600);
  });
}
