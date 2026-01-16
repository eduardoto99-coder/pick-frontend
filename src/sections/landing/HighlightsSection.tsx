"use client";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { HighlightsCopy } from "@/i18n/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAccountLinks } from "@/hooks/use-account-links";

const iconMap: Record<number, ReactNode> = {
  0: <LightbulbRoundedIcon color="primary" />,
  1: <FavoriteRoundedIcon color="primary" />,
  2: <RocketLaunchRoundedIcon color="primary" />,
};

type HighlightsSectionProps = {
  copy: HighlightsCopy;
  locale?: string;
};

export default function HighlightsSection({ copy, locale = "es" }: HighlightsSectionProps) {
  const { hasSession, profileHref, signInHref } = useAccountLinks(locale);
  const ctaHref = hasSession ? profileHref : signInHref;
  const headingId = `${copy.id}-heading`;
  const descriptionId = `${copy.id}-description`;

  return (
    <Box
      component="section"
      id={copy.id}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: "#FFFFFF",
      }}
    >
      <Container>
        <Stack spacing={{ xs: 5, md: 6 }}>
          <Stack spacing={2} maxWidth={{ md: 600 }}>
            <Typography variant="h2" id={headingId}>
              {copy.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" id={descriptionId}>
              {copy.description}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 4 }}
            alignItems="stretch"
          >
            {copy.items.map((item, index) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  flex: 1,
                  border: "1px solid rgba(11, 35, 51, 0.08)",
                  background: "#F5F2EB",
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 4.5 } }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {iconMap[index] ?? <LightbulbRoundedIcon color="primary" />}
                      <Typography variant="h4">{item.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
          <Button
            component={Link}
            href={ctaHref}
            variant="contained"
            color="primary"
            size="large"
            sx={{ alignSelf: { xs: "stretch", md: "flex-start" }, minWidth: 220 }}
          >
            {copy.closingCta.label}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
