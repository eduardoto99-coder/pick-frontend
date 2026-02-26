import type { LandingDictionary } from "../types";

const en: LandingDictionary = {
  hero: {
    id: "home",
    title: "Connect 1:1 in your city with people who match your plan.",
    description:
      "Pick is not a dating app. It helps you build friendships, hobbies, communities, and professional connections by city and interest, with a WhatsApp intro ready to send.",
    primaryCta: {
      label: "Start your plan",
      href: "/app",
    },
    secondaryCta: {
      label: "See how Pick works",
      href: "#journey",
    },
    differentiators: [
      "AI-generated intro ready in WhatsApp",
      "Curated matches by city, interest, and timing",
      "Visible safety and privacy tools",
    ],
    cardTitle: "How Pick gets you talking",
    cardPoints: [
      "Choose city and plan type: sports, culture, language exchange, wellness, business, and more.",
      "Pick suggests a compatible person and drafts the automatic intro in your voice.",
      "Open WhatsApp, hit send, and lock place and time in minutes.",
    ],
    messagePreviewLabel: "Preview of the automatic message",
    messagePreview:
      "Hey Maya, it’s Jordan. I saw we both like photography and we are in Chicago. Want to do a street-photo walk this Saturday morning?",
  },
  journey: {
    id: "journey",
    title: "Three steps from “who’s in?” to “chat is open”.",
    description: "Built to define the plan, match, and chat fast.",
    steps: [
      {
        title: "1. Share the plan",
        description:
          "Pick the city and activity: book club, bike ride, language exchange, local exploring, volunteering, or networking.",
      },
      {
        title: "2. Pick writes and opens the intro in WhatsApp",
        description:
          "AI aligns interests and timing, selects the match, and drops the automatic intro ready to send.",
      },
      {
        title: "3. Confirm and go",
        description: "Agree on spot and time in the chat, then share feedback for the next plan.",
      },
    ],
  },
  socialProof: {
    id: "social-proof",
    title: "Scenarios you could live with Pick.",
    subtitle:
      "Representative examples across different cities, interests, and user profiles.",
    disclaimer:
      "Hypothetical examples inspired by real product usage patterns.",
    stories: [
      {
        title: "You moved to New York and want a cultural plan",
        description:
          "If you relocated for work or study, Pick can connect you with someone to explore museums, neighborhood events, or a local coffee route.",
        context: "New city + culture + friendship",
      },
      {
        title: "Restart your hobby in Austin without doing it alone",
        description:
          "You can find someone to run, ride, dance, or train after work and turn that interest into a weekly routine.",
        context: "Wellness + sports + routine",
      },
      {
        title: "Networking beyond tech circles",
        description:
          "From design and education to hospitality and sales, Pick helps you meet aligned profiles in your city for useful conversations and real collaboration.",
        context: "Career + collaboration",
      },
    ],
  },
  trust: {
    id: "safety",
    title: "Safety and trust are visible in every connection",
    description: "Before, during, and after a match, you have clear controls to protect your experience.",
    measures: [
      {
        title: "Report and block quickly",
        description:
          "If something feels off, you can report profiles and block contacts to stop interaction immediately.",
      },
      {
        title: "Anti-abuse filters",
        description:
          "We apply checks to detect offensive language, spam, or risky behavior in profiles and suggested messages.",
      },
      {
        title: "Safer meeting guidance",
        description:
          "We promote public places, basic identity checks, and sharing your plan with a trusted contact.",
      },
      {
        title: "Responsible data handling",
        description:
          "We collect only what is needed to improve matching, with privacy controls and data-rights processes.",
      },
    ],
    note: "Trust is not optional; it is a core design principle in Pick.",
  },
  highlights: {
    id: "highlights",
    title: "Who Pick is for",
    description: "If you want meaningful one-to-one connections by interest, Pick helps you find the right person fast.",
    items: [
      {
        title: "New city, new circle",
        description:
          "When you arrive in a city and know few people, Pick connects you with someone aligned with your plan.",
      },
      {
        title: "Specific interests",
        description:
          "If you want to activate something specific like chess, hiking, cooking, jazz, or running, Pick helps you find that match.",
      },
      {
        title: "Intentional networking",
        description:
          "Connect by city, industry, and goals across fields like healthcare, education, commerce, arts, and technology.",
      },
    ],
    closingCta: {
      label: "Plan your next hangout",
      href: "/app",
    },
  },
};

export default en;
