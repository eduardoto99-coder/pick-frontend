import type { Metadata } from "next";
import Box from "@mui/material/Box";

import LandingHeader from "@/components/navigation/LandingHeader";
import MatchesDashboard from "@/sections/matches/MatchesDashboard";
import { getMatchesCopy } from "@/sections/matches/matches-copy";

type PageParams = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const copy = getMatchesCopy(params.locale);
  return {
    title: copy.title,
    description: copy.subtitle,
  };
}

export default function MatchesPage({ params }: PageParams) {
  return (
    <>
      <LandingHeader locale={params.locale} />
      <Box component="main" id="main-content">
        <MatchesDashboard locale={params.locale} />
      </Box>
    </>
  );
}
