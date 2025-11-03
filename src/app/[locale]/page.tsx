import type { Metadata } from "next";
import Box from "@mui/material/Box";
import HeroSection from "@/sections/landing/HeroSection";
import JourneySection from "@/sections/landing/JourneySection";
import SocialProofSection from "@/sections/landing/SocialProofSection";
import HighlightsSection from "@/sections/landing/HighlightsSection";
import LandingHeader from "@/components/navigation/LandingHeader";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales } from "@/i18n/config";

type PageParams = {
  params: {
    locale: string;
  };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);

  return {
    title: dictionary.hero.title,
    description: dictionary.hero.description,
  };
}

export default async function LandingPage({ params }: PageParams) {
  const dictionary = await getDictionary(params.locale);

  return (
    <Box component="main">
      <LandingHeader />
      <HeroSection copy={dictionary.hero} />
      <JourneySection copy={dictionary.journey} />
      <SocialProofSection copy={dictionary.socialProof} />
      <HighlightsSection copy={dictionary.highlights} />
    </Box>
  );
}
