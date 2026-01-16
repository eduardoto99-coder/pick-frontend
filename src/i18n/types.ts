export type Locale = "es" | "en";

export type HeroCopy = {
  id: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  differentiators: string[];
  cardTitle: string;
  cardPoints: string[];
  messagePreviewLabel: string;
  messagePreview: string;
};

export type JourneyCopy = {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
};

export type SocialProofCopy = {
  id: string;
  title: string;
  subtitle: string;
  disclaimer?: string;
  stories: Array<{
    quote: string;
    name: string;
    role: string;
  }>;
};

export type HighlightsCopy = {
  id: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
  closingCta: {
    label: string;
    href: string;
  };
};

export type LandingDictionary = {
  hero: HeroCopy;
  journey: JourneyCopy;
  socialProof: SocialProofCopy;
  highlights: HighlightsCopy;
};
