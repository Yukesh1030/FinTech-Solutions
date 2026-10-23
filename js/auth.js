/**
 * STACKLY FinTech - Authentication Handling (auth.js)
 * Matching uploaded UI, validation, and dashboard routing:
 * "Admin" -> AdminDashboard.html
 * "Client" -> ClientDashboard.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthAnimations();
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
});

function initAuthAnimations() {
  const authCard = document.querySelector('.auth-card');
  if (authCard && typeof gsap !== 'undefined') {
    gsap.fromTo(authCard, 
      { y: 35, opacity: 0, scale: 0.96 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    );
  }
}

function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-password');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.closest('.input-icon-wrap').querySelector('input');
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    });
  });
}

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const loginAsSelect = document.getElementById('loginAs');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // Reset errors
    clearErrors(loginForm);

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate Password
    const passwordVal = passwordInput.value;
    if (!passwordVal || passwordVal.length < 4) {
      showError(passwordInput, 'Please enter your password');
      isValid = false;
    }

    if (!isValid) return;

    // Loading button state
    const submitBtn = loginForm.querySelector('.auth-submit-btn');
    const origText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;

    // Check Role: Admin vs Client
    const selectedRole = loginAsSelect.value; // 'Admin' or 'Client'

    setTimeout(() => {
      // Store current user session in sessionStorage for dashboard personalization
      sessionStorage.setItem('stackly_user_email', emailVal);
      sessionStorage.setItem('stackly_user_role', selectedRole);

      if (selectedRole === 'Admin') {
        window.location.href = 'AdminDashboard.html';
      } else {
        window.location.href = 'ClientDashboard.html';
      }
    }, 700);
  });
}

function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const signupAsSelect = document.getElementById('signupAs');
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');

    clearErrors(signupForm);

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your full name');
      isValid = false;
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate Password
    if (!passwordInput.value || passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn = signupForm.querySelector('.auth-submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Redirect to login page
      window.location.href = 'login.html?registered=true';
    }, 800);
  });
}

function showError(inputElement, message) {
  const group = inputElement.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    const errorMsg = group.querySelector('.input-error-msg');
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }
}

function clearErrors(formElement) {
  const errorGroups = formElement.querySelectorAll('.form-group.has-error');
  errorGroups.forEach(group => {
    group.classList.remove('has-error');
  });
}
