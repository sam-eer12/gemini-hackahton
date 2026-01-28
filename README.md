# AMICUS.AI 🏛️

**Elite AI-Powered Legal Consultancy** | Built with Next.js 16 & Gemini AI

![AMICUS.AI Banner](public/favicon.png)

> *"Swift, precise, jurisdiction-aware counsel. The future of legal consultation is here."*

## 🌐 Live Demo

**[https://amicusai.vercel.app](https://amicusai.vercel.app)**

---

## 📋 Overview

AMICUS.AI is a sophisticated legal AI platform that provides instant, jurisdiction-aware legal counsel powered by Google's Gemini AI. The platform offers three core services:

- **Live Counsel** - Real-time AI legal consultation with chat interface
- **Ghost Vault** - Zero-retention document analysis (files are analyzed and immediately deleted)
- **Contract Forge** - AI-powered contract generation with PDF export

## ✨ Features

### 🔐 Authentication
- Secure email/password signup with OTP verification
- Terms acceptance flow for new users
- Session management with JWT tokens

### 💬 Live Counsel
- Real-time legal AI chat powered by Gemini
- Jurisdiction-aware responses based on user's location
- Markdown-formatted legal advice
- Chat history within session

### 📄 Ghost Vault
- Upload and analyze legal documents (PDF, images, text)
- Zero-retention policy - files are immediately deleted after analysis
- Comprehensive document breakdown and risk assessment

### 📝 Contract Forge
- **Generate Contracts** - Describe your needs, get a professional contract
- **Scan Contracts** - Upload existing contracts for AI review
- **PDF Export** - Download generated contracts as PDF

### 📱 Responsive Design
- Mobile-optimized with hamburger menu navigation
- Elegant dark theme with navy/gold accent colors
- Smooth animations with Framer Motion
- 3D prism animation background

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **AI** | Google Gemini AI |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT + bcrypt |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **PDF Generation** | html2pdf.js |
| **Email** | Nodemailer (OTP) |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Google Gemini API key

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_email_password
PORT=your_port
```

### Installation

```bash
# Clone the repository
git clone https://github.com/sam-eer12/gemini-hackahton.git

# Navigate to project directory
cd gemini-hackahton

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Chat with Gemini
│   │   ├── analyze/      # Document analysis
│   │   ├── forge/        # Contract generation
│   │   └── scan/         # Contract scanning
│   ├── chat/             # Live Counsel page
│   ├── vault/            # Ghost Vault page
│   ├── contracts/        # Contract Forge page
│   ├── contact/          # Contact page
│   ├── terms/            # Terms & Conditions
│   └── about/            # About page
├── components/
│   ├── AuthModal.tsx     # Login/Signup modal
│   ├── Navbar.tsx        # Responsive navigation
│   ├── Sidebar.tsx       # Dashboard sidebar
│   └── Contact.tsx       # Contact form
├── models/
│   └── User.ts           # MongoDB User schema
└── lib/
    ├── db.ts             # Database connection
    └── auth.ts           # Authentication utilities
```

## ⚠️ Disclaimer

AMICUS.AI is an artificial intelligence system. It is **not a licensed attorney**, and no attorney-client privilege is established. All strategic output should be verified by human counsel before executing binding legal actions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Sameer Gupta**
- GitHub: [@sam-eer12](https://github.com/sam-eer12)
- Email: sameer870732@gmail.com

---

<p align="center">
  <strong>AMICUS.AI</strong> — Intelligent Legal Systems
</p>
