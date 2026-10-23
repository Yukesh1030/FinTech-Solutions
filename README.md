# STACKLY FinTech Solutions

A state-of-the-art, high-performance financial technology web platform built with pure **HTML5, Vanilla CSS3, and JavaScript**. Engineered for zero-friction digital payments, billing automation, and real-time financial intelligence.

Compatible with **GitHub Pages** deployment as a zero-dependency static web application.

---

## 🎨 Design System & Theme

### Color Palette (Exactly 3 Theme Colors)
| Color | Hex | Role | Usage |
|---|---|---|---|
| **Midnight Navy** | `#101D32` | Primary / Dark Surfaces | Headers, dark sections, cards, primary buttons |
| **Cloud White** | `#F5F7FA` | Background / Light Surfaces | Page background, cards, input backgrounds |
| **Digital Mint** | `#42D6B0` | Accent / Interactions | Badges, button hover accents, chart lines, trends |

*Tints and shades of these same three colors are utilized for borders, secondary surfaces, and micro-interactions.*

### Typography
- **Poppins**: Navigation, dashboard metrics, body copy, forms, and buttons.
- **Space Grotesk**: Hero headings, financial statistics, display headings.

---

## 📁 Project Structure (GitHub Pages Standard)

```
FinTech Solutions/
│
├── index.html                  # Home page (Hero + 10 sections)
├── solutions.html              # Solutions page (Hero + 8 sections)
├── products.html               # Products page (Hero + 8 sections)
├── about.html                  # About page (Hero + 8 sections)
├── contact.html                # Contact page (Hero + 8 sections)
├── login.html                  # Login page (Role selection: Client / Admin)
├── signup.html                 # Signup page
├── 404.html                    # Custom 404 page ("Back" & "Back to Home")
│
├── AdminDashboard.html         # Admin Portal (5 sidebar menus, 3 KPI cards, tables, charts)
├── ClientDashboard.html        # Client Portal (5 sidebar menus, 3 KPI cards, invoices, statements)
│
├── css/
│   ├── style.css               # Core design tokens, global styles, navbar, footer, auth
│   ├── responsive.css          # Responsive breakpoints (375px to 1920px) & overflow lock
│   ├── animations.css          # GSAP keyframes, text masks, reduced-motion fallbacks
│   ├── solutions.css           # Solutions page layouts & benefit tags
│   ├── products.css            # Interactive product simulators & integrations
│   └── dashboard.css           # Admin & Client dashboard sidebar, tables, cards, modals
│
├── js/
│   ├── main.js                 # Chart.js insights, sample invoice downloads, FAQs, tabs
│   ├── navigation.js           # Responsive hamburger drawer, sticky header, active states
│   ├── animations.js           # GSAP timeline reveals, ScrollTrigger, counter animations
│   ├── solutions.js            # ROI efficiency calculator
│   ├── products.js             # Interactive payment simulator & tab switchers
│   ├── validation.js           # Contact form validation & accessible inline feedback
│   ├── auth.js                 # Authentication logic, password toggle, dashboard routing
│   ├── admin-dashboard.js      # Admin live transaction filters, charts, demo refresh
│   └── client-dashboard.js     # Client cash-flow charts, invoice settlements, CSV exports
│
├── Assets/                     # Source optimized WebP images (70KB-90KB)
│   ├── Brand-logo.webp
│   ├── card.webp
│   ├── cover.webp
│   ├── cover2.webp
│   ├── billing-invoicing.webp
│   ├── connected-financial-experience.webp
│   ├── customer-stories.webp
│   ├── financial-performance.webp
│   ├── index-bg-cover.webp
│   ├── real-time-financial-insights.webp
│   ├── security-trust.webp
│   ├── solutions-every-business.webp
│   └── user.webp
│
├── assets/                     # Organized semantic image mirror
│   └── images/
│       ├── hero/
│       ├── payments/
│       ├── analytics/
│       ├── business/
│       ├── security/
│       └── about/
│
└── README.md
```

---

## 🚀 Key Features

1. **Custom 404 Page (`404.html`)**:
   - Header: `THIS TRANSACTION COULDN'T BE FOUND.`
   - "Back" button (`window.history.back()`) and "Back to Home" (`index.html`).
   - Signature GSAP bounce & receipt float animation.

2. **Role-Based Authentication (`login.html` & `signup.html`)**:
   - Matches uploaded designs with clean split/mint background.
   - Allows login with any valid email and password:
     - Selecting **Admin** in "Login As" routes to `AdminDashboard.html`.
     - Selecting **Client** in "Login As" routes to `ClientDashboard.html`.
   - Forgot password link and non-nav links route to `404.html`.

3. **Admin Dashboard (`AdminDashboard.html`)**:
   - 5 Main Menus: *Dashboard, Accounts & Customers, Transactions, Reports & Analytics, Settings*.
   - 3 Primary KPI Cards: *TOTAL TRANSACTIONS (2,486), PENDING PAYMENTS (34), PROCESSED VOLUME (₹12.8L)*.
   - Dynamic real-time transaction filter and search.
   - Interactive transaction volume distribution chart.
   - "Refresh Data" button with live animation, timestamp updates, and new row generation.

4. **Client Dashboard (`ClientDashboard.html`)**:
   - 5 Main Menus: *Dashboard, Transactions, Invoices & Payments, Reports & Insights, Profile & Settings*.
   - 3 Primary KPI Cards: *ACCOUNT OVERVIEW (₹84,500), PENDING INVOICES (3), THIS MONTH (₹26,400)*.
   - "Pay Now" simulation and "View Invoice" modal.
   - Interactive monthly cash-flow chart.
   - One-click sample financial statement CSV export.

5. **Contact Page with Verified Indian Branch Offices (`contact.html`)**:
   - Features exact branch offices from uploaded reference:
     - **Bengaluru Branch Office**: Evolve Studio, 4th Floor, Begur – Koppa Rd, Bengaluru, Karnataka – 560068.
     - **Hyderabad Branch Office**: STACKLY, 4th Floor, Jayasudha Heights, Madhapur, Hyderabad, Telangana – 500081.
   - Pure JavaScript form validation for Full Name, Business Email, Company, Inquiry Type, and Message.
   - Strict security statement prohibiting collection of passwords, PINs, or CVVs.

6. **WebP Format Compliance (70KB - 90KB)**:
   - All images across the platform are strictly in WebP format within the targeted 70KB – 90KB range for optimal web loading performance.

7. **Strict Mobile Responsiveness**:
   - Verified across breakpoints: `375px`, `390px`, `414px`, `768px`, `1024px`, `1280px`, `1440px`, and `1920px`.
   - Horizontal overflow locked with `overflow-x: hidden`.
   - Fully functioning mobile drawer menu with ARIA accessibility.

---

## 🌐 Publishing to GitHub Pages

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of STACKLY FinTech platform"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Source** as **Deploy from a branch**.
   - Select branch `main` and folder `/ (root)`.
   - Click **Save**.
3. Your website will be live at `https://<your-username>.github.io/<repo-name>/`.
