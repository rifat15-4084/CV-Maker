/**
 * Legal copy is kept here so the privacy and terms pages stay readable.
 * `LAST_UPDATED` is rendered as an ISO date in the page metadata.
 */
export const LEGAL_LAST_UPDATED = "2026-08-01";
export const LEGAL_LAST_UPDATED_LABEL = "1 August 2026";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "CVForge is a free online CV builder. References to “CVForge”, “we”, “us” and “our” mean the CVForge service and its operators. References to “you” mean the person using the service.",
      "This policy explains what personal data we collect, why we collect it, where it is stored and what rights you have over it.",
    ],
  },
  {
    heading: "Data we collect",
    paragraphs: [
      "CVForge runs entirely in your browser and collects nothing on our side. The information below never leaves your device:",
    ],
    bullets: [
      "Account data: your email address, your name, and your password stored only as a salted PBKDF2-SHA-256 hash — never in plain text.",
      "CV data: the structured content you enter into the editor — names, contact details, employment history, education, skills, and any photo you upload.",
      "Contact messages: kept briefly in local storage as a draft before the form hands off to your own email client.",
    ],
  },
  {
    heading: "How we use your data",
    bullets: [
      "To unlock your account and verify your password locally when you sign in.",
      "To store, retrieve and render your CVs so you can edit and download them.",
      "To lay out your PDF export in the browser when you request a download.",
    ],
    paragraphs: [
      "We do not sell your personal data, we do not use your CV content for advertising, and we do not use it to train machine-learning models. We cannot access your data at all.",
    ],
  },
  {
    heading: "Where your data is stored",
    paragraphs: [
      "CVForge has no server of its own. Your account, your CVs and your uploaded photos are stored only in your own browser — accounts and CV documents in the browser's local storage, and images in the browser's IndexedDB database. Nothing is transmitted to us or to any third party.",
      "Because the data never leaves your device, we cannot read it, recover it or restore it for you. Clearing your browser data, using private browsing, or switching device or browser will hide your CVs. The dashboard has an export button so you can keep your own backup, and an import button to restore one.",
    ],
  },
  {
    heading: "Cookies and local storage",
    paragraphs: [
      "We do not use cookies and we do not run any analytics or tracking scripts.",
      "We use your browser's local storage to keep you signed in and to hold your CV documents, and IndexedDB for images. We also store small preferences such as your light or dark theme choice. All of this is essential to how the app works and stays on your device.",
    ],
  },
  {
    heading: "Third parties",
    paragraphs: [
      "We do not share data with third parties, because no data is collected to share. Your CVs are never sent to us, so there is nothing for us to pass on.",
      "The only outbound interaction in the app is the contact form, which opens a pre-filled email in your own mail client for you to send yourself.",
    ],
  },
  {
    heading: "Retention",
    paragraphs: [
      "Your account data and CVs are retained for as long as your account exists. You can delete individual CVs at any time from your dashboard, and you can delete your entire account from Settings, which permanently removes your profile, CVs, uploaded files and login.",
      "Contact-form messages are retained for as long as needed to handle your enquiry and for a reasonable period afterwards for record-keeping.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to access, correct, export, restrict or erase your personal data, and to object to certain processing. You can exercise all of these directly and immediately, without asking us: export every CV as JSON from the dashboard, edit any detail inline, and delete your account from Settings.",
      "Because we never receive your data, there is no request to file and nothing for us to action on our side.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "CVForge is not directed at children under 16. We do not knowingly collect personal data from children, and in this build we are not able to collect anything from anyone.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy as the service evolves. Material changes will be reflected by an updated “last updated” date at the top of this page. Continued use of CVForge after a change constitutes acceptance of the revised policy.",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "Agreement to these terms",
    paragraphs: [
      "By creating an account or using CVForge you agree to these terms of service. If you do not agree, please do not use the service.",
    ],
  },
  {
    heading: "Your account",
    bullets: [
      "You must provide a valid email address and keep your login credentials secure.",
      "You are responsible for all activity that occurs under your account.",
      "You must be at least 16 years old to create an account.",
      "One account per person; do not share accounts or resell access.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: ["You agree not to:"],
    bullets: [
      "Submit content that is unlawful, defamatory, fraudulent or infringes another person's rights.",
      "Impersonate another person or misrepresent your qualifications in a way that constitutes fraud.",
      "Attempt to breach, probe or overload the service, or access data belonging to other users.",
      "Upload malware, or use automated means to scrape or bulk-download the service.",
      "Use CVForge to send spam through the contact form or any other channel.",
    ],
  },
  {
    heading: "Your content",
    paragraphs: [
      "You retain all rights to the content you enter into CVForge. Because the app runs in your browser, your content never reaches us and we never hold a copy of it — so no licence to store or process it is granted or needed.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      "The CVForge name, interface, template designs and underlying code are owned by us or our licensors and are protected by intellectual property law. You may use the templates to create and distribute your own CVs freely; you may not resell or redistribute the templates themselves as a product.",
    ],
  },
  {
    heading: "Availability",
    paragraphs: [
      "The service is provided on an “as is” and “as available” basis and runs entirely in your browser. Its behaviour therefore also depends on your browser, device and available storage, which we do not control.",
      "Your CV data is stored in your own browser, not on our servers, so you are responsible for keeping your own copies of anything important — downloading a PDF or exporting the JSON backup from the dashboard is the safest way to do that.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, CVForge is not liable for indirect, incidental or consequential losses, loss of data, or lost opportunities arising from your use of the service. Nothing in these terms excludes liability that cannot lawfully be excluded.",
    ],
  },
  {
    heading: "Termination",
    paragraphs: [
      "You may stop using CVForge and delete your account at any time from Settings. We may suspend or terminate access if these terms are breached, if required by law, or to protect the service and its users.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws applicable in the jurisdiction in which CVForge is operated, without regard to conflict-of-law rules. Nothing here removes any mandatory consumer protections available to you locally.",
    ],
  },
];
