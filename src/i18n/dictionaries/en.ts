import type { LandingDictionary } from "../types";

const en: LandingDictionary = {
  hero: {
    id: "home",
    title: "Pick writes your WhatsApp intro and pairs you with someone on your wavelength.",
    description:
      "Plans are always proposed in public places for safer interactions. Share the plan and city—Pick matches you, writes the intro in your tone, and opens WhatsApp ready to send so you can confirm fast.",
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
      "Matches ready to move in any city, free and no subscription",
      "Crossed interests and timing so you decide fast",
    ],
    cardTitle: "How Pick gets you talking",
    cardPoints: [
      "Describe the plan and city; add vibe and time.",
      "Pick selects the right person and drafts the automatic intro in your voice.",
      "Open WhatsApp, hit send, and lock place and time in minutes.",
    ],
    messagePreviewLabel: "Preview of the automatic message",
    messagePreview:
      "Hey Ana, it’s Alex. Down for the rooftop in Roma Norte this Friday 8pm? I’ll book a table and share the playlist—if it works I’ll send the pin.",
  },
  journey: {
    id: "journey",
    title: "Three steps from “who’s in?” to “chat is open”.",
    description: "Built to define the plan, match, and chat fast.",
    steps: [
      {
        title: "1. Share the plan",
        description: "Pick the city and activity—party, sports, networking, exploring.",
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
      "These are not real testimonials. They are representative examples of how Pick can help by city, interest, and plan type.",
    disclaimer:
      "Hypothetical examples inspired by real product usage patterns.",
    stories: [
      {
        title: "A local friend to discover Medellin",
        description:
          "With Pick, you could meet a local friend in Medellin to explore nightlife near Comuna 13 and get to know the city with someone who already lives it.",
        context: "New city + tourism + nightlife",
      },
      {
        title: "A partner for your hobby plan",
        description:
          "With Pick, you could find someone to play soccer with after work, lock a public field, and build a weekly plan in your city.",
        context: "Specific interest + recurring plan",
      },
      {
        title: "Networking that turns into action",
        description:
          "With Pick, you could connect with software profiles to grab coffee, exchange ideas, and open real collaborations in the same city.",
        context: "Networking + collaboration",
      },
    ],
  },
  highlights: {
    id: "highlights",
    title: "Why Pick speeds up one-to-one plans.",
    description: "AI plus human touch so you get a ready-to-send WhatsApp intro.",
    items: [
      {
        title: "Activity-led planning",
        description:
          "Select the vibe and city; we coordinate timing and interests to surface the right partner.",
      },
      {
        title: "Artificial intelligence that sparks conversation",
        description:
          "Intros arrive with context and a clear first move—already ready to drop into WhatsApp—so no one is stuck saying 'hey'.",
      },
      {
        title: "Momentum that keeps rolling",
        description:
          "Feedback unlocks new suggestions and gentle reminders so the plan actually happens.",
      },
    ],
    closingCta: {
      label: "Plan your next hangout",
      href: "/app",
    },
  },
};

export default en;
