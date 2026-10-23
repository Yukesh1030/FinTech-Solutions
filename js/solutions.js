/**
 * STACKLY FinTech - Solutions Page Logic (solutions.js)
 * Interactive Solution details, ROI calculators, and feature highlights
 */

document.addEventListener('DOMContentLoaded', () => {
  initSolutionInteractivity();
});

function initSolutionInteractivity() {
  // Calculator for Financial Efficiency
  const monthlyTxnInput = document.getElementById('calcTxnVolume');
  const manualHoursEl = document.getElementById('calcSavedHours');
  const costSavingsEl = document.getElementById('calcCostSavings');

  if (monthlyTxnInput && manualHoursEl && costSavingsEl) {
    monthlyTxnInput.addEventListener('input', () => {
      const txns = parseInt(monthlyTxnInput.value, 10) || 0;
      // Est: 1 hour per 120 manual transactions automated
      const hoursSaved = Math.round(txns / 120);
      // Est: ₹1,500 per operational hour
      const savings = hoursSaved * 1500;

      manualHoursEl.textContent = `${hoursSaved.toLocaleString()} hrs/mo`;
      costSavingsEl.textContent = `₹${savings.toLocaleString()}`;
    });
  }

  // Interactive Solution Benefit tags hover effect
  const benefitPills = document.querySelectorAll('.benefit-pill');
  benefitPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.borderColor = 'var(--mint)';
      pill.style.backgroundColor = 'var(--mint-subtle)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.borderColor = 'var(--navy-border)';
      pill.style.backgroundColor = 'var(--white-surface)';
    });
  });
}
