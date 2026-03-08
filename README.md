# DDVS — Digital Document Verification System (Frontend)

React frontend for the Digital Document Verification System. Provides a login portal for authorized users, an admin/issuer dashboard for managing documents, and a public verification page anyone can use to confirm document authenticity.

**Backend repo:** [ddvs](https://github.com/yourusername/ddvs)

---

## Pages

### Login — `/login`
- Email and password authentication
- JWT token stored on successful login
- Redirects to dashboard
- Link to public verification page

### Dashboard — `/dashboard` *(protected)*
Four tabs based on user role:

| Tab | Description |
|---|---|
| Documents | View all issued documents with status badges, revoke action |
| Issue Document | Form to issue a new document with auto-generated verification code |
| Issuers | View, add, and delete issuers |
| Verification Logs | Full log of all verification attempts with IP and result |

### Verify — `/verify` or `/verify/:code`
- Public page — no login required
- Enter a verification code manually or via QR code link
- Returns document details and status: `VALID`, `EXPIRED`, `REVOKED`, or `NOT_FOUND`
- Color-coded status badges

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| HTTP | Axios |
| Styling | Tailwind CSS v3 |
| State | React Context API |

---

## Getting Started

### Prerequisites
- Node.js
- Backend running on `http://localhost:8080`

### Setup

1. Clone the repo:
```bash
git clone https://github.com/yourusername/ddvs-frontend.git
cd ddvs-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npm start
```

App runs on `http://localhost:3000`

---

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with JWT interceptor
├── components/
│   ├── DocumentList.jsx  # Documents table with revoke action
│   ├── IssueDocument.jsx # Issue document form
│   ├── IssuerList.jsx    # Issuer management
│   └── VerificationLogs.jsx # Logs table
├── context/
│   └── AuthContext.js    # Global auth state
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx
│   ├── admin/
│   │   └── DashboardPage.jsx
│   └── public/
│       └── VerifyPage.jsx
└── utils/
    └── auth.js           # Token helpers
```

---

## Authentication Flow

```
Login → JWT token saved to localStorage
     → Token attached to every request via Axios interceptor
     → Protected routes redirect to /login if no token
     → Logout clears token and redirects
```

---

## Verification Flow

```
User enters code → GET /verify/{code}
               → Backend checks document and logs attempt
               → Returns status and document details
               → UI renders color-coded result
```