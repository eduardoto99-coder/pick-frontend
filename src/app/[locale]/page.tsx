import type { Metadata } from "next";
import Box from "@mui/material/Box";
import HeroSection from "@/sections/landing/HeroSection";
import JourneySection from "@/sections/landing/JourneySection";
import SocialProofSection from "@/sections/landing/SocialProofSection";
import HighlightsSection from "@/sections/landing/HighlightsSection";
import LandingHeader from "@/components/navigation/LandingHeader";
import LandingFooter from "@/components/navigation/LandingFooter";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale } from "@/i18n/config";

type PageParams = {
  params: {
    locale: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(defaultLocale);

  return {
    title: dictionary.hero.title,
    description: dictionary.hero.description,
  };
}

export default async function LandingPage({ params }: PageParams) {
  // TODO: re-enable locale-based rendering (e.g., "en") when English copy is ready
  const locale = defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <LandingHeader locale={locale} />
      <Box component="main" id="main-content">
        <HeroSection copy={dictionary.hero} locale={locale} />
        <JourneySection copy={dictionary.journey} />
        <SocialProofSection copy={dictionary.socialProof} />
        <HighlightsSection copy={dictionary.highlights} locale={locale} />
      </Box>
      <LandingFooter locale={locale} />
    </>
  );
}
