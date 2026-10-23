/**
 * STACKLY FinTech - Senior Frontend Engineering Test Suite (test_frontend.mjs)
 * Live automated verification via Chrome DevTools Protocol & Node.js
 */

import fs from 'fs';
import path from 'path';

const PORT = 3000;
const CDP_HTTP = 'http://127.0.0.1:9222';
const SCREENSHOT_DIR = 'test_reports/screenshots';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// CDP Client Helper using native WebSocket
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { resolve, reject } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) reject(data.error);
          else resolve(data.result);
        } else if (data.method) {
          const listeners = this.eventListeners.get(data.method) || [];
          listeners.forEach(fn => fn(data.params));
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, callback) {
    if (!this.eventListeners.has(method)) {
      this.eventListeners.set(method, []);
    }
    this.eventListeners.get(method).push(callback);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function getPageTarget() {
  const res = await fetch(`${CDP_HTTP}/json/list`);
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  if (page) return page;
  const newRes = await fetch(`${CDP_HTTP}/json/new`, { method: 'PUT' });
  return await newRes.json();
}

const testResults = {
  assetChecks: [],
  pageTests: [],
  functionalTests: [],
  responsiveChecks: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

function recordTest(category, name, passed, details = '') {
  testResults.summary.total++;
  if (passed) testResults.summary.passed++;
  else testResults.summary.failed++;

  const entry = { name, passed, details };
  if (category === 'assets') testResults.assetChecks.push(entry);
  else if (category === 'pages') testResults.pageTests.push(entry);
  else if (category === 'functional') testResults.functionalTests.push(entry);
  else if (category === 'responsive') testResults.responsiveChecks.push(entry);

  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${category.toUpperCase()}] ${name}${details ? ': ' + details : ''}`);
}

async function runTestSuite() {
  console.log('=================================================================');
  console.log('🚀 STACKLY FINTECH SOLUTIONS - SENIOR QA AUTOMATION SUITE');
  console.log('=================================================================\n');

  // 1. Asset & Specification Verification
  console.log('--- 1. Image Format & File Size Rules (70KB - 90KB WebP) ---');
  const assetsDir = 'Assets';
  const assetFiles = fs.readdirSync(assetsDir);
  for (const f of assetFiles) {
    if (f.endsWith('.webp')) {
      const p = path.join(assetsDir, f);
      const stat = fs.statSync(p);
      const kb = stat.size / 1024.0;
      const inRange = kb >= 70.0 && kb <= 90.0;
      recordTest(
        'assets',
        `Image Size & Format: ${f}`,
        inRange,
        `${kb.toFixed(2)} KB (Target: 70 - 90 KB)`
      );
    }
  }

  // Check required HTML pages
  console.log('\n--- 2. File Structure & GitHub Pages Routing Checklist ---');
  const requiredPages = [
    'index.html',
    'solutions.html',
    'products.html',
    'about.html',
    'contact.html',
    'login.html',
    'signup.html',
    '404.html',
    'AdminDashboard.html',
    'ClientDashboard.html'
  ];

  for (const page of requiredPages) {
    const exists = fs.existsSync(page);
    recordTest('pages', `Root file existence: ${page}`, exists);
  }

  // 3. Browser CDP Testing
  console.log('\n--- 3. Live Browser Automated Execution via CDP ---');
  const target = await getPageTarget();
  const cdp = new CDPClient(target.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  const consoleErrors = [];
  cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      consoleErrors.push(params.args.map(a => a.value || a.description).join(' '));
    }
  });

  const breakPoints = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 13/14', width: 390, height: 844 },
    { name: 'iPhone Plus', width: 414, height: 896 },
    { name: 'iPad Portrait', width: 768, height: 1024 },
    { name: 'iPad Landscape', width: 1024, height: 768 },
    { name: 'Laptop', width: 1280, height: 800 },
    { name: 'Desktop HD', width: 1440, height: 900 },
    { name: 'Full HD 1080p', width: 1920, height: 1080 }
  ];

  // Helper to set viewport
  async function setViewport(w, h) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w <= 768
    });
  }

  // Helper to evaluate JS in page
  async function evaluate(expression) {
    const res = await cdp.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result.value;
  }

  // Helper to navigate and wait for load
  async function navigate(page) {
    consoleErrors.length = 0;
    let loaded = false;
    const onLoad = () => { loaded = true; };
    cdp.on('Page.loadEventFired', onLoad);
    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/${page}` });
    const start = Date.now();
    while (!loaded && (Date.now() - start < 2500)) {
      await new Promise(r => setTimeout(r, 50));
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // Helper for screenshot
  async function captureScreenshot(filename) {
    const res = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), buf);
  }

  // Test each page for Zero Overflow across ALL 8 Breakpoints
  console.log('\n--- 4. Responsiveness & Zero-Overflow Audits (8 Breakpoints per Page) ---');
  for (const page of requiredPages) {
    await navigate(page);

    for (const bp of breakPoints) {
      await setViewport(bp.width, bp.height);
      await new Promise(r => setTimeout(r, 80));

      const overflow = await evaluate(`
        document.documentElement.scrollWidth > document.documentElement.clientWidth ||
        document.body.scrollWidth > document.body.clientWidth
      `);

      const maxScrollWidth = await evaluate(`Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)`);
      const clientWidth = await evaluate(`document.documentElement.clientWidth`);

      recordTest(
        'responsive',
        `${page} @ ${bp.width}px (${bp.name})`,
        !overflow,
        overflow ? `Overflow detected: scrollWidth ${maxScrollWidth} > clientWidth ${clientWidth}` : 'Zero horizontal overflow'
      );
    }
  }

  // Take reference screenshots
  await setViewport(1280, 800);
  await navigate('index.html');
  await captureScreenshot('desktop_index.png');

  await setViewport(375, 667);
  await captureScreenshot('mobile_index.png');

  await setViewport(1280, 800);
  await navigate('login.html');
  await captureScreenshot('desktop_login.png');

  await setViewport(1280, 800);
  await navigate('signup.html');
  await captureScreenshot('desktop_signup.png');

  await setViewport(1280, 800);
  await navigate('contact.html');
  await captureScreenshot('desktop_contact.png');

  await setViewport(1280, 800);
  await navigate('404.html');
  await captureScreenshot('desktop_404.png');

  await setViewport(1280, 800);
  await navigate('AdminDashboard.html');
  await captureScreenshot('desktop_admin_dashboard.png');

  await setViewport(1280, 800);
  await navigate('ClientDashboard.html');
  await captureScreenshot('desktop_client_dashboard.png');

  // 5. Functional & Interactive Unit Testing
  console.log('\n--- 5. Functional & Interactivity Verification ---');

  // Test 5.1: Mobile Navigation Drawer on index.html
  await setViewport(375, 667);
  await navigate('index.html');
  const hamburgerClicked = await evaluate(`
    (() => {
      const btn = document.querySelector('.hamburger-btn');
      if (btn) { btn.click(); return true; }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  const mobileNavIsOpen = await evaluate(`
    document.querySelector('.mobile-nav').classList.contains('open')
  `);
  recordTest('functional', 'Mobile Hamburger opens Drawer Menu', hamburgerClicked && mobileNavIsOpen);

  const closeBtnClicked = await evaluate(`
    (() => {
      const closeBtn = document.querySelector('.mobile-close-btn');
      if (closeBtn) { closeBtn.click(); return true; }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  const mobileNavIsClosed = await evaluate(`
    !document.querySelector('.mobile-nav').classList.contains('open')
  `);
  recordTest('functional', 'Mobile Close button dismisses Drawer Menu', closeBtnClicked && mobileNavIsClosed);

  // Test 5.2: 404 Page Structure & Navigation
  await setViewport(1280, 800);
  await navigate('404.html');
  await new Promise(r => setTimeout(r, 600));
  const errorHeadingText = await evaluate(`
    document.querySelector('.error-heading') ? document.querySelector('.error-heading').textContent.trim() : ''
  `);
  recordTest('functional', '404 Page Headline Validation', errorHeadingText === "THIS TRANSACTION COULDN'T BE FOUND.", errorHeadingText);
  const backToHomeHref = await evaluate(`
    document.querySelector('.error-actions-group a.btn-accent') ? document.querySelector('.error-actions-group a.btn-accent').getAttribute('href') : ''
  `);
  recordTest('functional', '404 Page "Back to Home" Link', backToHomeHref === 'index.html', backToHomeHref);

  // Test 5.3: Login Page Role Redirection (Admin -> AdminDashboard.html, Client -> ClientDashboard.html)
  await navigate('login.html');
  
  // Test password toggle
  await evaluate(`
    (() => {
      const input = document.getElementById('loginPassword');
      const toggle = document.querySelector('.toggle-password');
      toggle.click();
    })()
  `);
  const passTypeAfterToggle = await evaluate(`document.getElementById('loginPassword').type`);
  recordTest('functional', 'Login Password visibility toggle switches to text', passTypeAfterToggle === 'text');

  // Submit as Admin
  await evaluate(`
    (() => {
      document.getElementById('loginAs').value = 'Admin';
      document.getElementById('loginEmail').value = 'admin@stackly.finance';
      document.getElementById('loginPassword').value = 'secureAdmin123';
      document.getElementById('loginForm').dispatchEvent(new Event('submit', { cancelable: true }));
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));
  const urlAfterAdminLogin = await evaluate(`window.location.href`);
  recordTest('functional', 'Login as "Admin" redirects to AdminDashboard.html', urlAfterAdminLogin.includes('AdminDashboard.html'), urlAfterAdminLogin);

  // Submit as Client
  await navigate('login.html');
  await evaluate(`
    (() => {
      document.getElementById('loginAs').value = 'Client';
      document.getElementById('loginEmail').value = 'client@company.com';
      document.getElementById('loginPassword').value = 'secureClient123';
      document.getElementById('loginForm').dispatchEvent(new Event('submit', { cancelable: true }));
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));
  const urlAfterClientLogin = await evaluate(`window.location.href`);
  recordTest('functional', 'Login as "Client" redirects to ClientDashboard.html', urlAfterClientLogin.includes('ClientDashboard.html'), urlAfterClientLogin);

  // Test 5.4: Admin Dashboard KPI Values & Refresh Control
  await navigate('AdminDashboard.html');
  const kpi1 = await evaluate(`document.getElementById('kpiTotalTxns').textContent.trim()`);
  const kpi2 = await evaluate(`document.getElementById('kpiPendingPay').textContent.trim()`);
  const kpi3 = await evaluate(`document.getElementById('kpiProcessedVol').textContent.trim()`);
  recordTest('functional', 'Admin Dashboard KPI 1: TOTAL TRANSACTIONS', kpi1.includes('2,486'), kpi1);
  recordTest('functional', 'Admin Dashboard KPI 2: PENDING PAYMENTS', kpi2 === '34', kpi2);
  recordTest('functional', 'Admin Dashboard KPI 3: PROCESSED VOLUME', kpi3.includes('12.8L'), kpi3);

  // Click Refresh button
  const rowCountBefore = await evaluate(`document.querySelectorAll('#adminTxnTableBody tr').length`);
  await evaluate(`document.querySelector('.btn-refresh-admin').click()`);
  await new Promise(r => setTimeout(r, 1000));
  const rowCountAfter = await evaluate(`document.querySelectorAll('#adminTxnTableBody tr').length`);
  recordTest('functional', 'Admin Dashboard "Refresh Data" prepends dynamic row', rowCountAfter > rowCountBefore, `Rows: ${rowCountBefore} -> ${rowCountAfter}`);

  // Test 5.5: Client Dashboard KPI Values & Actions
  await navigate('ClientDashboard.html');
  const cKpi1 = await evaluate(`document.getElementById('kpiAccountOverview').textContent.trim()`);
  const cKpi2 = await evaluate(`document.getElementById('kpiPendingInvoices').textContent.trim()`);
  const cKpi3 = await evaluate(`document.getElementById('kpiThisMonth').textContent.trim()`);
  recordTest('functional', 'Client Dashboard KPI 1: ACCOUNT OVERVIEW', cKpi1.includes('84,500'), cKpi1);
  recordTest('functional', 'Client Dashboard KPI 2: PENDING INVOICES', cKpi2 === '3', cKpi2);
  recordTest('functional', 'Client Dashboard KPI 3: THIS MONTH', cKpi3.includes('26,400'), cKpi3);

  // Test 5.6: Contact Form Validation & Indian Branch Offices
  await navigate('contact.html');
  const officeCount = await evaluate(`document.querySelectorAll('.contact-office-card').length`);
  const officeText = await evaluate(`document.getElementById('contact-offices').textContent`);
  const hasBlr = officeText.includes('Bengaluru') && officeText.includes('560068');
  const hasHyd = officeText.includes('Hyderabad') && officeText.includes('500081');
  recordTest('functional', 'Contact Page Features 2 Branch Offices (Bengaluru & Hyderabad)', hasBlr && hasHyd, `Count: ${officeCount}`);

  // Empty submit validation
  await evaluate(`document.getElementById('contactForm').dispatchEvent(new Event('submit', { cancelable: true }))`);
  const formHasErrors = await evaluate(`document.querySelectorAll('#contactForm .has-error').length > 0`);
  recordTest('functional', 'Contact Form blocks empty submit with inline errors', formHasErrors);

  // Clean up CDP
  cdp.close();

  console.log('\n=================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${testResults.summary.passed} / ${testResults.summary.total} PASSED (${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%)`);
  if (testResults.summary.failed > 0) {
    console.log(`⚠️ ${testResults.summary.failed} TESTS FAILED`);
  } else {
    console.log('🎉 100% OF TESTS PASSED WITH ZERO ERRORS');
  }
  console.log('=================================================================\n');

  // Save JSON report
  fs.writeFileSync('test_reports/test_results.json', JSON.stringify(testResults, null, 2));
}

runTestSuite().catch(err => {
  console.error('Test Suite encountered error:', err);
  process.exit(1);
});
