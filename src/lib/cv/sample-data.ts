import type { CVData } from "./schema";
import { createEmptyCVData, newId } from "./defaults";

/**
 * Realistic sample CV used by the "Autofill sample data" button in the editor.
 * Every field is filled so all template layouts can be previewed properly.
 */
export function createSampleCVData(): CVData {
  const base = createEmptyCVData();

  return {
    ...base,
    personal: {
      ...base.personal,
      firstName: "Amara",
      lastName: "Okafor",
      jobTitle: "Senior Product Designer",
      email: "amara.okafor@example.com",
      phone: "+1 (415) 555-0134",
      address: "San Francisco, CA, United States",
      website: "amaraokafor.design",
      linkedin: "linkedin.com/in/amaraokafor",
      github: "github.com/amaraokafor",
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
        bullets: [
          "Designed and launched 15 marketing sites with an average 94 Lighthouse score.",
        ],
      },
    ],
    education: [
      {
        id: newId(),
        degree: "B.Sc. Human Computer Interaction",
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
      {
        id: newId(),
        degree: "Interaction Design Certificate",
        degreeLevel: "certificate",
        field: "Interaction Design",
        school: "CIID",
        location: "Copenhagen, Denmark",
        startDate: "2018-07",
        endDate: "2018-08",
        current: false,
        grade: "",
        description: "Intensive summer programme on service and interaction design.",
        bullets: [],
      },
    ],
    skills: [
      { id: newId(), name: "Design Systems", category: "Design", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Figma", category: "Tools", level: 5, showBar: true, extra: "" },
      { id: newId(), name: "Prototyping", category: "Design", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "User Research", category: "Research", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "HTML & CSS", category: "Engineering", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Accessibility (WCAG)", category: "Design", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Data-informed design", category: "Product", level: 4, showBar: true, extra: "" },
      { id: newId(), name: "Workshop facilitation", category: "Leadership", level: 5, showBar: true, extra: "" },
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
        bullets: [
          "4.8k stars and 60+ contributors.",
          "Token pipeline generates themes for web, iOS and Android.",
        ],
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
      {
        id: newId(),
        title: "Speaker Award — Config Community",
        issuer: "Config",
        date: "2022-06",
        description: "Top-rated talk on scalable design systems.",
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
      { id: newId(), name: "Mentoring" },
    ],
    customSections: [
      {
        id: newId(),
        title: "Volunteering",
        items: [
          {
            id: newId(),
            heading: "Design mentor",
            subheading: "ADPList",
            date: "2021 – Present",
            description: "Mentoring early-career designers across Africa and Europe.",
            bullets: [],
          },
        ],
      },
    ],
    extra: {
      tagline: "Designing calm, accessible products used by millions.",
      showQr: false,
      showPhoto: true,
      skillBars: true,
      socialIcons: true,
    },
  };
}
