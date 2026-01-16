import type { Metadata } from "next";
import Box from "@mui/material/Box";

import LandingHeader from "@/components/navigation/LandingHeader";
import ProfileManager from "@/sections/profile/ProfileManager";
import { getProfileCopy } from "@/sections/profile/profile-copy";

type PageParams = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const copy = getProfileCopy(params.locale);
  return {
    title: copy.title,
    description: copy.subtitle,
  };
}

export default function ProfilePage({ params }: PageParams) {
  return (
    <>
      <LandingHeader locale={params.locale} />
      <Box component="main" id="main-content">
        <ProfileManager locale={params.locale} />
      </Box>
    </>
  );
}
