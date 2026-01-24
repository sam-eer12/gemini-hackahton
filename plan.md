# Project: Amicus AI (The "Law Firm" of the Future)

## 1. Project Overview
We are building a Next.js application that *looks* like a high-end, sophisticated law firm website (based on the Wolfpixel aesthetic) but functions as an interface for **Gemini 3 API Agents**.

**Core Philosophy:**
* **Jurisdiction-Aware:** Advice is specific to the user's Country and State.
* **Zero-Retention Privacy:** Client documents are analyzed in real-time and never stored permanently.
* **Plain English:** No legalese. Direct, unbiased, simple answers.

## 2. Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Database:** MongoDB (via Mongoose) - Stores user profiles (jurisdiction settings) and chat *text* logs only.
* **AI Engine:** Google Gemini 3 API (Multimodal: Vision, Text, Logic).
* **File Handling:** **Transient Processing Only**. Files are streamed to Gemini for analysis and immediately discarded from memory. No S3/Blob storage for sensitive user docs.
* **Styling:** Tailwind CSS + Framer Motion (Wolfpixel "High-Trust" aesthetic).

## 3. Design Directive (The "Wolfpixel" Aesthetic)
* **Visuals:** Deep Navy/Charcoal backgrounds, Serif typography (Playfair Display), Gold accents.
* **Tone:** Authoritative yet accessible.
* **Layout:** "Bento Grid" for services, large "Hero" typography, sticky "Book Consultation" (Chat) button.
* **Design Referance:** "https://dribbble.com/shots/25684898-Law-Firm-Website-Design?utm_source=Clipboard_Shot&utm_campaign=wolfpixelagency&utm_content=Law%20Firm%20Website%20Design&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=wolfpixelagency&utm_content=Law%20Firm%20Website%20Design&utm_medium=Social_Share"

## 4. User Journey & Features

### Feature A: The "Jurisdictional" Onboarding (Sign Up)
* **Flow:**
    1.  User signs up (Email/Pass).
    2.  **Mandatory Selection:** Country (e.g., India) and State/Province (e.g., Delhi).
    3.  **T&C Gate:** A distinct "Terms of Engagement" page that user must accept, clarifying this is AI advice, not a human attorney.
* **System Impact:** These location variables are injected into *every* system prompt so Gemini quotes relevant local laws (e.g., BNS for India vs. IPC, or GDPR for Europe).

### Feature B: "Live Counsel" (Chat Interface)
* **Tech:** Gemini Live (Chat Mode).
* **Behavior:**
    * **Directness:** System instruction to avoid "I am an AI language model" fluff. Give straight answers.
    * **Simplicity:** Explain complex laws in "5th-grade" terms.
    * **Neutrality:** Pure objective legal logic, no moralizing or bias.

### Feature C: The "Ghost" Vault (Document Analysis)
* **Capabilities:**
    * **Uploads:** Photos (OCR of handwritten notes/tickets), PDFs (Court orders), Spreadsheets (Financials/Divorce assets).
    * **Mechanism:** `File -> Stream to Gemini -> Analyze -> Delete File`.
* **Privacy Promise:** "We read it once, then burn the copy."

### Feature D: "Deep Research" Bureau
* **Trigger:** User asks a complex question (e.g., "Is my non-compete valid if I was fired without cause in California?").
* **Gemini 3 Role:**
    * Activates **Deep Think** mode.
    * Scans recent case law precedents.
    * Outputs a "Memo" citing specific statutes and probability of success.

### Feature E: Contract Suite
* **Tool 1: Contract Forge (Maker):**
    * User inputs: "I need a freelance design contract for a client in New York, 50% upfront."
    * Output: A perfectly formatted Markdown contract ready to download.
* **Tool 2: Red Flag Scanner (Analysis):**
    * User uploads a contract.
    * Gemini highlights "trap" clauses (e.g., "Indefinite Indemnity") in red and explains *why* it's bad in simple English.

## 5. Implementation Steps for Antigravity Agent

**Phase 1: Foundation & Auth**
1.  Setup Next.js + MongoDB.
2.  Build **Onboarding Form**: Capture `jurisdiction_country` and `jurisdiction_state` in the User Schema.
3.  Build **T&C Page**: Simple, elegant typography page with a "I Understand" checkbox.

**Phase 2: The Core "Live Counsel" Chat**
1.  Create the Chat UI (resembling a secure messaging app).
2.  **Prompt Engineering:**
    ```text
    SYSTEM_PROMPT: You are Amicus, an elite legal strategist.
    CONTEXT: User is in {User.Country}, {User.State}. Apply local laws.
    TONE: Direct, Unbiased, Simple. No fluff.
    RESTRICTION: Do not offer moral judgment, only legal strategy.
    ```

**Phase 3: The "Ghost" File System**
1.  Implement the File Upload component.
2.  Write the API route that accepts the file `Buffer`, sends it to `generative-ai` API, and explicitly ensures no disk write occurs.

**Phase 4: Contract Tools**
1.  Create the "Split View" interface for Contract Analysis (Document on left, AI Comments on right).
2.  Implement the PDF generation library to export created contracts.