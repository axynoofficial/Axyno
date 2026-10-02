/**
 * ==============================================================================
 * AXYNO — CENTRAL CONFIGURATION & CONTENT DATA
 * ==============================================================================
 * This file controls all site content, assets, prices, and interactive settings.
 * To update anything on the website, simply edit the values below.
 * ==============================================================================
 */

const AXYNO_CONFIG = {
  // BRAND & IDENTITY
  brand: {
    name: "Axyno",
    tagline: "Ideas. Built Better.",
    motto: "Ideas for a better tomorrow",
    description: "Axyno is a premium digital and creative technology brand focused on innovation, technology, creativity, and future-ready solutions.",
    foundedYear: 2026,
    logo: {
      icon: "assets/axyno-icon-3d.png",
      wordmark: "assets/axyno-wordmark.png",
      full: "assets/axyno-logo-full.png",
      favicon: "assets/axyno-app-icon.png",
      alt: "Axyno — Creative Technology & Product Studio"
    }
  },

  // 1. INTRO / OPENING ANIMATION
  // Set enabled: false to skip intro entirely
  // Set playOncePerSession: true to avoid replaying when browsing
  // Set videoUrl: "assets/axyno-intro.mp4" (or null to use the CSS gold light sweep fallback)
  introAnimation: {
    enabled: true,
    playOncePerSession: true,
    videoUrl: "assets/axyno-intro.mp4",
    durationMs: 3200,
    allowSkip: true
  },

  // 2. HERO SECTION
  hero: {
    eyebrow: "Digital Product & Creative Technology Studio",
    headline: "Ideas.<br>Built <em>Better.</em>",
    description: "Axyno is a premium digital and creative technology brand focused on innovation, technology, creativity, and future-ready solutions.",
    buttons: {
      primary: { label: "View Our Works", href: "#works" },
      secondary: { label: "Start a Project", href: "#contact" }
    },
    metrics: [
      { value: "5", label: "Works Completed" },
      { value: "2026", label: "Founded" },
      { value: "99%", label: "Satisfaction" }
    ]
  },

  // 4. SELECTED WORKS / PROJECTS (Easily add, reorder, or edit projects here)
  projects: [
    {
      id: "malabar-agro-park",
      name: "Malabar Agro Park Website",
      category: "Web Development",
      year: "2026",
      shortDescription: "A modern website created for Malabar Agro Park to present its brand, products, and online presence.",
      image: "assets/axyno-mockup-building.png",
      url: "https://malabaragropark.netlify.app/",
      tags: ["Web Development", "UI Design", "Responsive Design"],
      client: "Malabar Agro Park",
      deliverables: ["Website Design", "Responsive Development", "Product Presentation"],
      overview: "Designed and developed a modern web presence for Malabar Agro Park with a premium visual direction and responsive experience."
    }
  ],

  // 5. SERVICES
  services: [
    {
      id: "graphic-designing",
      name: "Graphic Designing",
      description: "Creative poster designs, social media graphics, promotional visuals, and other custom graphic design work.",
      icon: "spark",
      tags: ["Poster Design", "Social Media Graphics", "Custom Designs"]
    },
    {
      id: "video-editing",
      name: "Video Editing",
      description: "Small to medium-level video editing for social media, promotional content, events, and creative projects.",
      icon: "cube",
      tags: ["Short Videos", "Promotional Edits", "Social Media Content"]
    },
    {
      id: "wedding-web-development",
      name: "Wedding Web Development",
      description: "Personalized wedding websites designed to present the couple, event details, memories, and important information in one place.",
      icon: "code",
      tags: ["Wedding Websites", "Responsive Design", "Custom Content"]
    }
  ],

  // 6. PRICING (Centrally editable prices & deliverables)
  pricing: [
    {
      id: "wedding",
      name: "WEDDING",
      subtitle: "Wedding website",
      price: "₹500",
      period: "starting from",
      description: "A personalized wedding website for presenting the couple and their special day.",
      featured: true,
      badge: "Popular",
      features: [
        "Responsive wedding website",
        "Couple and event details",
        "Clean and premium design",
        "Custom content based on your requirements",
        "Revisions can be discussed"
      ],
      ctaText: "Get Started"
    },
    {
      id: "poster",
      name: "POSTER",
      subtitle: "Graphic / poster design",
      price: "₹300",
      period: "starting from",
      description: "Custom poster and graphic design for events, promotions, social media, and other needs.",
      featured: false,
      badge: null,
      features: [
        "Custom poster design",
        "Creative layout and typography",
        "High-quality digital output",
        "Design based on your requirements",
        "Revisions can be discussed"
      ],
      ctaText: "Get Started"
    },
    {
      id: "custom",
      name: "OTHER",
      subtitle: "For other requirements",
      price: "Custom",
      period: "discuss with us",
      description: "For services or projects outside the listed packages, pricing and scope can be discussed based on the requirement.",
      featured: false,
      badge: null,
      features: [
        "Custom project scope",
        "Flexible pricing",
        "Creative and technical solutions",
        "Timeline based on project scope",
        "If there is any problem, we can discuss it"
      ],
      ctaText: "Let's Talk"
    }
  ],

  // 7. ABOUT AXYNO
  about: {
    kicker: "About Axyno",
    headline: "Building Ideas Into Reality.",
    story: [
      "Axyno is a premium digital and creative technology brand focused on innovation, technology, creativity, and future-ready solutions.",
      "We create practical digital work across graphic design, video editing, and wedding web development, while exploring new creative technology ideas."
    ],
    philosophy: {
      quote: "“Good ideas deserve to be built well.”",
      description: "We don't just build something because it can be built. We first understand the problem, find a better approach, and then turn the idea into a practical digital experience."
    },
    highlights: [
      {
        number: "01",
        title: "THINK",
        description: "Understand the problem and find the opportunity."
      },
      {
        number: "02",
        title: "CREATE",
        description: "Turn ideas into thoughtful designs and experiences."
      },
      {
        number: "03",
        title: "BUILD",
        description: "Develop reliable, useful products that people can actually use."
      }
    ],
    asideImage: "assets/axyno-icon-3d.png"
  },

  // 8. FINAL CTA
  cta: {
    headline: "Have an idea?<br>Let's build it.",
    subheading: "Whether you have a fully scoped product or an early concept on a napkin, we help you bring it to life with precision and craft.",
    button: { label: "Start a Project", href: "#contact" }
  },

  // 9. CONTACT & SOCIALS
  contact: {
    email: "axynoofficial@gmail.com",
    phone: "",
    location: "",
    formAction: null, // Set your backend API endpoint or Formspree/Formspark URL here
    projectTypes: [
      "Wedding Web Development",
      "Graphic Designing",
      "Video Editing",
      "Other / Custom Inquiry"
    ],
    budgetRanges: [
      "Under ₹500",
      "₹500 – ₹1000",
      "Undecided / Flexible"
    ]
  },

  socials: [
    // Add official social links when ready
  ],

  // 10. FOOTER
  footer: {
    copyright: "© {year} Axyno. All rights reserved.",
    tagline: "Ideas for a better tomorrow — a digital product and creative technology studio.",
    legal: {
      privacy: {
        title: "Privacy Policy",
        content: "At Axyno, we respect your privacy and are committed to protecting your personal data. Any contact details submitted through our forms are used solely for direct business communication regarding your project inquiry. We never sell, rent, or distribute client data to third parties."
      },
      terms: {
        title: "Terms of Service",
        content: "All design systems, source code, and assets produced during project engagements remain the intellectual property of the respective client upon project completion and receipt of final compensation. Axyno retains the right to present non-confidential deliverables for portfolio and case study presentation."
      }
    }
  }
};
