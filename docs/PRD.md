# PRODUCT REQUIREMENTS DOCUMENT: DYLAN IS SABAI (DIS) MVP
**Version:** 1.0.0 | **Target:** UK Market Dominance

## 1. PRODUCT VISION
DIS is a Universal Label-as-a-Service (LaaS) platform for UK independent musicians. It automates tax compliance (HMRC MTD 2026), translates legal jargon via AI, automates touring logistics (ATA Carnets), and ensures perfect metadata collection. It replaces the traditional predatory record label with automated software infrastructure.

## 2. CORE FEATURES (MVP ARCHITECTURE)

### Feature 1: The Intelligence Command (Dashboard)
- **Function:** The central hub and portal.
- **UI Elements:** 
  - Massive, glowing typography displaying real-time "Spendable Cash".
  - A clean sidebar mapping to: Tax Quarter-Master, Legal AI, Carnet Scanner, AI Syndicate.
  - Recent transactions feed pulled from Open Banking, automatically categorized.

### Feature 2: The MTD Quarter-Master (Tax Vault)
- **Function:** Solves the April 2026 UK Making Tax Digital mandate.
- **Flow:** 
  1. Ingests bank feed via TrueLayer/Plaid API.
  2. Algorithm categorizes income vs. allowable music expenses.
  3. Calculates estimated tax liability based on UK brackets.
  4. Sweeps the liability into a visual "Tax Vault".
  5. UI shows a timeline of the 5 mandatory HMRC submissions, which execute autonomously.

### Feature 3: The AI Legal Interpreter
- **Function:** Drag-and-drop PDF reader for dense music contracts.
- **Flow:**
  1. User drops a PDF (e.g., a Record Deal or Sync License).
  2. UI shows a "scanning" animation in Anodized Gold.
  3. LLM parses the document and outputs "3 Sabai Points": 
     - [ THE MONEY ]: Upfront cash vs hidden recoupment.
     - [ THE TRAP ]: Predatory clauses (e.g., in perpetuity, AI training rights).
     - [ THE FIX ]: Auto-generated counter-offer.

### Feature 4: Borderless Carnet Vision
- **Function:** Automates ATA Carnet customs documents for EU touring.
- **Flow:**
  1. User uploads images of hardware/instruments.
  2. Cloud Vision OCR extracts Make, Model, and Serial Number.
  3. System assigns correct HS Customs Codes.
  4. Generates a downloadable, perfectly formatted PDF ready for customs.

## 3. DATABASE SCHEMA (SUPABASE PostgreSQL)
- `users`: id (uuid), email, artist_name, stripe_customer_id, created_at.
- `transactions`: id, user_id (fk), amount, type (income/expense), category, is_tax_deductible.
- `ledgers`: id, user_id (fk), total_balance, tax_vault_reserve, spendable_cash.
- `contracts`: id, user_id (fk), document_name, ai_summary_json, uploaded_at.
- `gear`: id, user_id (fk), make, model, serial_number, hs_code.

## 4. USER JOURNEY (THE "SABAI STATE" ONBOARDING)
1. **Landing:** Obsidian Black screen. Gold text. "The System is automated. The Feeling is effortless."
2. **Auth:** Secure login via Supabase Auth.
3. **Connect:** Plaid/TrueLayer modal to securely link business accounts.
4. **Reveal:** The system calculates their tax liability retroactively and displays their true Spendable Cash. The "Sabai State" is achieved.