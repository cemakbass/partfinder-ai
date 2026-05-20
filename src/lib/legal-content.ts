import { COMPANY_NAME, SUPPORT_EMAIL } from "@/lib/site-config";

export const LEGAL_LAST_UPDATED = "May 20, 2026";

export const privacySections = [
  {
    title: "Overview",
    body: `${COMPANY_NAME} ("we", "us") operates the PartFinder AI website and application at avtopartfinder.com. This Privacy Policy explains how we collect, use, and protect information when you use our service in the United States and elsewhere.`
  },
  {
    title: "Information we collect",
    body: `We collect: (1) account information such as email address when you register; (2) photos you upload for part identification; (3) optional vehicle details (make, model, year); (4) usage data including search counts and plan type; (5) technical data such as IP-derived country, browser type, and pages visited via cookies and similar technologies; (6) payment-related identifiers processed by Stripe (we do not store full card numbers).`
  },
  {
    title: "How we use information",
    body: `We use your information to provide and improve the service, run AI-based part analysis, enforce plan limits, process subscriptions, prevent abuse, respond to support requests, and comply with law. We do not sell your personal information.`
  },
  {
    title: "AI and third-party services",
    body: `Part images and related text are sent to AI providers (e.g. Anthropic) for analysis. Hosting and database services (e.g. Vercel, Supabase) store account and search data. Payments are handled by Stripe. Each provider has its own privacy policy.`
  },
  {
    title: "Data retention",
    body: `Account data is kept while your account is active. Search history and uploaded images are retained to provide history features unless deleted or required by law. Shared report links expire after 7 days by default.`
  },
  {
    title: "Your choices",
    body: `You may access, update, or delete your account by contacting us. You can opt out of non-essential cookies via browser settings. California residents may have additional rights under the CCPA; contact us to exercise them.`
  },
  {
    title: "Security",
    body: `We use industry-standard measures including HTTPS, access controls, and private storage for images. No method of transmission over the Internet is 100% secure.`
  },
  {
    title: "Children",
    body: `The service is not directed to children under 13. We do not knowingly collect data from children.`
  },
  {
    title: "Changes",
    body: `We may update this policy. We will post the new date at the top of this page. Continued use after changes means you accept the updated policy.`
  },
  {
    title: "Contact",
    body: `Questions: ${SUPPORT_EMAIL}`
  }
];

export const termsSections = [
  {
    title: "Agreement",
    body: `By creating an account or using ${COMPANY_NAME}, you agree to these Terms of Service. If you do not agree, do not use the service.`
  },
  {
    title: "Service description",
    body: `${COMPANY_NAME} provides AI-assisted automotive part identification from photos. Results include suggested part names, OEM-style codes, fitment hints, and links to third-party retailers. The service is for research and reference only — not professional repair, safety, or warranty advice.`
  },
  {
    title: "Accounts",
    body: `You must provide accurate information and keep your password secure. You are responsible for activity under your account. We may suspend accounts for abuse, fraud, or violation of these terms.`
  },
  {
    title: "Subscriptions and billing",
    body: `Paid plans renew monthly via Stripe until canceled. Fees are in USD. You may manage or cancel your subscription through the billing portal. Refunds are handled according to Stripe and our support policy unless required by law.`
  },
  {
    title: "Acceptable use",
    body: `You may not: reverse engineer the service; scrape or overload our systems; upload unlawful content; share account credentials; or use the service to misrepresent AI output as guaranteed OEM or safety certification.`
  },
  {
    title: "Disclaimer of warranties",
    body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE ACCURACY OF PART IDENTIFICATION, FITMENT, PRICING, OR AVAILABILITY FROM RETAILERS.`
  },
  {
    title: "Limitation of liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR DAMAGES ARISING FROM RELIANCE ON AI OUTPUT, WRONG PARTS ORDERED, OR VEHICLE DAMAGE. OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM.`
  },
  {
    title: "Indemnity",
    body: `You agree to indemnify us against claims arising from your misuse of the service or violation of these terms.`
  },
  {
    title: "Governing law",
    body: `These terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law rules, except where mandatory consumer protections apply in your state.`
  },
  {
    title: "Contact",
    body: `Questions: ${SUPPORT_EMAIL}`
  }
];
