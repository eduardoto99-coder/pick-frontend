import type { Metadata } from "next";
import Box from "@mui/material/Box";

import LandingHeader from "@/components/navigation/LandingHeader";
import ProfileManager from "@/sections/profile/ProfileManager";
import { getProfileCopy } from "@/sections/profile/profile-copy";

type PageParams = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const resolvedParams = await params;
  const copy = getProfileCopy(resolvedParams.locale);
  return {
    title: copy.title,
    description: copy.subtitle,
  };
}

export default async function ProfilePage({ params }: PageParams) {
  const resolvedParams = await params;
  return (
    <>
      <LandingHeader locale={resolvedParams.locale} />
      <Box component="main" id="main-content">
        <ProfileManager locale={resolvedParams.locale} />
      </Box>
    </>
  );
}
