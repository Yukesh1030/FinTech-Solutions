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
  const amountInput = document.getElementById('simAmountInput');
  const methodSelect = document.getElementById('simMethodSelect');
  const amountError = document.getElementById('simAmountError');
  const methodError = document.getElementById('simMethodError');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset error states
    if (amountError) amountError.style.display = 'none';
    if (methodError) methodError.style.display = 'none';
    if (amountInput) amountInput.style.borderColor = '';
    if (methodSelect) methodSelect.style.borderColor = '';

    // Validate Simulated Amount
    const amountVal = amountInput ? parseFloat(amountInput.value) : NaN;
    if (isNaN(amountVal) || amountVal < 100 || amountVal > 500000) {
      hasError = true;
      if (amountError) amountError.style.display = 'block';
      if (amountInput) {
        amountInput.style.borderColor = '#ff5252';
        amountInput.focus();
      }
    }

    // Validate Payment Method
    if (!methodSelect || !methodSelect.value) {
      hasError = true;
      if (methodError) methodError.style.display = 'block';
      if (methodSelect) methodSelect.style.borderColor = '#ff5252';
    }

    if (hasError) return;

    // Valid: Provide visual progress state and redirect to 404 page
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing &amp; Redirecting...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      window.location.href = '404.html';
    }, 600);
  });
}
