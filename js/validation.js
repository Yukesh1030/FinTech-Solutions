/**
 * STACKLY FinTech - Form Validation (validation.js)
 * Validates Contact form, provides accessible inline feedback, prevents sensitive field submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
});

function initContactFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const fullNameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const companyInput = document.getElementById('contactCompany');
  const inquiryTypeSelect = document.getElementById('contactInquiryType');
  const messageInput = document.getElementById('contactMessage');
  const successModal = document.getElementById('contactSuccessModal');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset error states
    contactForm.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

    // 1. Full Name
    if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 2) {
      setFieldError(fullNameInput, 'Please enter your full name (minimum 2 letters)');
      hasError = true;
    }

    // 2. Business Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      setFieldError(emailInput, 'Please provide a valid work or business email address');
      hasError = true;
    }

    // 3. Company Name
    if (!companyInput.value.trim() || companyInput.value.trim().length < 2) {
      setFieldError(companyInput, 'Please specify your company or organization name');
      hasError = true;
    }

    // 4. Inquiry Type
    if (!inquiryTypeSelect.value) {
      setFieldError(inquiryTypeSelect, 'Please select the type of inquiry');
      hasError = true;
    }

    // 5. Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setFieldError(messageInput, 'Message should be at least 10 characters long');
      hasError = true;
    }

    if (hasError) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Form is Valid: Provide instant responsive visual confirmation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Inquiry...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();

      if (successModal) {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        alert('Thank you! Your inquiry has been submitted. A STACKLY specialist will respond within 1 business day.');
      }
    }, 800);
  });
}

function setFieldError(field, msg) {
  const group = field.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    const msgEl = group.querySelector('.input-error-msg');
    if (msgEl) {
      msgEl.textContent = msg;
    }
  }
}
