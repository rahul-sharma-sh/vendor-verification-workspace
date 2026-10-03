# Vendor Verification Workspace

A full-stack vendor verification platform designed to simplify vendor onboarding, document verification, company verification, discrepancy detection, task management, and missing-document communication.

The application allows users to create and manage vendors, upload verification documents, extract vendor information using AI, compare vendor data with extracted document data, verify company information using external company records, track verification tasks, maintain vendor version history, and send missing-document notifications through email.

---

## 1. Project Overview

Vendor verification usually requires checking multiple documents and comparing information such as company name, registration number, GST number, address, bank details, and other business information.

This application provides a centralized workflow for managing this process.

### Main workflow

```text
Create Vendor
      ↓
Upload Vendor Documents
      ↓
Extract Document Information
      ↓
AI-Based Data Extraction
      ↓
Compare Vendor Data
      ↓
Company Verification
      ↓
Identify Missing / Mismatched Information
      ↓
Create Verification Tasks
      ↓
Send Missing Document Email
      ↓
Track Version History
```

---

# 2. Features

## Vendor Management

* Create vendors
* View vendor list
* Search vendors
* Filter vendors by status
* View vendor details
* Edit vendor information
* Track vendor verification status

## Document Management

* Upload vendor documents
* Support document-based verification workflow
* Track document processing status
* Extract information from uploaded documents
* Store extracted document information

## AI-Powered Extraction

Google Gemini is used to extract structured vendor information from document text and document images.

Extracted fields include:

* Company Name
* Registration Number
* GST Number
* Address
* Bank Account Number
* IFSC Code

## Document Comparison

The application compares vendor information with information extracted from uploaded documents.

Comparison results can identify:

* `MATCHED`
* `MISMATCH`
* `MISSING`

The system also identifies missing required documents.

## Company Verification

Company information can be verified against external company records using the OpenCorporates API.

## Task Management

* Create verification-related tasks
* View vendor tasks
* Track task status
* Manage verification activities

## Version History

Vendor changes are tracked through vendor version history.

This helps maintain an audit trail of vendor information changes.

## Missing Document Notification

When required documents are missing, the application can send an email notification to the vendor using SMTP through Nodemailer.

---

# 3. Technologies Used

## Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Multer
* Nodemailer

## External Services

* Google Gemini API
* OpenCorporates API
* SMTP Email Service

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 4. AI API Used

The application uses the **Google Gemini API** for AI-powered vendor information extraction.

### SDK

```text
@google/genai
```

### Configured Model

```text
gemini-3.5-flash-lite
```

The AI service supports extraction from:

* Document text
* Document images

### Extracted Information

```json
{
  "companyName": "",
  "registrationNumber": "",
  "gstNumber": "",
  "address": "",
  "bankAccountNumber": "",
  "ifscCode": ""
}
```

### AI Extraction Rules

The extraction prompt instructs the AI to:

* Extract information from the provided document
* Return structured JSON
* Avoid inventing information
* Return an empty string when information is unavailable
* Preserve registration numbers exactly as written
* Preserve GST numbers exactly as written
* Preserve bank account numbers exactly as written
* Preserve IFSC codes exactly as written
* Preserve company names as written
* Extract addresses when available
* Ignore unrelated personal information

---

# 5. Company Verification API Used

The application uses the **OpenCorporates API** for company verification.

OpenCorporates provides access to external company records that can be used to support the company verification workflow.

The verification flow can compare vendor/company information against external company records.

```text
Vendor Information
       ↓
OpenCorporates API
       ↓
External Company Records
       ↓
Verification Result
```

---

# 6. Email Service Used

The application uses **Nodemailer with SMTP** for email notifications.

The SMTP configuration is provided through environment variables.

The system sends missing-document notifications to vendors when required documents have not been uploaded.

### Example email

```text
Subject:
Action Required - Missing Vendor Documents
```

The email contains:

* Vendor name
* Missing documents
* Instructions to upload the required documents
* Vendor Verification Team signature

---

# 7. Database Used

The application uses:

```text
MongoDB
```

with:

```text
Mongoose
```

for database modeling and data access.

## Main Data Models

### Vendor

Stores vendor/company information.

Example fields:

```text
companyName
contactPerson
email
phone
registrationNumber
gstNumber
address
workflowStatus
```

### Document

Stores vendor document information.

Example information includes:

```text
vendorId
documentType
file information
processing status
extracted data
timestamps
```

### Task

Stores verification-related tasks.

Tasks are associated with vendors and used to track verification activities.

### VendorVersion

Stores vendor information history and supports version tracking.

---

# 8. Database Schema Overview

```text
┌─────────────────────┐
│       Vendor        │
├─────────────────────┤
│ _id                 │
│ companyName         │
│ contactPerson       │
│ email               │
│ phone               │
│ registrationNumber  │
│ gstNumber           │
│ address             │
│ workflowStatus      │
└──────────┬──────────┘
           │
     ┌─────┼─────────────┐
     │     │             │
     ▼     ▼             ▼
┌────────┐ ┌────────┐ ┌────────────────┐
│Document│ │ Task   │ │ VendorVersion  │
└────────┘ └────────┘ └────────────────┘
```

---

# 9. Architecture

The application follows a client-server architecture.

```text
                    ┌───────────────────────┐
                    │    React Frontend     │
                    │                       │
                    │ React + TypeScript    │
                    │ Vite + Tailwind CSS   │
                    └───────────┬───────────┘
                                │
                                │ REST API
                                ▼
                    ┌───────────────────────┐
                    │    Express Backend    │
                    │                       │
                    │ Node.js + TypeScript  │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┼───────────────────┐
             │                  │                   │
             ▼                  ▼                   ▼
      ┌─────────────┐   ┌──────────────┐   ┌────────────────┐
      │   MongoDB   │   │ Gemini API   │   │ OpenCorporates │
      │  Mongoose   │   │ AI Extraction│   │  Verification  │
      └─────────────┘   └──────────────┘   └────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Nodemailer SMTP │
                       │ Email Service   │
                       └─────────────────┘
```

---

# 10. Application Architecture

## Frontend

The frontend is responsible for:

* User interface
* Vendor management screens
* Dashboard
* Document upload
* Vendor details
* Document comparison results
* Tasks
* Version history
* API communication

Frontend communication with the backend is handled using Axios.

---

## Backend

The backend is responsible for:

* REST API
* Vendor management
* Document processing
* AI integration
* Company verification
* Document comparison
* Task management
* Version history
* Email notifications
* MongoDB operations

The backend follows a layered structure with:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

External services are integrated through dedicated service modules.

---

# 11. Project Structure

```text
vendor-verification-workspace/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── configs/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── document.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── vendor-version.controller.ts
│   │   │   └── vendor.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── upload.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── Document.model.ts
│   │   │   ├── Task.model.ts
│   │   │   ├── Vendor.model.ts
│   │   │   └── VendorVersion.model.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── document.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── vendor.routes.ts
│   │   │
│   │   ├── services/
│   │   │   ├── ai.service.ts
│   │   │   ├── document-comparison.service.ts
│   │   │   ├── document.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── opencorporates.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── vendor-version.service.ts
│   │   │   └── vendor.service.ts
│   │   │
│   │   ├── utils/
│   │   │   └── document-reader.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   ├── document.api.ts
│   │   │   ├── task.api.ts
│   │   │   ├── vendor.api.ts
│   │   │   └── version.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── documents/
│   │   │   ├── tasks/
│   │   │   ├── versions/
│   │   │   ├── Layout.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── VendorDetails.tsx
│   │   │   └── Vendors.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# 12. API Overview

The application exposes REST APIs for vendor, document, task, and version management.

## Vendor APIs

```text
GET    /api/vendors
POST   /api/vendors
GET    /api/vendors/:id
PATCH  /api/vendors/:id
```

## Document APIs

```text
POST /api/vendors/:id/documents
```

## Document Comparison

```text
POST /api/vendors/:id/compare
```

## Missing Document Email

```text
POST /api/vendors/:id/missing-documents/email
```

## Task APIs

Task-related endpoints are available under the task routes.

## Vendor Version APIs

Version-history endpoints are available under the vendor version routes.

> Refer to the route files in `backend/src/routes/` for the complete API definitions.

---

# 13. Environment Variables

Environment variables are used to keep credentials and configuration outside the source code.

## Backend Environment

Create:

```text
backend/.env
```

Example configuration:

```env
PORT=4000

MONGODB_URI=mongodb://localhost:27017/vendor-verification

GEMINI_API_KEY=your_gemini_api_key

OPENCORPORATES_API_KEY=your_opencorporates_api_key

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

Use the exact variable names expected by `backend/src/configs/env.ts`.

### Important

Do not commit:

```text
.env
.env.local
API keys
SMTP passwords
Database credentials
```

to GitHub.

The project `.gitignore` excludes environment files.

---

# 14. How to Run the Application

## Prerequisites

Install the following:

* Node.js
* npm
* MongoDB
* Git

Optional but recommended:

* Postman
* VS Code

---

# 15. Clone the Repository

```bash
git clone https://github.com/rahul-sharma-sh/vendor-verification-workspace.git
```

Move into the project:

```bash
cd vendor-verification-workspace
```

---

# 16. Backend Setup

Open a terminal.

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
backend/.env
```

Configure MongoDB, Gemini, OpenCorporates, and SMTP credentials.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

---

# 17. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

Normally it is:

```text
http://localhost:5173
```

---

# 18. Production Build

## Frontend

```bash
cd frontend
npm run build
```

The production build is generated in:

```text
frontend/dist
```

## Backend

If a production build script is configured:

```bash
cd backend
npm run build
```

---

# 19. Production Environment

For production deployment, update the environment variables with production values.

Frontend:

```env
VITE_API_URL=https://your-production-backend-url/api
```

Backend:

```env
MONGODB_URI=your-production-mongodb-uri
GEMINI_API_KEY=your-production-gemini-key
OPENCORPORATES_API_KEY=your-production-opencorporates-key
SMTP_HOST=your-production-smtp-host
SMTP_PORT=587
SMTP_USER=your-production-smtp-user
SMTP_PASS=your-production-smtp-password
```

Never expose private API keys in frontend source code.

---

# 20. Verification Workflow

A typical vendor verification workflow is:

```text
1. Create Vendor
       ↓
2. Add Vendor Information
       ↓
3. Upload Required Documents
       ↓
4. Process Documents
       ↓
5. Extract Vendor Information
       ↓
6. Compare Vendor Data With Documents
       ↓
7. Verify Company Information
       ↓
8. Identify Missing Documents
       ↓
9. Identify Mismatched Fields
       ↓
10. Create / Track Verification Tasks
       ↓
11. Send Missing Document Email
       ↓
12. Review Vendor Version History
```

---

# 21. Document Comparison

The comparison service evaluates information from the vendor record against information extracted from uploaded documents.

Example:

```text
Vendor Company Name:
Lex Tree Technologies Pvt Ltd

Document Company Name:
ApexNova Technologies Private Limited

Result:
MISMATCH
```

The system can provide field-level comparison results.

Example structure:

```json
{
  "overallStatus": "MISMATCH",
  "fields": {
    "companyName": {
      "status": "MISMATCH",
      "vendorValue": "Vendor Company",
      "documentValues": [
        "Document Company"
      ]
    }
  },
  "missingDocuments": [],
  "mismatches": [
    "companyName"
  ]
}
```

---

# 22. Missing Documents

The application checks required vendor documents and identifies documents that have not been uploaded.

Example required documents:

```text
Registration Certificate
GST Certificate
Bank Document
```

If one or more documents are missing, the system can send an email notification.

---

# 23. Vendor Version History

Vendor updates can be tracked through the vendor version history functionality.

This provides historical visibility into changes made to vendor information.

The version history can be used to understand:

```text
Previous Vendor Data
        ↓
Vendor Update
        ↓
New Vendor Data
```

---

# 24. Task Management

Tasks help organize the vendor verification process.

Typical tasks can include:

* Verify registration document
* Verify GST information
* Verify bank information
* Review mismatched information
* Request missing documents
* Complete vendor verification

---

# 25. Error Handling

The backend uses centralized application-level error handling to provide consistent API responses.

Errors can occur due to:

* Invalid request data
* Missing vendor
* Invalid document
* Missing environment variables
* External API failures
* AI extraction failures
* Database errors
* Email configuration errors

---

# 26. Security Considerations

The application follows basic security practices including:

* Environment-based secret configuration
* `.env` exclusion through `.gitignore`
* Server-side API credentials
* Server-side external API calls
* Input validation
* Controlled document processing
* Separation of frontend and backend responsibilities

API keys and SMTP credentials should never be stored directly in frontend code or committed to the repository.

---

# 27. 5-Minute Demo Plan

The recommended demo flow is:

### 0:00 - 0:30 — Dashboard

Show:

* Dashboard
* Vendor statistics
* Overall verification workflow

### 0:30 - 1:15 — Create Vendor

Demonstrate:

* Vendor creation
* Company details
* Contact information
* Verification status

### 1:15 - 2:15 — Upload Documents

Demonstrate:

* Open vendor details
* Upload documents
* Show uploaded document list
* Start document processing

### 2:15 - 3:15 — AI Extraction & Comparison

Demonstrate:

* AI-extracted information
* Vendor information
* Document information
* Matched fields
* Mismatched fields
* Missing information

### 3:15 - 3:45 — Company Verification

Demonstrate:

* External company verification
* OpenCorporates-based verification result

### 3:45 - 4:20 — Missing Documents & Email

Demonstrate:

* Missing document detection
* Missing document list
* Send email notification

### 4:20 - 4:45 — Tasks

Demonstrate:

* Verification tasks
* Task status
* Pending actions

### 4:45 - 5:00 — Version History & Architecture

Show:

* Vendor version history
* Briefly explain React → Express → MongoDB
* Explain Gemini, OpenCorporates, and SMTP integrations

---

# 28. Assessment Submission

## 1. Working Application

Production application URL:

```text
Add deployed application URL here
```

## 2. Source Code

GitHub repository:

```text
https://github.com/rahul-sharma-sh/vendor-verification-workspace
```

## 3. Database / Schema

MongoDB is used as the primary database.

Main models:

```text
Vendor
Document
Task
VendorVersion
```

## 4. README

This README contains:

* Technologies used
* AI API used
* Company verification API used
* Email service used
* Database used
* Architecture explanation
* Project structure
* Environment configuration
* Local setup instructions
* Production setup information
* Demo workflow

## 5. Architecture Explanation

The application uses a React frontend communicating with a Node.js/Express backend through REST APIs.

The backend communicates with:

* MongoDB for persistent data
* Google Gemini for AI-based document extraction
* OpenCorporates for company verification
* SMTP/Nodemailer for email notifications

## 6. 5-Minute Demo

The demo covers:

* Vendor creation
* Document upload
* AI extraction
* Document comparison
* Company verification
* Missing document detection
* Email notification
* Task management
* Version history

---

# 29. Repository

GitHub:

https://github.com/rahul-sharma-sh/vendor-verification-workspace

---

# 30. Summary

Vendor Verification Workspace provides an end-to-end workflow for managing vendor verification.

The system combines:

```text
React
   +
Node.js / Express
   +
MongoDB
   +
Google Gemini
   +
OpenCorporates
   +
Nodemailer / SMTP
```

to provide vendor management, document processing, AI-based extraction, document comparison, company verification, task management, version history, and missing-document notifications.
