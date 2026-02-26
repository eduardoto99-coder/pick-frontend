import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { TrustCopy } from "@/i18n/types";

const iconMap: Record<number, ReactNode> = {
  0: <ReportGmailerrorredRoundedIcon color="primary" />,
  1: <GppGoodRoundedIcon color="primary" />,
  2: <LocationOnRoundedIcon color="primary" />,
  3: <PrivacyTipRoundedIcon color="primary" />,
};

type TrustSectionProps = {
  copy: TrustCopy;
};

export default function TrustSection({ copy }: TrustSectionProps) {
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
        background: "linear-gradient(180deg, #FFFFFF 0%, #F7FAFA 100%)",
      }}
    >
      <Container>
        <Stack spacing={{ xs: 5, md: 6 }}>
          <Stack spacing={2} maxWidth={{ md: 680 }}>
            <Typography variant="h2" id={headingId}>
              {copy.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" id={descriptionId}>
              {copy.description}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 3, md: 4 },
            }}
          >
            {copy.measures.map((measure, index) => (
              <Card
                key={measure.title}
                elevation={0}
                sx={{
                  border: "1px solid rgba(11, 35, 51, 0.1)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 4.5 }, height: "100%" }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {iconMap[index] ?? <GppGoodRoundedIcon color="primary" />}
                      <Typography variant="h4">{measure.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {measure.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
          {copy.note ? (
            <Typography variant="subtitle1" color="text.primary">
              {copy.note}
            </Typography>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
