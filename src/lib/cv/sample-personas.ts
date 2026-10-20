import type { CVData, SectionKey } from "./schema";
import type { TemplateCategory } from "@/templates/types";
import { createEmptyCVData, newId } from "./defaults";

/* ==========================================================================
   Sample personas for template previews & thumbnails.

   A single sample CV makes every template in the gallery look alike, because
   the eye reads the *content* before the layout. These personas give each
   template family realistic content that suits it, so a Tech template shows
   engineering work and an Academic template shows publications.

   Personas are grouped by template category, so `personaForTemplate(category)`
   always has something sensible to return.
   ========================================================================== */

export type PersonaId = "designer" | "engineer" | "nurse" | "marketer" | "academic" | "executive";

export interface SamplePersona {
  id: PersonaId;
  label: string;
  /** Template categories this persona suits best. */
  categories: TemplateCategory[];
  data: CVData;
}

const ALL_SECTIONS: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "references",
  "hobbies",
  "custom",
];

/** Base document with every section enabled in a conventional order. */
function base(sectionOrder: SectionKey[] = ALL_SECTIONS) {
  return createEmptyCVData({ sectionOrder });
}

/* ------------------------------- personas -------------------------------- */

function designer(): CVData {
  const doc = base();
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Amara",
      lastName: "Okafor",
      jobTitle: "Senior Product Designer",
      email: "amara.okafor@example.com",
      phone: "+1 (415) 555-0134",
      address: "San Francisco, CA",
      website: "amaraokafor.design",
      linkedin: "linkedin.com/in/amaraokafor",
      github: "",
      tagline: "Designing calm, accessible products used by millions.",
      extraLinks: [
        { id: newId(), label: "Dribbble", url: "dribbble.com/amaraokafor" },
        { id: newId(), label: "Behance", url: "behance.net/amaraokafor" },
      ],
    },
    summary:
      "Product designer with 8+ years of experience turning complex workflows into simple, delightful interfaces. Led design systems and end-to-end product design for fintech and health-tech teams, partnering closely with engineering and research to ship measurable improvements.",
    experience: [
      {
        id: newId(),
        role: "Senior Product Designer",
        company: "Northwind Labs",
        location: "San Francisco, CA",
        employmentType: "full-time",
        startDate: "2022-03",
        endDate: "",
        current: true,
        description: "Design lead for the payments platform used by 1.2M monthly users.",
        bullets: [
          "Redesigned onboarding, lifting activation from 41% to 63% in two quarters.",
          "Built and maintain a 120-component design system adopted by 6 product teams.",
          "Mentor 4 designers and run weekly critique and research readouts.",
        ],
      },
      {
        id: newId(),
        role: "Product Designer",
        company: "Cobalt Health",
        location: "Remote",
        employmentType: "full-time",
        startDate: "2019-06",
        endDate: "2022-02",
        current: false,
        description: "Owned the patient-facing mobile experience end to end.",
        bullets: [
          "Shipped a triage flow that cut support tickets by 28%.",
          "Ran 60+ usability sessions and turned findings into a prioritised roadmap.",
        ],
      },
      {
        id: newId(),
        role: "UI/UX Designer",
        company: "Pixel & Type Studio",
        location: "Lagos, Nigeria",
        employmentType: "contract",
        startDate: "2017-01",
        endDate: "2019-05",
        current: false,
        description: "Delivered brand and web design for 20+ client projects.",
        bullets: ["Designed and launched 15 marketing sites averaging a 94 Lighthouse score."],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "B.Sc. Human-Computer Interaction",
        degreeLevel: "bachelor",
        field: "Computer Science",
        school: "University of Lagos",
        location: "Lagos, Nigeria",
        startDate: "2013-09",
        endDate: "2017-06",
        current: false,
        grade: "First Class Honours",
        description: "",
        bullets: [],
      },
    ],
    skills: [
      { id: newId(), name: "Design Systems", category: "Design", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Figma", category: "Tools", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Prototyping", category: "Design", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "User Research", category: "Research", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Accessibility (WCAG)", category: "Design", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "HTML & CSS", category: "Engineering", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Workshop Facilitation", category: "Leadership", level: 5, showBar: true, extra: "" },
    ],
    projects: [
      {
        id: newId(),
        name: "Atlas Design System",
        role: "Creator & maintainer",
        link: "github.com/amaraokafor/atlas",
        tech: "Figma, Style Dictionary, React",
        startDate: "2022-05",
        endDate: "",
        description: "Open-source multi-brand design system with light and dark themes.",
        bullets: ["4.8k stars and 60+ contributors.", "Token pipeline generates web, iOS and Android themes."],
      },
      {
        id: newId(),
        name: "CareLoop",
        role: "Product designer",
        link: "careloop.app",
        tech: "Figma, React Native",
        startDate: "2020-02",
        endDate: "2021-11",
        description: "Community health app connecting volunteers with clinics.",
        bullets: ["Featured by Apple in Apps We Love."],
      },
    ],
    certifications: [
      {
        id: newId(),
        name: "Certified Usability Analyst (CUA)",
        issuer: "Human Factors International",
        date: "2021-04",
        credentialId: "CUA-88421",
        url: "",
      },
      {
        id: newId(),
        name: "Google UX Design Professional Certificate",
        issuer: "Coursera",
        date: "2020-09",
        credentialId: "",
        url: "",
      },
    ],
    languages: [
      { id: newId(), name: "English", level: "native", detail: "" },
      { id: newId(), name: "Igbo", level: "native", detail: "" },
      { id: newId(), name: "French", level: "professional-working", detail: "" },
    ],
    awards: [
      {
        id: newId(),
        title: "Best in Show — FinTech Design Awards",
        issuer: "FinTech Design Awards",
        date: "2023-11",
        description: "Recognised for the Northwind payments redesign.",
      },
    ],
    references: [
      {
        id: newId(),
        name: "Daniel Reyes",
        role: "VP of Product",
        company: "Northwind Labs",
        contact: "daniel.reyes@example.com",
        relationship: "Direct manager",
      },
    ],
    hobbies: [
      { id: newId(), name: "Trail running" },
      { id: newId(), name: "Film photography" },
      { id: newId(), name: "Pottery" },
    ],
    extra: {
      tagline: "Designing calm, accessible products used by millions.",
      showPhoto: true,
      skillBars: true,
      socialIcons: true,
      showQr: false,
    },
  };
}

function engineer(): CVData {
  const doc = base([
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "languages",
    "awards",
    "hobbies",
  ]);
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Rahul",
      lastName: "Mehta",
      jobTitle: "Senior Backend Engineer",
      email: "rahul.mehta@example.com",
      phone: "+44 20 7946 0812",
      address: "London, United Kingdom",
      website: "rahulmehta.dev",
      linkedin: "linkedin.com/in/rahulmehta",
      github: "github.com/rahulmehta",
      tagline: "Distributed systems, boring reliability, fast feedback loops.",
      extraLinks: [{ id: newId(), label: "Stack Overflow", url: "stackoverflow.com/users/rahulmehta" }],
    },
    summary:
      "Backend engineer with 9 years building high-throughput distributed systems in Go, Rust and Python. Specialises in observability, event-driven architecture and cutting p99 latency without sacrificing correctness. Comfortable owning a service from design review through on-call.",
    experience: [
      {
        id: newId(),
        role: "Senior Backend Engineer",
        company: "Ledgerline",
        location: "London, UK",
        employmentType: "full-time",
        startDate: "2021-08",
        endDate: "",
        current: true,
        description: "Tech lead for the payments ledger processing 40M events/day.",
        bullets: [
          "Cut p99 write latency from 840ms to 120ms by reworking the batching layer.",
          "Introduced Kafka-based outbox pattern, eliminating 99.9% of dual-write inconsistencies.",
          "Owned the migration from a monolith to 14 services with zero customer downtime.",
        ],
      },
      {
        id: newId(),
        role: "Backend Engineer",
        company: "Ferrous Cloud",
        location: "Berlin, Germany",
        employmentType: "full-time",
        startDate: "2018-02",
        endDate: "2021-07",
        current: false,
        description: "Built multi-tenant infrastructure APIs for a B2B SaaS platform.",
        bullets: [
          "Designed a quota service handling 12k req/s with Redis-backed sliding windows.",
          "Reduced cloud spend 34% by right-sizing and consolidating batch workers.",
        ],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "M.Sc. Distributed Computing",
        degreeLevel: "master",
        field: "Computer Science",
        school: "Imperial College London",
        location: "London, UK",
        startDate: "2016-09",
        endDate: "2017-09",
        current: false,
        grade: "Distinction",
        description: "",
        bullets: [],
      },
    ],
    skills: [
      { id: newId(), name: "Go", category: "Backend", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Rust", category: "Backend", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "PostgreSQL", category: "Data", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Kafka", category: "Data", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Kubernetes", category: "DevOps", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Terraform", category: "DevOps", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "OpenTelemetry", category: "Observability", level: 4, showBar: true, extra: "" },
    ],
    projects: [
      {
        id: newId(),
        name: "riverbed",
        role: "Author",
        link: "github.com/rahulmehta/riverbed",
        tech: "Rust, Tokio, RocksDB",
        startDate: "2023-01",
        endDate: "",
        description: "Embedded append-only event log with a pluggable compaction strategy.",
        bullets: ["2.1k stars.", "Used in production by two fintech startups."],
      },
      {
        id: newId(),
        name: "querylens",
        role: "Author",
        link: "github.com/rahulmehta/querylens",
        tech: "Go, pg_stat_statements",
        startDate: "2021-03",
        endDate: "2021-12",
        description: "CLI that grades slow Postgres queries and suggests indexes.",
        bullets: ["Adopted by 300+ developers."],
      },
    ],
    certifications: [
      {
        id: newId(),
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "CNCF",
        date: "2022-06",
        credentialId: "CKA-2022-4471",
        url: "",
      },
      {
        id: newId(),
        name: "AWS Solutions Architect — Professional",
        issuer: "Amazon Web Services",
        date: "2021-02",
        credentialId: "",
        url: "",
      },
    ],
    languages: [
      { id: newId(), name: "English", level: "full-professional", detail: "" },
      { id: newId(), name: "Hindi", level: "native", detail: "" },
      { id: newId(), name: "German", level: "limited-working", detail: "" },
    ],
    awards: [
      {
        id: newId(),
        title: "Engineering Excellence Award",
        issuer: "Ledgerline",
        date: "2023-12",
        description: "For the zero-downtime monolith migration.",
      },
    ],
    hobbies: [
      { id: newId(), name: "Bouldering" },
      { id: newId(), name: "Mechanical keyboards" },
      { id: newId(), name: "Coffee roasting" },
    ],
    extra: {
      tagline: "Distributed systems, boring reliability, fast feedback loops.",
      showPhoto: false,
      skillBars: true,
      socialIcons: true,
      showQr: true,
    },
  };
}

function nurse(): CVData {
  const doc = base([
    "summary",
    "experience",
    "education",
    "certifications",
    "skills",
    "languages",
    "awards",
    "references",
  ]);
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Grace",
      lastName: "Adeyemi",
      jobTitle: "Registered Nurse — Critical Care",
      email: "grace.adeyemi@example.com",
      phone: "+1 (312) 555-0188",
      address: "Chicago, IL",
      website: "",
      linkedin: "linkedin.com/in/graceadeyemi",
      github: "",
      tagline: "Patient-first critical care with a calm, evidence-based approach.",
      extraLinks: [],
    },
    summary:
      "Registered Nurse with 7 years of critical care experience across ICU and step-down units. Skilled in ventilator management, hemodynamic monitoring and rapid-response escalation. Known for mentoring new graduates and improving handover safety.",
    experience: [
      {
        id: newId(),
        role: "Registered Nurse — ICU",
        company: "Mercy Central Hospital",
        location: "Chicago, IL",
        employmentType: "full-time",
        startDate: "2020-04",
        endDate: "",
        current: true,
        description: "Day-shift ICU nurse in a 24-bed mixed medical-surgical unit.",
        bullets: [
          "Manage 2–3 ventilated patients per shift with a zero unplanned-extubation record.",
          "Co-authored the unit's sepsis bundle checklist, cutting time-to-antibiotics by 22 minutes.",
          "Precept 6 new graduate nurses per year through their ICU orientation.",
        ],
      },
      {
        id: newId(),
        role: "Registered Nurse — Step-Down",
        company: "Lakeshore Medical Center",
        location: "Evanston, IL",
        employmentType: "full-time",
        startDate: "2017-06",
        endDate: "2020-03",
        current: false,
        description: "Telemetry and post-operative recovery for cardiac patients.",
        bullets: [
          "Monitored 5–6 patients per shift with continuous telemetry interpretation.",
          "Led the unit's falls-prevention initiative, reducing falls by 41% year over year.",
        ],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "B.S.N. Nursing",
        degreeLevel: "bachelor",
        field: "Nursing",
        school: "University of Illinois Chicago",
        location: "Chicago, IL",
        startDate: "2013-08",
        endDate: "2017-05",
        current: false,
        grade: "Magna Cum Laude",
        description: "",
        bullets: [],
      },
    ],
    certifications: [
      {
        id: newId(),
        name: "Critical Care Registered Nurse (CCRN)",
        issuer: "AACN",
        date: "2022-03",
        credentialId: "CCRN-118842",
        url: "",
      },
      {
        id: newId(),
        name: "Advanced Cardiac Life Support (ACLS)",
        issuer: "American Heart Association",
        date: "2024-01",
        credentialId: "",
        url: "",
      },
      {
        id: newId(),
        name: "Registered Nurse Licensure — Illinois",
        issuer: "Illinois Board of Nursing",
        date: "2017-07",
        credentialId: "RN-041-229871",
        url: "",
      },
    ],
    skills: [
      { id: newId(), name: "Ventilator Management", category: "Clinical", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Hemodynamic Monitoring", category: "Clinical", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "ACLS / BLS", category: "Emergency", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Epic EHR", category: "Systems", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Patient Education", category: "Care", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Preceptorship", category: "Leadership", level: 4, showBar: true, extra: "" },
    ],
    languages: [
      { id: newId(), name: "English", level: "native", detail: "" },
      { id: newId(), name: "Yoruba", level: "native", detail: "" },
      { id: newId(), name: "Spanish", level: "professional-working", detail: "" },
    ],
    awards: [
      {
        id: newId(),
        title: "DAISY Award for Extraordinary Nurses",
        issuer: "Mercy Central Hospital",
        date: "2023-05",
        description: "Nominated by three patient families in the same quarter.",
      },
    ],
    references: [
      {
        id: newId(),
        name: "Karen Whitfield",
        role: "Nurse Manager, ICU",
        company: "Mercy Central Hospital",
        contact: "karen.whitfield@example.com",
        relationship: "Direct supervisor",
      },
    ],
    extra: { showPhoto: true, skillBars: true, licenseBlock: true, socialIcons: false },
  };
}

function marketer(): CVData {
  const doc = base([
    "summary",
    "experience",
    "skills",
    "projects",
    "education",
    "certifications",
    "awards",
    "languages",
    "hobbies",
  ]);
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Sofia",
      lastName: "Marchetti",
      jobTitle: "Growth Marketing Lead",
      email: "sofia.marchetti@example.com",
      phone: "+1 (646) 555-0119",
      address: "New York, NY",
      website: "sofiamarchetti.com",
      linkedin: "linkedin.com/in/sofiamarchetti",
      github: "",
      tagline: "Full-funnel growth: positioning, paid, lifecycle and analytics.",
      extraLinks: [{ id: newId(), label: "Substack", url: "sofia.substack.com" }],
    },
    summary:
      "Growth marketing lead with 8 years scaling B2C and B2B funnels from early traction to eight figures in ARR. Equal parts creative and analytical: runs the brand narrative and the experiment backlog. Fluent in SQL, attribution modelling and lifecycle automation.",
    experience: [
      {
        id: newId(),
        role: "Growth Marketing Lead",
        company: "Harbourlight",
        location: "New York, NY",
        employmentType: "full-time",
        startDate: "2021-09",
        endDate: "",
        current: true,
        description: "Own paid acquisition, lifecycle and conversion rate optimisation.",
        bullets: [
          "Scaled paid acquisition from $40k to $310k monthly spend at a stable 4.1x LTV:CAC.",
          "Rebuilt onboarding lifecycle emails, lifting week-1 activation 18 points.",
          "Ran 140+ experiments in two years with a 31% win rate.",
        ],
      },
      {
        id: newId(),
        role: "Performance Marketing Manager",
        company: "Vela Commerce",
        location: "Remote",
        employmentType: "full-time",
        startDate: "2018-03",
        endDate: "2021-08",
        current: false,
        description: "Managed multi-channel acquisition for a DTC marketplace.",
        bullets: [
          "Cut blended CAC 27% by shifting budget to incrementality-tested channels.",
          "Built the attribution dashboard used weekly by the exec team.",
        ],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "B.A. Economics & Marketing",
        degreeLevel: "bachelor",
        field: "Economics",
        school: "Bocconi University",
        location: "Milan, Italy",
        startDate: "2010-09",
        endDate: "2014-07",
        current: false,
        grade: "110/110 cum laude",
        description: "",
        bullets: [],
      },
    ],
    skills: [
      { id: newId(), name: "Paid Acquisition", category: "Growth", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Conversion Optimisation", category: "Growth", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Lifecycle & CRM", category: "Growth", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "SQL & Analytics", category: "Data", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Brand Positioning", category: "Creative", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Team Leadership", category: "Leadership", level: 4, showBar: true, extra: "" },
    ],
    projects: [
      {
        id: newId(),
        name: "Harbourlight Referral Engine",
        role: "Project lead",
        link: "",
        tech: "Braze, Segment, Amplitude",
        startDate: "2022-06",
        endDate: "2022-12",
        description: "Double-sided referral programme covering 23% of new signups.",
        bullets: ["Payback period improved from 9 to 5 months."],
      },
    ],
    certifications: [
      {
        id: newId(),
        name: "Google Analytics 4 Certification",
        issuer: "Google",
        date: "2023-02",
        credentialId: "",
        url: "",
      },
      {
        id: newId(),
        name: "Reforge Growth Series",
        issuer: "Reforge",
        date: "2021-05",
        credentialId: "",
        url: "",
      },
    ],
    languages: [
      { id: newId(), name: "Italian", level: "native", detail: "" },
      { id: newId(), name: "English", level: "full-professional", detail: "" },
      { id: newId(), name: "Spanish", level: "limited-working", detail: "" },
    ],
    awards: [
      {
        id: newId(),
        title: "Growth Team of the Year",
        issuer: "MarTech Awards",
        date: "2023-10",
        description: "For the referral programme and lifecycle overhaul.",
      },
    ],
    hobbies: [
      { id: newId(), name: "Marathon running" },
      { id: newId(), name: "Wine tasting" },
      { id: newId(), name: "Podcasting" },
    ],
    extra: {
      kpiStrip: true,
      skillBars: true,
      showPhoto: false,
      tagline: "Full-funnel growth: positioning, paid, lifecycle and analytics.",
    },
  };
}

function academic(): CVData {
  const doc = base([
    "summary",
    "experience",
    "education",
    "projects",
    "awards",
    "skills",
    "languages",
    "references",
  ]);
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Dr. Helena",
      lastName: "Vasquez",
      jobTitle: "Associate Professor, Computational Biology",
      email: "h.vasquez@university.edu",
      phone: "+1 (617) 555-0155",
      address: "Cambridge, MA",
      website: "vasquezlab.org",
      linkedin: "",
      github: "github.com/hvasquez",
      tagline: "Machine learning for single-cell genomics.",
      extraLinks: [{ id: newId(), label: "Google Scholar", url: "scholar.google.com/citations?user=hvasquez" }],
    },
    summary:
      "Associate Professor working at the intersection of machine learning and single-cell genomics. Lead investigator on two NIH-funded projects, with 34 peer-reviewed publications and a track record of graduating PhD students into industry and academia.",
    experience: [
      {
        id: newId(),
        role: "Associate Professor",
        company: "Department of Biomedical Informatics",
        location: "Cambridge, MA",
        employmentType: "full-time",
        startDate: "2021-07",
        endDate: "",
        current: true,
        description: "Principal investigator, Vasquez Lab (9 members).",
        bullets: [
          "Principal investigator on an R01 grant ($2.4M, 2023–2028).",
          "Published 11 papers in the last three years, including two in Nature Methods.",
          "Supervised 4 PhD students and 6 postdoctoral researchers to completion.",
        ],
      },
      {
        id: newId(),
        role: "Assistant Professor",
        company: "Department of Biomedical Informatics",
        location: "Cambridge, MA",
        employmentType: "full-time",
        startDate: "2016-08",
        endDate: "2021-06",
        current: false,
        description: "Established an independent research programme.",
        bullets: [
          "Secured a K99/R00 pathway-to-independence award.",
          "Developed scDeep, a method now cited 1,400+ times.",
        ],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "Ph.D. Computational Biology",
        degreeLevel: "doctorate",
        field: "Computational Biology",
        school: "Massachusetts Institute of Technology",
        location: "Cambridge, MA",
        startDate: "2010-09",
        endDate: "2015-06",
        current: false,
        grade: "",
        description: "Thesis: probabilistic models of transcriptional heterogeneity.",
        bullets: [],
      },
      {
        id: newId(),
        degree: "B.Sc. Applied Mathematics",
        degreeLevel: "bachelor",
        field: "Applied Mathematics",
        school: "Universidad de Chile",
        location: "Santiago, Chile",
        startDate: "2006-03",
        endDate: "2010-01",
        current: false,
        grade: "Summa Cum Laude",
        description: "",
        bullets: [],
      },
    ],
    projects: [
      {
        id: newId(),
        name: "scDeep",
        role: "Principal investigator",
        link: "github.com/vasquezlab/scdeep",
        tech: "Python, PyTorch, Scanpy",
        startDate: "2018-01",
        endDate: "",
        description: "Variational autoencoder for imputing dropout in single-cell RNA-seq data.",
        bullets: ["Cited 1,400+ times.", "Adopted by 40+ labs worldwide."],
      },
      {
        id: newId(),
        name: "Atlas of Human Development",
        role: "Co-investigator",
        link: "",
        tech: "Nextflow, AWS Batch",
        startDate: "2022-03",
        endDate: "",
        description: "Multi-institution consortium building a developmental cell atlas.",
        bullets: ["Processed 4.2M cells across 18 tissue types."],
      },
    ],
    awards: [
      {
        id: newId(),
        title: "NIH Director's New Innovator Award",
        issuer: "National Institutes of Health",
        date: "2022-09",
        description: "For methodological advances in single-cell representation learning.",
      },
      {
        id: newId(),
        title: "Best Paper — RECOMB",
        issuer: "RECOMB Conference",
        date: "2019-05",
        description: "Awarded for the scDeep methods paper.",
      },
    ],
    skills: [
      { id: newId(), name: "Python / PyTorch", category: "Methods", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Statistical Modelling", category: "Methods", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Single-cell Genomics", category: "Domain", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Grant Writing", category: "Academic", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Research Supervision", category: "Academic", level: 5, showBar: true, extra: "" },
    ],
    languages: [
      { id: newId(), name: "Spanish", level: "native", detail: "" },
      { id: newId(), name: "English", level: "full-professional", detail: "" },
      { id: newId(), name: "Portuguese", level: "limited-working", detail: "" },
    ],
    references: [
      {
        id: newId(),
        name: "Prof. Martin Ellery",
        role: "Department Chair",
        company: "Massachusetts Institute of Technology",
        contact: "ellery@example.edu",
        relationship: "Department chair",
      },
    ],
    extra: {
      publications: true,
      showPhoto: false,
      skillBars: false,
      socialIcons: true,
      tagline: "Machine learning for single-cell genomics.",
    },
  };
}

function executive(): CVData {
  const doc = base([
    "summary",
    "experience",
    "education",
    "certifications",
    "skills",
    "awards",
    "languages",
    "references",
  ]);
  return {
    ...doc,
    personal: {
      ...doc.personal,
      firstName: "Marcus",
      lastName: "Lindqvist",
      jobTitle: "Chief Operating Officer",
      email: "marcus.lindqvist@example.com",
      phone: "+46 8 555 0142",
      address: "Stockholm, Sweden",
      website: "",
      linkedin: "linkedin.com/in/marcuslindqvist",
      github: "",
      tagline: "Scaling operations from 40 to 400 people without losing the plot.",
      extraLinks: [],
    },
    summary:
      "Chief Operating Officer with 18 years leading operations, supply chain and commercial teams across Europe and North America. Took two companies through Series C and one through acquisition. Focused on operating cadence, unit economics and building leaders, not just processes.",
    experience: [
      {
        id: newId(),
        role: "Chief Operating Officer",
        company: "Nordvane Group",
        location: "Stockholm, Sweden",
        employmentType: "full-time",
        startDate: "2019-01",
        endDate: "",
        current: true,
        description: "Operations, supply chain and customer success for a 420-person group.",
        bullets: [
          "Grew revenue from €38M to €131M over five years at a 22% EBITDA margin.",
          "Consolidated 6 regional warehouses into 2 hubs, cutting fulfilment cost 31%.",
          "Built the leadership team: hired and developed 11 director-level reports.",
        ],
      },
      {
        id: newId(),
        role: "VP Operations",
        company: "Baltic Freight Systems",
        location: "Copenhagen, Denmark",
        employmentType: "full-time",
        startDate: "2013-05",
        endDate: "2018-12",
        current: false,
        description: "Led a 300-person operations organisation through rapid expansion.",
        bullets: [
          "Scaled headcount from 90 to 300 while holding attrition below 9%.",
          "Delivered the ERP replacement programme on time and 8% under budget.",
        ],
      },
      {
        id: newId(),
        role: "Director of Supply Chain",
        company: "Hemvik Industries",
        location: "Gothenburg, Sweden",
        employmentType: "full-time",
        startDate: "2007-08",
        endDate: "2013-04",
        current: false,
        description: "Owned procurement, planning and logistics for a manufacturing group.",
        bullets: ["Negotiated a 5-year supplier framework saving €4.2M annually."],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "M.B.A.",
        degreeLevel: "master",
        field: "Business Administration",
        school: "Stockholm School of Economics",
        location: "Stockholm, Sweden",
        startDate: "2005-08",
        endDate: "2007-06",
        current: false,
        grade: "",
        description: "",
        bullets: [],
      },
      {
        id: newId(),
        degree: "M.Sc. Industrial Engineering",
        degreeLevel: "master",
        field: "Industrial Engineering",
        school: "Chalmers University of Technology",
        location: "Gothenburg, Sweden",
        startDate: "2000-08",
        endDate: "2005-06",
        current: false,
        grade: "Honours",
        description: "",
        bullets: [],
      },
    ],
    certifications: [
      {
        id: newId(),
        name: "INSEAD Executive Programme — Leading for Growth",
        issuer: "INSEAD",
        date: "2017-09",
        credentialId: "",
        url: "",
      },
    ],
    skills: [
      { id: newId(), name: "Operational Strategy", category: "Leadership", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "P&L Ownership", category: "Finance", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Supply Chain", category: "Operations", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "M&A Integration", category: "Finance", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Change Management", category: "Leadership", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Board Reporting", category: "Governance", level: 5, showBar: true, extra: "" },
    ],
    awards: [
      {
        id: newId(),
        title: "Nordic Operations Leader of the Year",
        issuer: "Nordic Business Forum",
        date: "2023-04",
        description: "Recognised for the warehouse consolidation programme.",
      },
    ],
    languages: [
      { id: newId(), name: "Swedish", level: "native", detail: "" },
      { id: newId(), name: "English", level: "full-professional", detail: "" },
      { id: newId(), name: "German", level: "professional-working", detail: "" },
      { id: newId(), name: "Danish", level: "professional-working", detail: "" },
    ],
    references: [
      {
        id: newId(),
        name: "Ingrid Solberg",
        role: "Chair of the Board",
        company: "Nordvane Group",
        contact: "ingrid.solberg@example.com",
        relationship: "Board chair",
      },
    ],
    extra: {
      showPhoto: true,
      metricHighlights: true,
      socialIcons: true,
      tagline: "Scaling operations from 40 to 400 people without losing the plot.",
    },
  };
}

/* ------------------------------- registry -------------------------------- */

export const SAMPLE_PERSONAS: SamplePersona[] = [
  { id: "designer", label: "Product Designer", categories: ["Creative", "Modern", "Minimal"], data: designer() },
  { id: "engineer", label: "Backend Engineer", categories: ["Tech", "Modern"], data: engineer() },
  { id: "nurse", label: "Registered Nurse", categories: ["Professional"], data: nurse() },
  { id: "marketer", label: "Growth Marketer", categories: ["Creative", "Modern"], data: marketer() },
  { id: "academic", label: "Associate Professor", categories: ["Academic"], data: academic() },
  { id: "executive", label: "Chief Operating Officer", categories: ["Executive", "Professional"], data: executive() },
];

const BY_ID = new Map(SAMPLE_PERSONAS.map((persona) => [persona.id, persona]));

/**
 * Deterministic persona for a template, chosen by category so the gallery looks
 * varied (rather than 60 renders of the same designer) and stable (the same
 * template always shows the same person, so thumbnails and live previews agree).
 *
 * The `offset` mixes templates within one category so neighbouring cards differ.
 */
export function personaForCategory(
  category: TemplateCategory,
  offset = 0,
): SamplePersona {
  const matches = SAMPLE_PERSONAS.filter((persona) => persona.categories.includes(category));
  const pool = matches.length > 0 ? matches : SAMPLE_PERSONAS;
  return pool[Math.abs(offset) % pool.length];
}

/** FNV-1a — tiny, dependency-free, stable across runs. */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Persona chosen deterministically for a template id. */
export function personaForTemplate(templateId: string, category: TemplateCategory): SamplePersona {
  return personaForCategory(category, hashString(templateId));
}

export function getPersona(id: PersonaId): SamplePersona {
  const persona = BY_ID.get(id);
  if (!persona) throw new Error(`Unknown sample persona "${id}"`);
  return persona;
}
