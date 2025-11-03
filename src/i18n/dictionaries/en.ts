import type { LandingDictionary } from "../types";

const en: LandingDictionary = {
  hero: {
    id: "home",
    title: "Find your partner-in-crime for every plan, from rooftop parties to hackathons.",
    description:
      "Pick’s AI understands what you’re in the mood for—night out, foodie tour, cowork sprint—and introduces you to someone who wants the same. Get a ready-to-send WhatsApp message so you can confirm plans instantly.",
    primaryCta: {
      label: "Start your plan",
      href: "/app",
    },
    secondaryCta: {
      label: "See how Pick works",
      href: "#journey",
    },
    differentiators: [
      "AI-powered matching tuned to your vibe and availability",
      "Activity-ready intros in any city you land in",
      "Suggested venues, prompts, and reminders so the plan actually happens",
    ],
    cardTitle: "How Pick supports every hangout",
    cardPoints: [
      "Tell us the plan (after-party in Berlin, rooftop in New York, sunrise hike in Cape Town) and when you’re free.",
      "Our AI builds the perfect icebreaker with venue ideas, playlists, and a clear first step.",
      "Lock the plan in minutes, share how it went, and unlock fresh matches whenever you’re ready.",
    ],
  },
  journey: {
    id: "journey",
    title: "Three steps from “who’s in?” to “see you at 8pm”.",
    description:
      "Each stage helps you define the plan, get the right plus-one, and make it happen without friction.",
    steps: [
      {
        title: "1. Share the plan",
        description:
          "Pick the activity and city—party, networking, live show, coffee crawl—and add your availability.",
      },
      {
        title: "2. Let AI curate your match",
        description:
          "Pick analyses your mood, pace, and interests to connect you with someone who wants the same thing and drafts the intro.",
      },
      {
        title: "3. Lock it in and enjoy",
        description:
          "Confirm the spot, get gentle nudges so no one ghosts, and share feedback to keep new adventures coming.",
      },
    ],
  },
  socialProof: {
    id: "social-proof",
    title: "Real people turning introductions into long-lasting support.",
    subtitle:
      "Hybrid professionals, creatives, and community hosts rely on Pick to find partners with genuine intent.",
    stories: [
      {
        quote:
          "Landed in Paris with zero contacts. Pick matched me with Luc, we hit a bar in Le Marais, and danced till close.",
        name: "Carla · Content Creator",
        role: "Paris",
      },
      {
        quote:
          "Met Sam through Pick while both scouting co-founders. We’re now building a logistics AI startup between Madrid and São Paulo.",
        name: "Camila · CTO in the making",
        role: "Madrid · São Paulo",
      },
      {
        quote:
          "Needed a hiking buddy while working remotely in Vancouver. Pick paired me with Laura—now we tackle a new trail every Sunday morning.",
        name: "Diego · Product Manager",
        role: "Vancouver",
      },
    ],
  },
  highlights: {
    id: "highlights",
    title: "Why Pick is the activity-first companion you’ve been missing.",
    description:
      "We blend thoughtful AI with human touch so you can focus on the experience, not the logistics.",
    items: [
      {
        title: "Activity-led planning",
        description:
          "Select the vibe and city; we coordinate timing, energy, and interests to surface the ideal partner.",
      },
      {
        title: "AI that sparks conversation",
        description:
          "Intros arrive with shared touchpoints, venue ideas, and curated prompts so no one is stuck saying 'hey'.",
      },
      {
        title: "Momentum that keeps rolling",
        description:
          "Feedback unlocks new suggestions, helping you build a calendar full of unforgettable one-to-one experiences.",
      },
    ],
    closingCta: {
      label: "Plan your next hangout",
      href: "/app",
    },
  },
};

export default en;
